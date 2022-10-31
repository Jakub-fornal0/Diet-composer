const router = require("express").Router();
const recipesController = require("../controllers/recipesController");

router.post("/", recipesController.addRecipes);
router.post("/update", recipesController.updateRecipes);
router.delete("/", recipesController.deleteRecipes);


module.exports = router;
