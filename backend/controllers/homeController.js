exports.homePage = (req, res, next) => {
    console.log("witaj");
    res.status(200).send({ message: "welcome!" });
};
