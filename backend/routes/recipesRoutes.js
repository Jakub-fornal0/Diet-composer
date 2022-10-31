const router = require("express").Router();
const recipesController = require("../controllers/recipesController");

router.post("/", recipesController.getRecipes);


module.exports = router;
