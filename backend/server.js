const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
//const { json } = require("stream/consumers");

const app = new express();
app.use(cors());

const getLogin = (req, res) => {
  if (req.query.role === "TENANT") {
    //To debug
    console.log("LOGIN HIT:", req.query);

    const tenantsPath = path.join(__dirname, "..", "frontend/data", "tenants.json");
    const data = fs.readFileSync(tenantsPath, "utf-8");

    const tenants = JSON.parse(data);
    const tenantExists = tenants.find(
      (tenant) => tenant.tenantId === req.query.tenantCode
    );
    if (!tenantExists) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "User exists" });
    }
  } else if (req.query.role === "OWNER") {
    const ownersPath = path.join(__dirname, "..", "frontend/data", "owners.json");
    const data = fs.readFileSync(ownersPath, "utf-8");
    const owners = JSON.parse(data);
    const ownerExists = owners.find((owner) => owner.phone === req.query.phone);
    if (!ownerExists) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.status(200).json({ message: "user exist" });
    }
  } else {
    return res.status(404).json({ message: "Invalid role" });
  }
};

app.get("/api/login", getLogin);

app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});
