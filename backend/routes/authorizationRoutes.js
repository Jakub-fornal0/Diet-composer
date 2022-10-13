const router = require("express").Router();
const { User } = require("../models/User");
const connDB = require("../config/database");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");



router.post("/", (req, response) => {
  connDB.query(`SELECT * FROM users WHERE email = ?`, req.body.email, (err, res) =>{
    if(err) throw err;
    console.log("wyszukany user");
    console.log(res.length);
    //connDB.refused();
  });

  connDB.query('SELECT * FROM users', async (err, res) =>{
    if(err) throw err;
    console.log("jego email");
    const hash = await bcrypt.hash(req.body.password, 10);
    console.log(hash);
    console.log(res[0].email);
    //connDB.refused();
  });
  response.status(200).send("ok");
});

router.post("/login", async (req, response) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return response.status(400).send({ message: error.details[0].message });
    const { email, password } = req.body;
    const [neww, _] = await User.CheckExistingUserByEmail(email);
    if (!neww.length) return response.status(401).send({ message: "Błędny email lub hasło!" });
    console.log(neww[0].password)
    const validPassword = await bcrypt.compare(
      password,
      neww[0].password
     );
     console.log(neww[0].id);
    if (!validPassword)
      return response.status(401).send({ message: " Błędny email lub hasło!" });
      const token = jwt.sign({ id: neww.id}, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
      response.status(200).send({ token: token, id:(neww.id), message: "Zalogowano!" });
  } catch (error) {
    response.status(500).send({ message: "Wewnętrzny błąd serwera!" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

module.exports = router;