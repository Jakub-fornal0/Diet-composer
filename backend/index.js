require("dotenv").config();

const express = require("express");
const tokenVerification = require("./middleware/tokenVerification");

const app = express();

app.use(express.json());


const usersRoutes = require("./routes/usersRoutes");
//const authorizationRoutes = require("./routes/authorizationRoutes");
const homeNavigation = require("./routes/homeNavigation");

//app.use("/authorization", authorizationRoutes);
app.use("/user", usersRoutes);
//app.use(tokenVerification);
app.use("/home", homeNavigation);






const port = process.env.PORT || 5000
app.listen(port, () => console.log('Serwer uruchomiony'));