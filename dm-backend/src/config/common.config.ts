export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  grpc_port: parseInt(process.env.GRPC_PORT, 10) || 50051,
});
