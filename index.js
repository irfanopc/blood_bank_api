const express = require("express");
//const recieverRoute = require('./routes/reciever');
const dotenv = require('dotenv').config()
const mongoDB = require('mongoose')
const hospital = require('./routes/hospital')
const receiver = require('./routes/reciever')
const port =  5000
const app = express();

// const signIn = require("./routes/SignIn");
// const signOut = require("./routes/Logout");
const cookieParser = require("cookie-parser");
app.use(express.json());   // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1',hospital)
app.use('/api/v1',receiver)
mongoDB.set("strictQuery", false);
mongoDB.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {

    console.log(`DB CONNECTED`);
  }
);


app.listen(port, () => {
  console.log(`port is running on ${port}`);
});