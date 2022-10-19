const {
  User,
  registrationValidation,
  loginValidation,
} = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const connDB = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
var crypto = require("crypto");

let ActiveUserTokens = [];

exports.registration = async (req, res) => {
  try {
    const [neww, _] = await User.CheckExistingUserByEmail(req.body.email); 
    if (neww.length)
      return res
        .status(409)
        .send({ message: "Użytkownik o podanym adresie email już istnieje!" });
    const { error } = registrationValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const id = uuidv4();
    const { userName, email, password } = req.body;
    console.log("tu");
    const user = new User({
      id: id,
      userName: userName,
      email: email,
      password: password
    });
    console.log("tu");
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(user.password, salt);
    console.log("tu");
    const sql = `INSERT INTO users(id, userImage, userName, email, password, age, gender, weight, height, dietType, physicalActivity, BMI, caloricDemand, proteinsDemand, fatsDemand, carbohydratesDemand) VALUES('${user.id}','${user.userImage}','${user.userName}','${user.email}','${hashPassword}','${user.age}','${user.gender}','${user.weight}','${user.height}','${user.dietType}','${user.physicalActivity}','${user.BMI}','${user.caloricDemand}','${user.proteinsDemand}','${user.fatsDemand}','${user.carbohydratesDemand}')`;
    connDB.execute(sql);
    res.status(201).send({ message: "Stworzono nowego użytkownika!" });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.login = async (req, response) => {
  try {
    const { error } = loginValidation(req.body);
    if (error)
      return response.status(400).send({ message: error.details[0].message });
    const { email, password } = req.body;
    const [neww, _] = await User.CheckExistingUserByEmail(email);
    if (!neww.length)
      return response
        .status(401)
        .send({ message: "Niepoprawny email lub hasło!" });
    const validPassword = await bcrypt.compare(password, neww[0].password);
    if (!validPassword)
      return response
        .status(401)
        .send({ message: "Niepoprawny email lub hasło!" });
    const token = jwt.sign({ id: neww[0].id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign(
      { id: neww[0].id },
      process.env.REFRESH_TOKEN
    );
    ActiveUserTokens.push(refreshToken);
    response.status(200).send({
      token: token,
      tokenToRefresh: refreshToken,
      message: "Zalogowano!",
    });
  } catch (error) {
    response.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!ActiveUserTokens.includes(token)) {
      return res.status(403).send({ message: "Nie znaleziono tokenu!" });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return res.status(403).send({ message: "Nie znaleziono tokenu!" });
      }
      const newToken = jwt.sign({ id: payload.id }, process.env.ACCESS_TOKEN, {
        expiresIn: "20s",
      });
      res.json({ token: newToken });
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.logout = (req, res, next) => {
  const { token } = req.body;
  ActiveUserTokens = ActiveUserTokens.filter((x) => x !== token);
  res.status(204).send({ message: "Wylogowano!" });
  //https://www.youtube.com/watch?v=D0OzCWenIyE
};

exports.uploadImage = async (req, res) => {
  try {
    var fileName = crypto.randomBytes(20).toString("hex");

    const Engine = (Name) => {
      return multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./images");
        },
        filename: (req, file, cb) => {
          cb(null, Name + ".png");
        },
      });
    };

    const upload = multer({ storage: Engine(fileName) }).single("image");

    upload(req, res, (err) => {
      if (err) {
        return res.send(
          "Przesyłanie pliku na serwer zaończyło się niepowodzeniem!"
        );
      }
      User.UpdateImage(req.body.id, fileName);
      res.status(201).send({ message: "Wysłano plik na serwer" });
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.downloadUserImage = async (req, res) => {
  try {
    const [image, _] = await User.downloadUserImage(req.body.id);
    if (!image.length)
      return res
        .status(402)
        .send({ message: "Nie udało się odnaleźć użytkownika o podanym id" });
    res.status(200).send({
      id: req.body.id,
      image: "http://localhost:3000/images/" + image[0].userImage + ".png",
      message: "Pobrano zdjęcie użytkownika",
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.BMI = async (req, res) => {
  try {
    const { id, age, gender, weight, height, dietType, physicalActivity } =
      req.body;
    const diet = {
      "spadek wagi": -300,
      "utrzymanie wagi": 0,
      "przyrost wagi": 300,
    };
    const PAL = {
      "brak ćwiczeń": 1.4,
      "znikoma": 1.6,
      "mała": 1.8,
      "umiarkowana": 2,
      "duża": 2.2,
      "bardzo duża": 2.4,
    };
    const [user, _] = await User.CheckExistingUserById(id);
    if (!JSON.stringify(user) === "{}")
      return res
        .status(402)
        .send({ message: "Nie udało się odnaleźć użytkownika o podanym id" });

    let BMI = (weight / Math.pow(parseFloat(height) * 0.01, 2)).toFixed(2);
    let cpm = 0.0;
    if (gender === "kobieta") {
      cpm = (
        (10 * weight + 6.25 * height - 5 * age - 161) *
          parseFloat(PAL[physicalActivity]) -
        diet[dietType]
      ).toFixed(2);
    } else {
      cpm = (
        (10 * weight + 6.25 * height - 5 * age + 5) *
          parseFloat(PAL[physicalActivity]) -
        diet[dietType]
      ).toFixed(2);
    }
    let proteins = ((cpm * 0.2) / 4).toFixed(1);
    let carbohydrates = ((cpm * 0.6) / 4).toFixed(1);
    let fats = ((cpm * 0.2) / 9).toFixed(1);
    console.log("kalorie: " + cpm);
    console.log(proteins);
    console.log(carbohydrates);
    console.log(fats);

    let sql = `UPDATE users SET age="${age}", gender="${gender}", weight="${weight}", height = "${height}", dietType = "${dietType}", physicalActivity = "${physicalActivity}", BMI = "${BMI}", caloricDemand = "${cpm}", proteinsDemand = "${proteins}", fatsDemand ="${fats}", carbohydratesDemand="${carbohydrates}" WHERE id ="${id}";`;
    connDB.execute(sql);
    res.status(201).send({
      BMI: BMI,
      proteinsDemand: proteins,
      fatsDemand: fats,
      caloricDemand: cpm,
      carbohydratesDemand: carbohydrates,
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.All = async (req, res) => {
  try {
    const [user, _] = await User.CheckExistingUserById(req.body.id);
    if (!JSON.stringify(user) === "{}")
      return res
        .status(402)
        .send({ message: "Nie udało się odnaleźć użytkownika o podanym id" });

    user.userImage = "http://localhost:3000/images/" + user.userImage + ".png";
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.resetPassword = (req, res, next) => {};
