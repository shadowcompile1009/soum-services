import errorHandler from 'errorhandler';
import app from './app';

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

const port = app.get('port');
app.listen(port, () => {
  console.log('  Press CTRL-C to stop\n');
});
