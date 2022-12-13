import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://abubakar:243izgHpBTtk5JNz@nodework.wxtozyt.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected");
  }
);

var validateUserName = function (name) {
  var ur = /^[^\W_](?!.*?[.]{2})[\w.]{6,18}[^\W]$/;
  return ur.test(name);
};

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return re.test(email);
};

// var validatePassword = function (password) {
//   var pa = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/;
//   return pa.test(password);
// };

var validatePhone = function (phone) {
  var ph =
    /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;
  return ph.test(phone);
};

var validateAddress = function (address) {
  var ad = /[^ A - Za - z0 -9_#\.]|#{ 2, }|\.{ 5,}/;
  return ad.test(address);
};

var filename = multer({
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, filename, cb) {
    if (!filename.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: [true, "Name must be in lowercase form"],
    required: [true, "Please Enter Your Name"],
    unique: true,
    dropDups: true,
    validate: [
      validateUserName,
      "Please Enter Uniques username with special characters",
    ],
    match: [
      /^[^\W_](?!.*?[.]{2})[\w.]{6,18}[^\W]$/,
      "Please Enter Uniques username with special characters",
    ],
  },

  email: {
    type: String,
    trim: true,
    required: [true, "Email is Required"],
    index: {
      unique: true,
    },
    lowercase: true,
    dropDups: true,
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  // password: {
  //   type: String,
  //   select: false,
  //   validate: [validatePassword, "Please enter a password"],
  //   match: [
  //     /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,16}$/,
  //     "Please enter a password",
  //   ],
  // },

  zipcode: {
    type: Number,
    required: [true, "Enter Your Zipcode here"],
    minLength: [5, "Minimum 5 digits are allowed"],
    maxLength: [6, "Maximum 6 digits are allowed"],
  },

  phone: {
    type: String,
    required: [true, "Enter Your Phone Number here"],
    validate: [validatePhone, "Please enter correct phone number"],
    match: [
      /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm,
      "Please enter correct phone number",
    ],
  },

  address: {
    type: String,
    required: [true, "Please enter correct address"],
    validate: [validateAddress, "Please enter correct address"],
    match: [
      /[^ A - Za - z0 -9_#\.]|#{ 2, }|\.{ 5,}/,
      "Please enter strong address",
    ],
  },

  filename: {
    type: String,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.path("email").validate(() => {
  return true;
}, "Email Already Exists");

const User = new mongoose.model("User", UserSchema);

// Routes
app.post("/register12", (req, res, next) => {
  return "GOITTT";
});

app.post("/register", (req, res) => {
  // upload.any(),
  return req.body;
  const { name, email, password, zipcode, phone, address, filename } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User Already Registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
        zipcode,
        phone,
        address,
        filename,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successfully Register" });
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("My API");
});

app.listen(8080, () => {
  console.log("PORT started at 8080");
});
