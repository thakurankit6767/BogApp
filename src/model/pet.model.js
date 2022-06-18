const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    petImg: { type: String, required: true },
    petWeight: { type: String, required: true },
    type: { type: String, required: true },
    petName: { type: String, required: true },
    userId: [{ type: mongoose.Types.ObjectId, ref: "user", required: true }],
  },
  {
    versionKey: false,
  }
);
const Pet = mongoose.model("pet", petSchema);
module.exports = Pet;
