// const mongoose = require("mongoose");

const mongoose = require('../db.js');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    productname: { type: String, required: true },
    productcode: { type: String, required: true },
    category: { type: String, required: true },
    manufacturer: { type: String, required: true },
    manufacturingdate: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
