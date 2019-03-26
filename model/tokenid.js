const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenIDSchema = new Schema({
  tokenId: {
    type: String,
    required: true
  }
});

module.exports = TokenId = mongoose.model("tokenid", tokenIDSchema);
