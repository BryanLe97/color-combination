/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
    "plugin:prettier/recommended" // Add this line
  ],
  plugins: ["prettier"], // Add this line
  rules: {
    "prettier/prettier": "error" // Add this line to enforce Prettier rules
  }
}
