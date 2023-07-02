const { codegen } = require('swagger-axios-codegen');

codegen({
  methodNameMode: 'path',
  source: require('./src/swagger/swagger.json'),
  outputDir: './src/services',
  fileName: 'swagger.gen.ts',
  modelMode: 'interface',
  serviceNameSuffix: 'Service',
  useStaticMethod: true,
});
