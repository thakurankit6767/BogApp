const express = require("express");
const Address = require("../model/address.model");
const Data = require("../model/data.model");

const router = express.Router();

router.post("/post", async (req, res) => {
  try {
    const data = await Data.findOne({ addressId: req.body.addressId })
      .lean()
      .exec();
    if (data) {
      return res.status(300).json({ message: "user already added the data" });
    }
    const playlist = await Data.create(req.body);
    return res.status(200).json(playlist);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/all", async (req, res) => {
  try {
    const DataData = await Data.find()
      .populate({ path: "addressId" })
      .populate("reqPets")
      .populate("Pets")
      .lean()
      .exec();
    return res.status(200).json(DataData);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const flatID = req.params.id;
    const address = await Address.findOne({ userId: flatID })
      .select({ city: 1, capacity: 1, rating: 1, houseUrl: 1 })
      .lean()
      .exec();
    const Data2 = await Data.findOne({ addressId: flatID })
      .populate([
        { path: "addressId", select: ["firstName", "lastName", "type"] },
      ])
      .select({ flatId: 0 })
      .populate("reqPets")
      .populate("Pets")
      .lean()
      .exec();
    const final = { ...address, ...Data2 };

    return res.status(200).json(final);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/reqtolist/:id", async (req, res) => {
  try {
    let query = req.query.key || 0;
    let Data2 = await Data.findById(req.params.id).lean().exec();
    let redDd =
      (await Data2.reqPets[query]) !== undefined || null
        ? Data2.reqPets[query]
        : "z";
    let pet = (await Data2.Pets) || [];
    if (redDd === "z") {
      return res.status(200).json({ message: "this pet already admitted" });
    }
    Data2 = {
      ...Data2,
      reqPets: Data2.reqPets.filter((p) => {
        return p !== redDd;
      }),
      Pets: pet.length > 0 ? [...pet, redDd] : [redDd],
    };
    const finalData = await Data.findByIdAndUpdate(
      { _id: req.params.id },
      Data2,
      { new: true }
    )
      .populate("addressId")
      .populate("reqPets")
      .populate("Pets");
    return res.status(200).json({ finalData });
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
module.exports = router;
