const express = require("express");
const router = express.Router();

const { EmployerLogin } = require("../models/models");

router.get("/test", async (req, res, next) => {
  try {
    console.log(req.headers["x-real-ip"]);
    let results = "this is text message";
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/employerLogin", async (req, res, next) => {
  const allEmployers = await EmployerLogin.find();
  return res.status(200).json(allEmployers);
});

router.post("/add", async (req, res, next) => {
  const addEmployer = await EmployerLogin.create(req.body);
  return res.status(201).json(addEmployer);
});

module.exports = router;
