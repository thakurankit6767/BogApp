const express = require("express");
const Address = require("../model/address.model");
const router = express.Router();
const Data = require("../model/data.model");
async function residentHere(Address, resident = []) {
  for (let i = 0; i < Address.length; i++) {
    let data = await Data.find({ AddressId: Address[i]._id }).countDocuments();
    data = data.length === 0 ? 1 : data;
    resident.push(data);
  }
  return resident;
}
router.post("/post", async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.body.userId })
      .lean()
      .exec();
    if (address) {
      return res
        .status(301)
        .json({ message: "user already has a home address" });
    }
    const address2 = await Address.create(req.body);
    return res.status(200).json(address2);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const size = req.query.size || 15;
    const address = await Address.find({})
      .populate({ path: "userId", select: ["firstName", "lastName"] })
      .skip((page - 1) * size)
      .limit(size)
      .lean()
      .exec();
    const totalPages = Math.ceil(
      (await Address.find().countDocuments()) / size
    );
    return res.status(200).json({ Address: address, totalPages: totalPages });
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/block/:id", async (req, res) => {
  try {
    const block = await Address.find({ block: req.params.id }).lean().exec();
    let resident = await residentHere(block);
    return res.status(200).json({ Address: block, resident: resident });
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/sort", async (req, res) => {
  try {
    let query = req.query.sortby;
    let data;
    if (query === "asc") {
      data = await Address.find({})
        .sort({ costPerDay: 1 })
        .populate({ path: "userId" })
        .lean()
        .exec();
      return res.status(200).json({ Address: data });
    } else if (query === "desc") {
      data = await Address.find({})
        .sort({ costPerDay: -1 })
        .populate({ path: "userId" })
        .lean()
        .exec();
      return res.status(200).json({ Address: data });
    } else if (query === "yes" || query === "no") {
      query === "yes" ? (query = true) : (query = false);
      data = await Address.find({ verified: query })
        .populate({ path: "userId" })
        .lean()
        .exec();
      return res.status(200).json({ Address: data });
    } else {
      return res
        .status(400)
        .json({ message: "sortby should be 'asc' / 'desc' or 'yes' / 'no'" });
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const data = await Address.findById(req.params.id).lean().exec();
    let residentData = await Resident.find({
      AddressId: req.params.id,
    }).countDocuments();
    let resident = [];
    resident.push(residentData);
    return res.status(200).json({ Address: data, resident: resident });
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const Address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(200).json(Address);
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
module.exports = router;
