const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const connect = require("./config/db");
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const { authenticate } = require("./middlewares/authenticate");

const PORT = process.env.PORT || 8080;

const { newToken, router } = require("./controllers/user.controller");
const addressController = require("./controllers/address.controller");
const dataController = require("./controllers/data.controller");
const petController = require("./controllers/pet.controller");
app.use(express.static("public"));
app.use("/user", router);
app.use("/data", dataController);
app.use("/pet", petController);
app.use("/address", addressController);
app.get("/signOut", authenticate, async (req, res) => {
  try {
    res.clearCookie("Bearer");
    res.status(200).json({ message: "sign out success" });
  } catch (error) {
    return res.status(500).send({ message: "sign out error" });
  }
});

app.listen(PORT, async () => {
  await connect();
  console.log(`listening on port ${PORT}`);
});
