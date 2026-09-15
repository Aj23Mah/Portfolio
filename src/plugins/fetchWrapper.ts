import { BASE_URL } from "@/config/baseURL";

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: ApiRequestConfig;
}

export class ApiError extends Error {
  response?: ApiResponse;
  status?: number;
  data?: any;

  constructor(message: string, response?: ApiResponse) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.status = response?.status;
    this.data = response?.data;
  }
}

/**
 * Reusable fetch wrapper that mimics Axios behavior
 */
export async function apiFetch<T = any>(
  url: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, timeout = 30000, headers: customHeaders, ...restConfig } = config;

  // 1. Handle URL and Query Params
  let fullUrl = url.startsWith("http") ? url : `${BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  // 2. Default Headers (Request Interceptor logic)
  const headers = new Headers({
    "Content-Type": "application/json",
    organization: "ajay", // Replicating axios.ts line 13
    ...customHeaders,
  });

  // 3. Request Body handling
  let body = restConfig.body;
  if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof Blob)) {
    body = JSON.stringify(body);
  }

  // 4. Timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      ...restConfig,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5. Parse Response Data
    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch (e) {
            data = null;
        }
    } else {
      data = await response.text();
    }

    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
    };

    // 6. Response Interceptor logic & Error handling
    if (!response.ok) {
      // Replicating axios.ts error handling
      const errorData = data?.error || data;
      console.log("API Error:", apiResponse);
      console.log({
        title: errorData?.name ?? "Error",
        message: errorData?.message ?? "Action could not be completed",
      });

      if (response.status === 401) {
        // Placeholder for auth redirect/refresh logic
      }

      throw new ApiError(errorData?.message || "Request failed", apiResponse);
    }

    // Success logic from axios.ts
    // if (response.status === 200) { /* data loaded successfully */ }

    return apiResponse;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ApiError("Request timeout", {
        data: { message: "Request timeout" },
        status: 408,
        statusText: "Request Timeout",
        headers: new Headers(),
        config,
      });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Network errors or other unexpected issues
    throw new ApiError(error.message || "Network Error");
  }
}
