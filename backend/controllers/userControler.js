const { User, registrationValidation, loginValidation, fileStorage } = require("../models/User");
const { v4: uuidv4 } = require('uuid');
const connDB = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



let ActiveUserTokens = [];

exports.registration = async (req, res, next) => {
    try {
        const [neww, _] = await User.CheckExistingUserByEmail(req.body.email);
        if(neww.length)
            return res.status(401).send({ message: "A user with this email already exists" });
        const { error } = registrationValidation(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        const id = uuidv4();
        const { userName, email, password } = req.body;
        const user = new User({id: id,userName: userName, email: email, password: password});
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(user.password, salt);
        const sql = `INSERT INTO users(id, userImage, userName, email, password, age, gender, weight, height, dietType, BMI, caloricDemand, proteinsDemand, fatsDemand, carbohydratesDemand) VALUES('${user.id}','${user.userImage}','${user.userName}','${user.email}','${hashPassword}','${user.age}','${user.gender}','${user.weight}','${user.height}','${user.dietType}','${user.BMI}','${user.caloricDemand}','${user.proteinsDemand}','${user.fatsDemand}','${user.carbohydratesDemand}')`;
        connDB.execute(sql);
    } catch (error) {
        res.status(500).send({ message: "Internal server error!" });
      }
};

exports.login = async (req, response, next) => {
    try {
        const { error } = loginValidation(req.body);
        if (error)
          return response.status(400).send({ message: error.details[0].message });
        const { email, password } = req.body;
        const [neww, _] = await User.CheckExistingUserByEmail(email);
        if (!neww.length) return response.status(401).send({ message: "Incorrect email or password!" });
        const validPassword = await bcrypt.compare(
          password,
          neww[0].password
         );
        if (!validPassword)
          return response.status(401).send({ message: "Incorrect email or password!" });
        const token = jwt.sign({ id: neww[0].id}, process.env.ACCESS_TOKEN, {
            expiresIn: "15s",
        });
        const refreshToken = jwt.sign({ id: neww[0].id}, process.env.REFRESH_TOKEN);
        ActiveUserTokens.push(refreshToken);
        response.status(200).send({ token: token, tokenToRefresh: refreshToken, id:(neww[0].id), message: "Logged!" });
      } catch (error) {
        response.status(500).send({ message: "Internal server error!" });
      }
};

exports.refreshToken = (req, res) => {
    try{
        const { token } = req.body;
        if (!ActiveUserTokens.includes(token)){
            return res.status(403).send({ message: "No token provided!"});
        }
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload) => {
            if(err){
                return res.status(403).send({message: "No token provided!"});
            }
            const newToken = jwt.sign({id: payload.id}, process.env.ACCESS_TOKEN, {expiresIn: "20s"});
            res.json({token: newToken});
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error!" });
    }
};

exports.logout = (req, res, next) => {
    const { token } = req.body;
    ActiveUserTokens = ActiveUserTokens.filter(x => x !== token);
    res.status(204).send({message: "Logged out!"});
    //https://www.youtube.com/watch?v=D0OzCWenIyE
};


exports.uploadImage = (req, res, next) => {
    console.log("jestem");
    try{
        const temp = User.fileStorage;
        console.log("ale jazda");
        console.log(temp);
        const upload = multer({ storage: temp});
        console.log("tutaj");
        const image = upload.single("image");
        console.log(image);
        res.send("Image upload successs");
    }catch (error) {
        res.status(500).send({ message: "Internal server error!" });
    }
};

exports.resetPassword = (req, res, next) => {
};
