const router = require("express").Router();
const userControler = require("../controllers/userControler");

router.post("/registration",userControler.registration);
router.post("/login",userControler.login);
router.post("/refreshToken",userControler.refreshToken);
router.delete("/logout",userControler.logout);
//do zrobiebia
router.post("/uploadImage",userControler.uploadImage);
router.post("/resetPassword",userControler.resetPassword);

module.exports = router;