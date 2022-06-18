const express = require("express");
const router = express.Router();
const Data = require("../model/data.model");
const Pet = require("../model/pet.model");
router.get("/all", async (req, res) => {
  try {
    const data = await Pet.find().lean().exec();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.post("/post", async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    const dd = await Data.findOne({ addressId: pet.userId[1] }).lean().exec();
    let arrayOfReq = dd.reqPets.length > 0 ? [dd.reqPets, pet._id] : [pet._id];
    const data = await Data.findOneAndUpdate(
      { addressId: pet.userId[1] },
      { reqPets: arrayOfReq },
      { new: true }
    )
      .lean()
      .exec();
    return res.status(200).send({ pet, data });
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
