const router = require("express").Router();
const homeControler = require("../controllers/homeControler");

router.post("/",homeControler.homePage)

module.exports = router;