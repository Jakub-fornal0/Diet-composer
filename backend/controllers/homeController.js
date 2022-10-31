const db = require("../config/SeqdataBase");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Op = Sequelize.Op;
const user = db.users;
let ActiveUserTokens = [];

exports.homePage = (req, res, next) => {
  res.status(200).send({ message: "welcome!" });
};

exports.signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await user.findAll({
      where: {
        [Op.or]: [{ email: email }, { userName: userName }],
      },
    });
    if (existingUser.length) {
      return res
        .status(409)
        .send({ message: "Użytkownik o podanym adresie email już istnieje!" });
    }
    user
      .create({
        userName: userName,
        email: email,
        password: password,
        gender: "-",
        dietPurpose: "-",
        physicalActivity: "-",
      })
      .then(() => {
        res.status(201).send({ message: "Stworzono nowego użytkownika!" });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Powstał nieokreślony błąd podczas tworzenia nowego użytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loggedUser = await user.findOne({
      where: {
        email: email,
      },
    });
    if (loggedUser == null) {
      return res.status(409).send({ message: "Niepoprawny email lub hasło!" });
    }
    const validPassword = await bcrypt.compare(password, loggedUser.password);
    if (!validPassword)
      return res.status(401).send({ message: "Niepoprawny email lub hasło!" });
    const token = jwt.sign({ id: loggedUser.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: loggedUser.id },
      process.env.REFRESH_TOKEN
    );
    ActiveUserTokens.push(refreshToken);
    res.status(200).send({
      token: token,
      tokenToRefresh: refreshToken,
      message: "Zalogowano!",
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};
