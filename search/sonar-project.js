const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.inclusions': 'src/**/*.ts', // Entry point of your code
      'sonar.test.inclusions':
        'src/**/*.spec.ts,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
      'sonar.token': 'sqp_d3a472c204c12c7e532afa19280e74f8909c5d6d',
      'sonar.projectKey': 'search',
      'sonar.exclusions': 'src/modules/grpc/proto/*.ts',
    },
  },
  () => {
    console.log('Error Occurred while scanning');
  },
);
