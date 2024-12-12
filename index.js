const express = require("express");
const zod = require("zod");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_PASSWORD;

app.use(express.json());

const schema = zod.object({
  username: zod.string(),
  password: zod.string().min(8),
});

// Dummy Users
const users = [
  { username: "john_doe", password: "password123", name: "John Doe" },
  { username: "jane_smith", password: "securePass!@#", name: "Jane Smith" },
  { username: "alice_jones", password: "alice2021", name: "Alice Jones" },
  { username: "bob_brown", password: "bobSecure456", name: "Bob Brown" },
  { username: "charlie_black", password: "charlie789", name: "Charlie Black" },
];

// Helper Function
const userExists = (username, password) => {
  return users.find((user) => user.username === username && user.password === password);
};

// Routes
app.post("/signin", (req, res) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ msg: "Invalid input data" });
  }

  const { username, password } = req.body;
  const user = userExists(username, password);

  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET);
    return res.status(200).json({ msg: "Token generated", userToken: token });
  }

  res.status(401).json({ msg: "User does not exist. Please register first." });
});

app.get("/users", (req, res) => {
  const authorizationHeader = req.headers.authorization;
cls

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authorization header missing or malformed" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded)
    const filteredUsers = users.filter((user) => user.username !== decoded.username);

    res.status(200).json({ allUsers: filteredUsers });
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
});


// Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
  next()
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
