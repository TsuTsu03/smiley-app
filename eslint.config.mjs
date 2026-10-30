import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "marketing-video/**",
      "marketing-screenshots/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
