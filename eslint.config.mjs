import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJsonConfig from './eslint.config.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...eslintJsonConfig,
];

export default eslintConfig;