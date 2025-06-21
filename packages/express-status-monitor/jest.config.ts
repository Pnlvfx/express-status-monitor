import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig = {
  verbose: true,
  // detectOpenHandles: true,
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  testMatch: ['**/?(*.)+(test).ts'],
} satisfies JestConfigWithTsJest;

export default jestConfig;
