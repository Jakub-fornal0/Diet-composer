const db = require("./config/SeqdataBase");
const makeApp = require("./app.js");
const express = require("express");

const port = process.env.PORT || 5000;
//const app = makeApp(db);


makeApp.listen(port, () => {console.log("Serwer uruchomiony")});