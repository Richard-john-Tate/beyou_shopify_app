const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({
  batchId: { type: String },
  category: { type: String },
  imgUrl: { type: String },
  certificates: { type: String },
  links: { type: String },
  cannabinoid: { type: String },
  cbdPercentage: { type: String },
  cbdMG_ML: { type: String },
});

module.exports = mongoose.model("Report", reportSchema);
