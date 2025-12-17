const express = require("express");
const fs = require("fs");
const { json } = require("stream/consumers");

const app = new express();

const getLogin = (req, res) => {
  if (req.query.role === "tenant") {
    const data = fs.readFileSync("./data/tenants.json", "utf-8");
    const tenants = json.parse(data);
    const tenantExists = tenants.find(
      (tenant) => tenant.tenantCode === req.query.tenantCode
    );
    if (!tenantExists) {
      res.code(404).json({ message: "User not found" });
    }
  } else {
    const data = fs.readFileSync("./data/owners.json", "utf-8");
    const owners = json.parse(data);
    const ownerExists = owners.find(
      (owner) => owner.phone === req.query.phone
    );
    if (!ownerExists) {
      return res.status(404).json({ message: "user not found" });
    }
    else{
         return res.status(200).json({message: "user exist"});
    }
  }
};

app.get("api/login", getLogin);

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});
