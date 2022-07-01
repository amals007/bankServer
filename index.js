//server creation
const express = require("express");

// import jsonwebtoken
const jwt = require("jsonwebtoken");
// import cors
const cors = require("cors");

//import express
const dataService = require("./services/data.service");

// server application create using express
const app = express();

// cors use in server app
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// user request resolving
// parse JSON data
app.use(express.json());

// application specific middleware
const appMiddleware = (req, res, next) => {
  console.log("Application specific middleware");
  next();
};
// use middleware in app
app.use(appMiddleware);

const jwtMiddleware = (req, res, next) => {
  // fetch token
  try {
    token = req.headers["x-access-token"];
    // verify token
    const data = jwt.verify(token, "supersecretkey12345");
    console.log(data);
    next();
  } catch {
    res.status(401).json({
      status: false,
      statusCode: 401,
      message: "Please Login",
    });
  }
};

// bank server
//register API
app.post("/register", (req, res) => {
  //register resolving - asynchronous
  dataService
    .register(req.body.username, req.body.acno, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
//login API
app.post("/login", (req, res) => {
  //login resolving
  dataService.login(req.body.acno, req.body.pswd).then((result) => {
    res.status(result.statusCode).json(result);
  });
});
//deposit API
app.post("/deposit", jwtMiddleware, (req, res) => {
  dataService
    .deposit(req.body.acno, req.body.password, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
// withdraw API
app.post("/withdraw", jwtMiddleware, (req, res) => {
  dataService
    .withdraw(req.body.acno, req.body.password, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});
// transaction API
app.post("/transaction", jwtMiddleware, (req, res) => {
  dataService.getTransaction(req.body.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//GET REQUEST - to fetch data
app.get("/", (req, res) => {
  res.send("GET Request");
});
// POST REQUEST - to create data
app.post("/", (req, res) => {
  res.send("POST Request");
});
// PUT REQUEST - to modify entire data
app.put("/", (req, res) => {
  res.send("PUT Request");
});
// PATCH REQUEST - to modify partially
app.patch("/", (req, res) => {
  res.send("PATCH Request");
});
// DELETE REQUEST - to delete data
app.delete("/", (req, res) => {
  res.send("DELETE Request");
});

// set up the port number to the server app
app.listen(3000, () => {
  console.log("Server started at 3000");
});
