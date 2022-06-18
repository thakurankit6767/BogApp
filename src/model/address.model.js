const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    costPerDay: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    rating: { type: Number, required: true },
    houseUrl: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  },
  {
    versionKey: false,
  }
);
const Address = mongoose.model("address", addressSchema);
module.exports = Address;
