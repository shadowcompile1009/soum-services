const NODE_ENV = process.env.NODE_ENV || "production"
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const mongoose =  require('mongoose');
const log = console.log;
global.Promise = mongoose.Promise;
var againConnect = ()=>{
    setInterval(()=>{
        Db_connect();
    },1000)
}
let dbLogConnection;
function Db_connect(){
   dbLogConnection = mongoose.createConnection(process.env.LOG_DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });
}
mongoose.connection.on('connected', () =>{ 
    clearInterval(againConnect);
    log(`Log DB connected`);
});
mongoose.connection.on('error', (error) => {
    log(`Error in Log DB connetcion is ${error}`);
});
mongoose.connection.on('disconnected', () => {
    againConnect();
})

function  GetDbConnection() {
    return dbLogConnection;
}
module.exports = {
    Db_connect,
    GetDbConnection
}