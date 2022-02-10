/**
 * @type {import("@jest/types").Config.InitialOptions}
 */
const config = {
  testEnvironment: "jsdom",
  "testMatch": [
    "**/*.test.(ts|js)",
    "**/*.test.(tsx|jsx)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/test/",
    "<rootDir>/dist/",
  ],
  transformIgnorePatterns: ["/node_modules/"],
  transform: {
    ".+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
    "^~~/(.*)$": "<rootDir>/$1",
  },
};

module.exports = config;
