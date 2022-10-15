require("dotenv").config();

const express = require("express");
const tokenVerification = require("./middleware/tokenVerification");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
app.use(express.static('public')); 
app.use('/images', express.static('images'));
app.use(cors());// poprawić
app.use(express.json());


const usersRoutes = require("./routes/usersRoutes");
const homeNavigation = require("./routes/homeNavigation");

app.use("/user", usersRoutes);
//app.use(tokenVerification);
app.use("/home", homeNavigation);






const port = process.env.PORT || 5000
app.listen(port, () => console.log('Serwer uruchomiony'));