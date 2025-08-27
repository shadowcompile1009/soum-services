const express = require('express');
const exhbs = require('express-handlebars')
const NODE_ENV = process.env.NODE_ENV || "production"
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require("fs");
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const MongoDB = require("./config/mongoDb");
let cachedMongoDbConn = null;

if (cachedMongoDbConn && cachedMongoDbConn.serverConfig.isConnected()) {
  console.log("=> using cached database instance");
  Promise.resolve(cachedMongoDbConn);
} else {
  const db = new MongoDB();
  console.log("creating new MONGO connection");
  cachedMongoDbConn = db.connect();
}

Sentry.init({
  dsn: "https://39e06d440e5e436481316ab61373d1bc@o880275.ingest.sentry.io/6003594",
  environment : process.env.NODE_ENV ,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.2,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
if (
  process.env.ENVIRONMENT === 'production' ||
  process.env.ENVIRONMENT === 'qa'
) {
  require(`newrelic`);
}
// const logconnection = require('./config/log-connection.js');
// logconnection.Db_connect();

//console.log('Your port is', process.env.PORT);
console.log(`Your env is ${process.env.NODE_ENV}`);
app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use((req, res, next)=>{
  if(req.headers['x-original-forwarded-for']){
    Object.defineProperty(app.request, 'ip', {
      configurable: true,
      enumerable: true,
      get: function () { return req.headers['x-original-forwarded-for']; }
    })
  }
  next();
});

app.set("locale", "en");
global.LOCALE = app.get("locale");

app.set("env", process.env);
global.ENV = app.get("env");

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.text({
  limit: '50mb'
}));

app.get('/ip', (request, response) => response.send(request.ip));
app.get('/headers', (request, response) => response.json(request.headers));

app.get('/test', function (req, res) {
  res.send('Hello World !!')
});

app.get('/status', function (req, res) {
  res.send({status: "OK"})
});

//app.engine("handlebars",exphbs())
//app.set("view engine", "handlebars")

app.get('/sample', function (req, res) {
  //res.render('word-export/sample.html')
  res.sendFile(path.join(__dirname + '/word-export/sample.html'));
});

//app.use(express.static(__dirname + '/uploads'));
//app.use(express.static(__dirname + '/data_files'));
//app.use(express.static(__dirname + '/language-flag'));
//app.use(express.static(__dirname + '/assets'));
app.use(express.static(path.join(__dirname, '/assets')));

app.get('/.well-known/apple-developer-merchantid-domain-association.txt', function (req, res) {
  //res.render('word-export/sample.html')
  res.sendFile(path.join(__dirname + '/.well-known/apple-developer-merchantid-domain-association.txt'));
});

app.use("/category", express.static(path.join(__dirname, '/assets/category')));
app.use("/brand", express.static(path.join(__dirname, "/assets/brand")));
app.use("/models", express.static(path.join(__dirname, "/assets/models")));
app.use("/products", express.static(path.join(__dirname, "/assets/products")));

// admin entry
/*let email = "admin@soum.com";
let password = common_helper.encrypt("admin@4321");
//console.log(common_helper.decrypt(password));
User_model.findOne({ email: email, role: "Superadmin", is_active: true }, (err, adminResult) => {
  if (err) { res.send({ responseMessage: 'Internal server error', responseCode: 500 }) }
  else if (!adminResult) {
    var adminObject = {
      name: "Admin",
      email: email,
      password: password,
      profile_pic: '',
      role: 'Superadmin',
      email_verified : true
    } 
    //Administrator
    let admin = new User_model(adminObject);
    admin.save((error, result) => {
      if (error) { res.send({ responseMessage: 'Internal server error', responseCode: 500 }) }
      else {
        console.log("added");
      }
    })
  }
})*/

process.on('uncaughtException', (err) => {
  console.log(`Uncaught exception is ${err}`)
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

app.use('/api/v1/category', require('./routes/v1/CategoryRoutes'));
app.use('/api/v1/brand', require('./routes/v1/BrandRoutes'));
app.use('/api/v1/model', require('./routes/v1/ModelRoutes'));
app.use('/api/v1/product', require('./routes/v1/ProductRoutes'));
app.use('/api/v1/auth', require('./routes/v1/AuthRoutes'));
app.use('/api/v1/setting', require('./routes/v1/SettingRoutes'));
app.use('/api/v1/user', require('./routes/v1/UserRoutes'));
app.use('/api/v1/order', require('./routes/v1/OrderRoutes'));
app.use('/api/v1/banks', require('./routes/v1/BankRoutes'));
app.use('/api/v1/cron', require('./routes/v1/CronRoutes'));
app.use('/api/v1/payout', require('./routes/v1/PayoutRoutes'));
app.use('/api/v1/notification', require('./routes/v1/NotificationRoutes'));
app.use('/api/v1/varients', require('./routes/v1/VarientRoute'));
app.use('/api/v1/payments', require('./routes/v1/PaymentRoutes'));

app.use('/api/v1/condition', require('./routes/v1/ConditionRoutes'));
app.use('/admin', require('./routes/Admin/AdminRoutes'));

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
var Bank = require('./controllers/Api/v1/BankController');
Bank.AddBank();

var Cron = require('./controllers/Api/v1/CronController');
//midnight : '00 00 00 * * *'
var CronJob = require('cron').CronJob;

var job1 = new CronJob('00 00 00 * * *', function () {
  //console.log('You will see this message every minute');
  //console.log(new Date());
  Cron.SendAmountToSeller();
}, null, true, 'Asia/Riyadh');
job1.stop();

var job2 = new CronJob('00 10 * * * *', function () {
  //console.log('You will see this message every minute');
  //console.log(new Date());
  Cron.CheckDeliveryStatus();
}, null, true, 'Asia/Riyadh');
job2.stop();

var job3 = new CronJob('0 * * * * *', function () {
  //console.log('You will see this message every minute');
  //console.log(new Date());
  Cron.ProductBackToAvailable();
  //const d = new Date();
  //console.log('Every Minute:', d);
}, null, true, 'Asia/Riyadh');
job3.start();

var deactivateProductJob = new CronJob('0 * * * * *', function () {
  // console.log('You will see this message every minute');
  //console.log(new Date());
  Cron.UpdateProductAvailability();
  //const d = new Date();
  //console.log('Every Minute:', d);
}, null, true, 'Asia/Riyadh');
deactivateProductJob.start();

var closePendingPayments = new CronJob('0 10 * * * *', function () {
  //console.log('You will see this message every minute');
  //console.log(new Date());
  Cron.UpdateOrderStatus();
}, null, true, 'Asia/Riyadh');
closePendingPayments.stop();

var GenerateNotification = new CronJob('0 */2 * * * *', async function () {
  //console.log(new Date());
  await Cron.GenerateNotification();
}, null, true, 'Asia/Riyadh');
GenerateNotification.stop();


var ExportDataForAdmin = new CronJob('00 00 08 * * *', async function() {
  //console.log('You will see this message every one hour');
	await Cron.GenerateReports();
}, null, true, 'Asia/Riyadh');
ExportDataForAdmin.stop();

//var Helper = require('./config/helper');
//Helper.send_sms("+966541850019", "Hi this is Prateek");

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

var result = {};
/*result['buyer_address'] = {
  "address": "Makkah Al Mukarramah",
  "city": "Jeddah",
  "postal_code": "21454"
};*/
result['buyer_address'] = {
  "address": "Salmiya, Al Blajat Street",
  "city": "Kuwait City",
  "postal_code": "22036"
};

result['buyer_address'] = {
  "address": "Salmiya, Al Blajat Street",
  "city": "Jeddah",
  "postal_code": "21454"
};

//Object.assign(result);
result['pick_up_address'] = {
  "address": "Makkah Al Mukarramah",
  "city": "Jeddah",
  "postal_code": "21454"
};
/*result['pick_up_address'] = {
  "address": "Okhla",
  "city": "Delhi",
  "postal_code": "110025"
};*/

result['buyer'] = {
  "name": "Shahid",
  "countryCode": "+91",
  "mobileNumber": "9650706465"
}

result['seller'] = {
  "name": "Abhishek",
  "countryCode": "+91",
  "mobileNumber": "9650706465"
}

const Helper = require('./config/helper.js');

// Helper.send_sms("966544255233", `
// New Relic stores different types of data for different periods of time. The retention period for a type of data will vary depending on the product, the subscription level, and the feature.
// New Relic stores different types of data for different periods of time. The retention period for a type of data will vary depending on the product, the subscription level, and the feature.
// New Relic stores different types of data for different periods of time. The retention period for a type of data will vary depending on the product, the subscription level, and the feature.
// New Relic stores different types of data for different periods of time. The retention period for a type of data will vary depending on the product, the subscription level, and the feature.
// https://soum.sa/dashboard/products
// https://soum.sa/product-detail?product=60f48a14760f663e6680d8c3
// https://soum.sa/product-detail?product=60f48a14760f663e6680d8c3
// https://soum.sa/product-detail?product=60f48a14760f663e6680d8c3
// https://soum.sa/product-detail?product=60f48a14760f663e6680d8c3
// `)

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
let PickupTimestamp = tomorrow;
//console.log(result); return false;
//Helper.shipment_request("", PickupTimestamp, result.seller, result.pick_up_address, result.buyer, result.buyer_address);
//Helper.hyper_split_login();
//(async ()=>{
//var result = await Helper.hyper_split_test();
//console.log(result);
//})();
//Helper.pickup_request("", PickupTimestamp, result.seller, result.pick_up_address, result.buyer, result.buyer_address);
//var transactionData = Helper.get_payment_status("D3711A2716AB934E022C4986507F8429.uat01-vm-tx03", "VISA_MASTER");
//console.log(transactionData);
// (async () => { await Helper.sendMailWithSendGrid(ENV.EMAIL_SENDER, ENV.Order_Status_Inquirer.split(','), "Order Status Test Email", "Test email body")})();

// Helper.apply_transaction_operations("8ac7a49f7b9699c6017b96c0373d79fd", "VISA_MASTER", 1296.60, "refund").then(console.log).catch(console.error);;
var srvr = app.listen(port);
console.log("server is listening on port-->>", port);
srvr.timeout = 180000;
