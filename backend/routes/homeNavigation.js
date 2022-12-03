const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.post("/home", homeController.homePage);
router.post("/signup", homeController.signup);
router.post("/signin", homeController.signin);
router.get("/recipe/:id", homeController.getSelectRecipe);
router.get("/filteredRecipes/:category?/:level?/:dietType?/:portions?/:cookingTime?/:caloriesmin?/:caloriesmax?/:carbohydratesmin?/:carbohydratesmax?/:fatsmin?/:fatsmax?/:proteinsmin?/:proteinsmax?", homeController.getRecipes);
router.get("/all", homeController.getNumberOfRecipes);

module.exports = router
