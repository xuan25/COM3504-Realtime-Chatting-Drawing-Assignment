let mongoose = require('mongoose');

//The URL which will be queried. Run "mongod.exe" for this to connect

mongoose.Promise = global.Promise;
let mongoDB = 'mongodb://localhost:27017/com3504';

mongoose.Promise = global.Promise;
try {
    connection = mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        checkServerIdentity: false,
    });
    console.log('connection to mongodb worked!');

// db.dropDatabase();

} catch (e) {
    console.log('error in db connection: ' + e.message);
}
