const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouters = require("./routers/user");
const taskRouters = require("./routers/task");

// setting up express and its port
const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
//   // return res.status(503).send("Site is currently down. Check back soon!");

//   // if (req.method === "GET") {
//   //   res.send("Get request is not allowed!");
//   // } else {
//   //   next();
//   // }
// });
// this line is used to parse request body into json.
app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

app.listen(port, () => {
  console.log("Server is up on port", port);
});

// const jwt = require("jsonwebtoken");

// const myFunction = async () => {
//   const token = jwt.sign({ _id: "abc123" }, "aquickbrownfox");
//   console.log(token);
// };

// myFunction();
