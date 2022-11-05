const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.post("/home", homeController.homePage);
router.post("/signup", homeController.signup);
router.post("/signin", homeController.signin);
router.get("/recipe/:id", homeController.getSelectRecipe);

module.exports = router;
