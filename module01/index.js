const express = require("express");

const server = express();
server.use(express.json());

const users = ["Guilherme", "Leonardo", "Artur", "Carlos"];

server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  return next();
});

function checkUserNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required"});
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  
  req.user = user;

  if(!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserNameExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserNameExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
