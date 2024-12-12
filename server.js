const express = require("express");
const app = express();
app.use(express.json());

const userModel = require("./models/users");
const connectDB = require("./models/dbConnection");
connectDB();

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const saltRound = 10;
  const hashedPass = await bcrypt.hash(password, saltRound);
  return hashedPass;
};

const varifyPassowrd = async (password, hashedPass) => {
  const isMatched = await bcrypt.varify(password, hashedPass);
  return isMatched;
};

const zod = require("zod");
const zodschema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

const jwt = require("jsonwebtoken");
const JWT_PASSWORD = process.env.JWT_PASSWORD;
const PORT = process.env.PORT;

// signup route for the users to create account
app.post("/signup", async (req, res) => {
  //schema validation is done using zod
  const userRes = zodschema.safeParse(req.body);
  if (!userRes.success) {
    res.status(411).json({
      msg: "invalid username or password formate",
    });
  }
  const { username, email, password } = req.body;

  //checked user is already exist in the database or not
  const isUserAlreadyExirst = await userModel.findOne({ username });
  if (isUserAlreadyExirst) {
    res.status(411).json({
      msg: "user already exist in the database",
    });
  }

  //hashing the password for secure storage

  const hashedpass =  await hashPassword(password);
  //creating new user and saved to database
  try {
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashedpass,
    });

    await newUser.save();
    console.log("user created and save to database" + newUser);
  } catch (error) {
    if (error) {
      res.status(411).json({
        msg: "There is something wrong",
      });
    }
  }

  //generate the jwt token for user authentication
  try {
    const token = jwt.sign({ username, password, email }, JWT_PASSWORD);
    res.json({
      msg: "token generated",
      token: token,
    });
  } catch (error) {
    if (error) {
      res.status(411).json({
        msg: "Bhai token create karate time lafada ho gaya",
      });
    }
  }
});

//globel catche for globel error handling
app.use((err, req, res, next) => {
  if (err) {
    res.json({
      msg: "something is wrong with your backend",
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log("Server is stated on port " + PORT);
});
