const db = require("../config/SeqdataBase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const { array } = require("joi");

const recipeSteps = db.recipeSteps;
const recipeProducts = db.recipeProducts;
const recipe = db.recipes;
const user = db.users;

exports.addRecipes = async (req, res) => {
  try {
    var fileName = crypto.randomBytes(20).toString("hex");
    const Engine = (Name) => {
      return multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./imagesRecipe");
        },
        filename: (req, file, cb) => {
          cb(null, Name + ".png");
        },
      });
    };
    const upload = multer({ storage: Engine(fileName) }).single("image");
    upload(req, res, async (err) => {
      const userId = jwt.decode(req.headers["x-access-token"]).id;
      if (!userId){
      return res
        .status(401)
        .send({ message: "Nie udało się zautoryzować użytkownika" });
      }
      let {
        name,
        author,
        description,
        cookingTime,
        portions,
        level,
        dietType,
        category,
        calories,
        fats,
        proteins,
        carbohydrates,
        steps,
        products,
      } = req.body.JSON;

      steps = JSON.parse(steps);
      products = JSON.parse(products);

      if (err) {
        return res
          .status(409)
          .send({
            message: "Wystąpił błąd podczas wysyłania plików na serwer",
          });
      }

      await recipe.create({
        image: fileName,
        name: name,
        author: author,
        description: description,
        cookingTime: cookingTime,
        portions: portions,
        level: level,
        dietType: dietType,
        category: category,
        calories: calories,
        fats: fats,
        proteins: proteins,
        carbohydrates: carbohydrates,
        userId: userId,
      })
        .then((result) => {
          steps.forEach((array) => {
            array.recipeId = result.id;
            array.step = array.id;
            delete array.id;
          });
          recipeSteps.bulkCreate(steps)
            .then(() =>
              console.log(
                "Tabela kroków realizacji przepisu została zaktualizowana"
              )
            )
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Powstał nieokreślony błąd podczas zapisu danych",
              });
            });
          products.forEach((array) => {
            array.recipeId = result.id;
            array.productId = array.id;
            delete array.id;
          });
          recipeProducts.bulkCreate(products)
            .then(() => {
              console.log(
                "Tabela produktów wymaganych do przepisu została zaktualizowana"
              );
              res.status(201).send({ message: "Stworzono nowy przepis!" });
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Powstał nieokreślony błąd podczas zapisu danych",
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Powstał nieokreślony błąd podczas zapisu przepisu",
          });
        });
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.updateRecipes = async (req, res) => { //---------------------------------------------------------------DO REALIZACJI!----------
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const {
      image,
      name,
      author,
      description,
      cookingTime,
      portions,
      level,
      dietType,
      category,
      calories,
      fats,
      proteins,
      carbohydrates,
      steps,
      products,
    } = req.body;

    const recipe2 = await recipe.findOne({
      where: { id: req.body.id },
    }).then(async (rec) => {
      products.forEach((array) => {
        array.recipeId = rec.id;
        array.productId = array.id;
        delete array.id;
      });

      await recipeProducts.bulkCreate(products, {
        fields: ["quantity", "recipeId", "productId"],
        updateOnDuplicate: ["quantity"],
      });
    });

    /*
    const recipe = await Recipe.findOne({
      where:{id:req.body.id}
    });
    await recipeProducts.update(
      {
          id: {
            [Sequelize.Op.in]: products.map((item) => item.id),
          }, 
          name: {
            [Sequelize.Op.in]: products.map((item) => item.name),
          }
      },
      {
          where: {
             recipeId: recipe.id
          },
      },
  );*/
    /*
    await Recipe.findOne({
      where:{id:req.body.id}
    }).then(async (recipe)=>{
      console.log(recipe.id);
      await recipeProducts.update({products},{
        where: {
          recipeId : recipe.id,
        },
      });
      res.json('zaktualizowano');
    });
    */
    /*
    await Recipe.update({
      where: {
        id: userId,
      }
    });*/
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.deleteRecipes = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const recipeId = req.params.recipeId;
    await user.findOne({
      where: {
        id: userId,
      },
    })
      .then(() => {
        recipe.findOne({
          where: {
            id: recipeId,
          },
        }).then(async (userRecipeToDelete) => {
          const path = "./imagesRecipe/" + userRecipeToDelete.image + ".png";
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            recipe.destroy({
              where: {
                id: userRecipeToDelete.id,
              },
            });
            res
              .status(200)
              .send({ message: "Przepis użytkownika został usunięty" });
          });
        });
      })
      .catch((err) => {
        res.status(404).send({
          message: err.message || "Nie znaleziono przpisów użytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};
