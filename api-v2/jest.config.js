module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    uuid: require.resolve('uuid'),
  },
  reporters: ['default', ['jest-junit', { suiteName: 'jest tests' }]],
  testMatch: ['**/test/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  modulePaths: ['<rootDir>/'],
  resolver: 'jest-node-exports-resolver',
  testTimeout: 20000,
};
