const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/refreshToken", userController.refreshToken);
router.delete("/logout", userController.logout);
router.post("/uploadImage", userController.uploadImage);
router.get("/downloadUserImage", userController.downloadUserImage);
router.post("/BodyMassIndex", userController.BMI);
router.get("/All", userController.All);

//do zrobiebia

router.post("/resetPassword", userController.resetPassword);

module.exports = router;
