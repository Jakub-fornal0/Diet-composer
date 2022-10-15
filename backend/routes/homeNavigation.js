const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.post("/",homeController.homePage)

module.exports = router;