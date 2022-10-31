const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.post("/home", homeController.homePage);
router.post("/signup", homeController.signup);
router.post("/sigin", homeController.sigin);

module.exports = router;
