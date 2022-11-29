const db = require("../config/SeqdataBase");
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Op = Sequelize.Op;
const user = db.users;
const recipe = db.recipes;
const recipeProducts = db.recipeProducts;
const userProducts = db.userProducts;
const sequelize = db.sequelize;
const recipeSteps = db.recipeSteps;
const products = db.products;
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

exports.getSelectRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    let data = await recipe.findOne({
      attributes: [
        "id",
        "image",
        "name",
        "cookingTime",
        "portions",
        "level",
        "dietType",
        "category",
        "author",
        "calories",
        "fats",
        "proteins",
        "carbohydrates",
      ],
      where: {
        id: recipeId,
      },
      include: [
        {
          model: products,
          as: "products",
        },
        {
          model: recipeSteps,

          attributes: ["step", "name"],
        },
      ],
    });
    data.image = "http://localhost:3000/imagesRecipe/" + data.image + ".png";

    res.status(200).send({ RecipeDetail: data });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    let page = req.query.page;
    let category = req.query.category;
    let level = req.query.level;
    let dietType = req.query.dietType;
    let portions = req.query.portions;
    let cookingTime = req.query.cookingTime;
    let caloriesmin = req.query.caloriesmin;
    let caloriesmax = req.query.caloriesmax;
    let carbohydratesmin = req.query.carbohydratesmin;
    let carbohydratesmax = req.query.carbohydratesmax;
    let fatsmin = req.query.fatsmin;
    let fatsmax = req.query.fatsmax;
    let proteinsmin = req.query.proteinsmin;
    let proteinsmax = req.query.proteinsmax;
    let query = "";
    if (category) query += "category = '" + category + "' AND ";
    if (level) query += "level = '" + level + "' AND ";
    if (dietType) query += "dietType = '" + dietType + "' AND ";
    if (portions) query += "portions = " + portions + " AND ";
    if (cookingTime) query += "cookingTime <= " + cookingTime + " AND ";
    if (caloriesmin)
    query +=
      "calories >= " +
      caloriesmin +
      " AND ";
    if (caloriesmax)
      query +=
        "calories <= " +
        caloriesmax +
        " AND ";
    if (caloriesmin & caloriesmax)
      query +=
        "calories >= " +
        caloriesmin +
        " AND calories <=" +
        caloriesmax +
        " AND ";
    if (carbohydratesmin)
      query +=
        "carbohydrates >= " +
        carbohydratesmin +
        " AND ";
    if (carbohydratesmax)
      query +=
        "carbohydrates <= " +
        carbohydratesmax +
        " AND ";
    if (carbohydratesmin & carbohydratesmax)
      query +=
        "carbohydrates >=" +
        carbohydratesmin +
        " AND carbohydrates <= " +
        carbohydratesmax +
        " AND ";
    if (fatsmin)
      query += "fats >=" + fatsmin + " AND ";
    if (fatsmax)
      query += "fats <= " + fatsmax + " AND ";
    if (fatsmin & fatsmax)
      query += "fats >=" + fatsmin + " AND fats <= " + fatsmax + " AND ";
    if (proteinsmin)
      query +=
        "proteins >=" +
        proteinsmin +
        " AND ";
    if (proteinsmax)
      query +=
        "proteins <= " +
        proteinsmax +
        " AND ";
    if (proteinsmin & proteinsmax)
      query +=
        "proteins >=" +
        proteinsmin +
        " AND proteins <= " +
        proteinsmax +
        " AND ";
    query = query.slice(0, query.length - 4);
    let OFFSET = (page - 1) * 12;
    const token = req.headers["x-access-token"];
    if (!token & (query.length > 0)) {
      console.log("bez tokenu z filtrami");
      const data = await sequelize.query(
        "SELECT id, image, name, description, cookingTime, portions, level, category FROM `recipes` WHERE " +
          query +
          " LIMIT 12 OFFSET " +
          OFFSET,
        { model: recipe }
      );
      res.status(200).send({ Recipes: data });
    } else if (!token & !query) {
      console.log("bez tokenu i bez filtrów");
      const data = await sequelize.query(
        "SELECT id, image, name, description, cookingTime, portions, level, category FROM `recipes` LIMIT 12 OFFSET " +
          OFFSET,
        { model: recipe }
      );
      res.status(200).send({ Recipes: data });
    } else if (token) {
      const userId = jwt.decode(req.headers["x-access-token"]).id;
      console.log("użytkownik: " + userId);
      await user
        .findOne({
          where: {
            id: userId,
          },
        })
        .then(async () => {
          console.log("znaleizono uztykownika");
          let product = await userProducts.findAll({
            where: {
              userId: userId,
            },
          });
          console.log(product.length);
          if ((product.length > 0) & (query.length > 0)) {
            console.log("posiada token, produkty i filtry");
            const data = await sequelize.query(
              "SELECT DISTINCT `recipes`.`id`, `recipes`.`image`, `recipes`.`name`, `recipes`.`description`, `recipes`.`cookingTime`, `recipes`.`portions`, `recipes`.`level`, `recipes`.`category`, count(1) as `NumberOfProducts` FROM recipeproducts INNER JOIN recipes ON `recipeproducts`.`recipeId` = `recipes`.`id` WHERE productId IN (SELECT DISTINCT productID FROM userproducts WHERE userId = '" +
                userId +
                "') AND  " +
                query +
                " GROUP BY recipeId ORDER BY `NumberOfProducts` DESC LIMIT 12 OFFSET " +
                OFFSET,
              { model: recipeProducts, userProducts }
            );
            res.status(200).send({ Recipes: data });
          } else if ((product.length > 0) & (query.length == 0)) {
            console.log("posiada token i  produkty");
            const data = await sequelize.query(
              "SELECT DISTINCT `recipes`.`id`, `recipes`.`image`, `recipes`.`name`, `recipes`.`description`, `recipes`.`cookingTime`, `recipes`.`portions`, `recipes`.`level`, `recipes`.`category`, count(1) as `NumberOfProducts` FROM recipeproducts INNER JOIN recipes ON `recipeproducts`.`recipeId` = `recipes`.`id` WHERE productId IN (SELECT DISTINCT productID FROM userproducts WHERE userId = '" +
                userId +
                "') GROUP BY recipeId ORDER BY `NumberOfProducts` DESC LIMIT 12 OFFSET " +
                OFFSET,
              { model: recipeProducts, userProducts }
            );
            res.status(200).send({ Recipes: data });
          } else if ((product.length == 0) & (query.length > 0)) {
            console.log("posiada token i filtry");
            const data = await sequelize.query(
              "SELECT id, image, name, description, cookingTime, portions, level, category FROM `recipes` WHERE " +
                query +
                "LIMIT 12 OFFSET " +
                OFFSET,
              { model: recipe }
            );
            res.status(200).send({ Recipes: data });
          } else {
            console.log("posiada token");
            const data = await sequelize.query(
              "SELECT id, image, name, description, cookingTime, portions, level, category FROM `recipes` LIMIT 12 OFFSET " +
                OFFSET,
              { model: recipe }
            );
            res.status(200).send({ Recipes: data });
          }
        })
        .catch((err) => {
          res.status(402).send({
            message: err.message || "Nie udało się odnaleźć użytkownika",
          });
        });
    }
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

/*
SELECT DISTINCT   `recipes`.`id`, `recipes`.`image`, `recipes`.`name`, `recipes`.`description`, `recipes`.`cookingTime`, `recipes`.`portions`, `recipes`.`level`, `recipes`.`category`, count(1) as `NumberOfProducts` FROM recipeproducts
INNER JOIN recipes ON `recipeproducts`.`recipeId` = `recipes`.`id`
WHERE productId IN (SELECT DISTINCT productID FROM userproducts 
WHERE userId = '16972da2-bdff-4b52-b264-35f31ec79436') AND  category = 'II śniadanie'  
GROUP BY recipeId ORDER BY `NumberOfProducts` DESC LIMIT 3 OFFSET 0;
*/

/*
Select distinct  *, count(1) as `liczba-trafien` from recipeproducts
Inner join recipes on `recipeproducts`.`recipeId` = `recipes`.`id`
where productId in  (select distinct productID from userproducts where userId = '16972da2-bdff-4b52-b264-35f31ec79436') Group by recipeId order by `liczba-trafien` DESC;
*/

/*
SELECT DISTINCT `recipes`.`id`, `recipes`.`image`, `recipes`.`name`, `recipes`.`description`, `recipes`.`cookingTime`, `recipes`.`portions`, `recipes`.`level`, `recipes`.`category`, count(1) as `NumberOfProducts` FROM recipeproducts
INNER JOIN recipes ON `recipeproducts`.`recipeId` = `recipes`.`id`
WHERE productId IN (SELECT DISTINCT productID FROM userproducts 
WHERE userId = '16972da2-bdff-4b52-b264-35f31ec79436') 
GROUP BY recipeId ORDER BY `NumberOfProducts` DESC LIMIT 3 OFFSET 0;
*/

/*
SELECT DISTINCT   `recipes`.`id`, `recipes`.`image`, `recipes`.`name`, `recipes`.`description`, `recipes`.`cookingTime`, `recipes`.`portions`, `recipes`.`level`, `recipes`.`category`, count(1) as `NumberOfProducts` FROM recipeproducts
INNER JOIN recipes ON `recipeproducts`.`recipeId` = `recipes`.`id`
WHERE productId IN (SELECT DISTINCT productID FROM userproducts 
WHERE userId = '16972da2-bdff-4b52-b264-35f31ec79436') AND  category = 'II śniadanie'  
GROUP BY recipeId ORDER BY `NumberOfProducts` DESC LIMIT 3 OFFSET 0;
*/
