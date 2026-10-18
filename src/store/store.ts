// Zero-dependency store replacement (removes external zustand dependency)
type Listener = () => void;

let state: Record<string, any> = {
  menuData: [],
  productData: [],
  serviceData: [],
  footerData: [],
  loading: false,
  error: null,
};

const listeners = new Set<Listener>();

function setState(partial: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) {
  const next = typeof partial === "function" ? partial(state) : partial;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

state.setMenuData = (data: any) => setState({ menuData: data });
state.setProductData = (data: any) => setState({ productData: data });
state.setServiceData = (data: any) => setState({ serviceData: data });
state.setFooterData = (data: any) => setState({ footerData: data });

const useStore = (selector?: (s: any) => any) => {
  return selector ? selector(state) : state;
};

export default useStore;
