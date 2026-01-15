import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths ?? {}, { prefix: '<rootDir>/src/' });

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.controller.ts'],
  ...(moduleNameMapper ? { moduleNameMapper } : {}),
} satisfies JestConfigWithTsJest;

export default config;
