const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  ItemName: {
    type: String,
    required: true,
  },
  ItemPrice: {
    type: String,
    required: true,
  },
  ItemDescription: {
    type: String,
    required: true,
  },
  ItemImage: {
    type: Buffer,
    required: true,
  },
});

const Shop = mongoose.model("shop", ShopSchema);
module.exports = Shop;
