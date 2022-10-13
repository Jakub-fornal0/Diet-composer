const connDB = require("../config/database");
const Joi = require("joi");
const multer = require("multer");
var crypto = require("crypto");

class User{

    userImage = "none";
    userName = "default";
    email = "default@email.com";
    password = "default";
    age = 0;
    gender = "kobieta";
    weight = 0;
    height = 0;
    dietType = "odchudzanie";
    BMI = 0;
    caloricDemand = 0;
    proteinsDemand = 0;
    fatsDemand = 0;
    carbohydratesDemand = 0;

    constructor(options) {
        this.id = options && options.id;
        this.userImage = options && options.userImage || "none";
        this.userName = options && options.userName || "default";
        this.email = options && options.email || "default@email.com";
        this.password = options && options.password || "default";
        this.age = options && options.age || 0;
        this.gender = options && options.gender || "kobieta";
        this.weight = options && options.weight || 0;
        this.height = options && options.height || 0;
        this.dietType = options && options.dietType || "odchudzanie";
        this.BMI = options && options.BMI || 0;
        this.caloricDemand = options && options.caloricDemand || 0;
        this.proteinsDemand = options && options.proteinsDemand || 0;
        this.fatsDemand = options && options.fatsDemand || 0;
        this.carbohydratesDemand = options && options.carbohydratesDemand || 0;
    }

    static saveToDB(){
        let sql=`SELECT * FROM users;`;
        
        return  connDB.execute(sql);
    }

    static CheckExistingUserByEmail(email){
        let sql=`SELECT * FROM users WHERE email = "${email}";`;
        return connDB.execute(sql);
    }
    
    get userImage() {
        return this.userImage;
    }

    set userImage(value) {
        this.userImage = value;
    }
    
    get userName() {
        return this.userName;
    }
    
    set userName(value) {
        this.userName = value;
    }
    
    get email() {
        return this.email;
    }

    set email(value) {
        this.email = value;
    }
    
    get password() {
        return this.password;
    }

    set password(value) {
        this.password = value;
    }
    
    get age() {
        return this.age;
    }

    set age(value) {
        this.age = value;
    }
    
    get gender() {
        return this.gender;
    }

    set gender(value) {
        this.gender = value;
    }
    
    get weight() {
        return this.weight;
    }

    set weight(value) {
        this.weight = value;
    }
    
    get height() {
        return this.height;
    }

    set height(value) {
        this.height = value;
    }
    
    get dietType() {
        return this.dietType;
    }

    set dietType(value) {
        this.dietType = value;
    }
    
    get BMI() {
        return this.BMI;
    }

    set BMI(value) {
        this.BMI = value;
    }
    
    get caloricDemand() {
        return this.caloricDemand;
    }

    set caloricDemand(value) {
        this.caloricDemand = value;
    }
    
    get proteinsDemand() {
        return this.proteinsDemand;
    }

    set proteinsDemand(value) {
        this.proteinsDemand = value;
    }
    
    get fatsDemand() {
        return this.fatsDemand;
    }

    set fatsDemand(value) {
        this.fatsDemand = value;
    }
    
    get carbohydratesDemand() {
        return this.carbohydratesDemand;
    }

    set carbohydratesDemand(value) {
        this.carbohydratesDemand = value;
    }
}
const fileStorage = () => {
    let fileName = crypto.randomBytes(20).toString('hex');
    const Engine = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./images");
        },
        filename: (req, file, cb) => {
            cb(null, + fileName)
        }
    });
    return Engine;
};


const userValidate = (data) => {
    const schema = Joi.object({

      userImage: Joi.string(),

      userName: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
                   .required()
                   .label("userName"),

      email: Joi.string()
                .email()
                .required()
                .label("email"),

      password: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*?]{8,30}$'))
                   .required()
                   .label("password"),

      age: Joi.number()
               .integer()
               .min(1)
               .max(120)
               .label("age"),

      gender: Joi.string(), 

      weight: Joi.number()
                 .precision(1)
                 .min(1)
                 .max(200)
                 .label("weight"),

     height: Joi.number()
                .integer()
                .min(1)
                .max(300)
                .label("height"),

      dietType: Joi.string(),

      BMI: Joi.number(),

      caloricDemand: Joi.number(),

      proteinsDemand: Joi.number(),

      fatsDemand: Joi.number(),

      carbohydratesDemand: Joi.number()

    });
    return schema.validate(data);
  };

  const loginValidation = (data) => {
    const schema = Joi.object({

        email: Joi.string()
                  .email()
                  .required()
                  .label("email"),

        password: Joi.string()
                     .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*?]{8,30}$'))
                     .required()
                     .label("password")
    });
    return schema.validate(data);
  };

  const registrationValidation = (data) => {
    const schema = Joi.object({
      userName: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
                   .required()
                   .label("userName"),

      email: Joi.string()
                .email()
                .required()
                .label("email"),

      password: Joi.string()
                   .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*?]{8,30}$'))
                   .required()
                   .label("password")
       });
    return schema.validate(data);
  };
  

module.exports = {User, userValidate, registrationValidation, loginValidation, fileStorage};