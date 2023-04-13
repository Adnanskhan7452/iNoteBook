
const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/testInotebook";

async function connectToDb(){
    try{
        await mongoose.connect(mongoURI);
        console.log("connected to mongo");
    }
    catch(error){
        console.log(error);
    }
}
module.exports = connectToDb;

