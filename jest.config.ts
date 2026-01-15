import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths ?? {}, { prefix: '<rootDir>/src/' });

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src'],
  ...(moduleNameMapper ? { moduleNameMapper } : {}),

  // Pick up *.spec.ts
  testMatch: ['**/*.spec.ts'],

  // ✅ COVER LIMIT: controllers only
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.controller.ts'],

  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  coverageReporters: ['text', 'lcov'],

  // Needed for TS → coverage mapping
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  clearMocks: true,
  testTimeout: 30000,
} satisfies JestConfigWithTsJest;

export default config;
