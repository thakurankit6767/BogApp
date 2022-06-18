const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    summary: {
      type: String,
      required: true,
      default: "Boarding facility you leave em we love them",
    },
    number: { type: Number, required: true, default: 10 },
    type: [{ type: String, required: true }],
    petSize: [{ type: String, required: true, default: "1-10kg" }],
    supervisors: { type: Number, required: true },
    unSupervisor: { type: String, required: true },
    sleepArea: { type: String, required: true },
    pottyBreak: { type: String, required: true },
    walk: { type: Number, required: true },
    typeOfHome: { type: String, required: true },
    outDoorArea: { type: String, required: true },
    emergency: { type: String, required: true },
    addressId: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    reqPets: [{ type: mongoose.Types.ObjectId, ref: "pet" }],
    Pets: [{ type: mongoose.Types.ObjectId, ref: "pet" }],
  },
  {
    versionKey: false,
  }
);
const Data = mongoose.model("data", dataSchema);

module.exports = Data;
