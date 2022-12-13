import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb+srv://nodework:6UuLL65fjRlJ84k3@node.zgnef.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected");
  }
);

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
var validateUserName = function (name) {
  var ur = /^[^\W_](?!.*?[.]{2})[\w.]{6,18}[^\W]$/;
  return ur.test(name);
};

var validatePassword = function (password) {
  var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return re.test(password);
};
var validatePhone = function (phone) {
  var ph =
    /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;
  return ph.test(phone);
};

var validateAddress = function (address) {
  var ad = /[^ A - Za - z0 -9_#\.]|#{ 2, }|\.{ 5,}/;
  return ad.test(address);
};

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
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  password: {
    type: String,
    select: false,
    validate: [validatePassword, "Please enter strong password"],
    match: [
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      "Please enter strong password",
    ],
  },

  zipcode: {
    type: Number,
    required: [true, "Enter Your Zipcode here"],
    minLength: [6, "Minimum 4 digits are allowed"],
    maxLength: [10, "Maximum 10 digits are allowed"],
  },

  phone: {
    type: String,
    required: [true, "Enter Your Phone Number here"],
    validate: [validatePhone, "Please enter a valid Phone Number here"],
    match: [
      /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm,
      "Please enter a valid Phone Number here",
    ],
  },

  address: {
    type: String,
    // required: [true, "Enter Your Zipcode here"],
    validate: [validateAddress, "Please enter a valid Address"],
    match: [
      /[^ A - Za - z0 -9_#\.]|#{ 2, }|\.{ 5,}/,
      "Please enter a valid Address",
    ],
  },
});

UserSchema.path("email").validate(() => {
  return true;
}, "Email Already Exists");

const User = new mongoose.model("User", UserSchema);

// Routes

app.post("/register", (req, res) => {
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
