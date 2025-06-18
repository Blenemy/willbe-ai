/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  moduleDirectories: ["node_modules", "src"],
};
