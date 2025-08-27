import app from './grpc-app';
import { startGRPCServer } from './grpc/server';

const port = app.get('port');
app.listen(port, () => {
  startGRPCServer();
});
