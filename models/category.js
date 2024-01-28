const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
    title: { type: String, required: true, index: true },
    user: { type: String, required: true, index: true },
}, { timestamps: true, collection: "categories" });

categorySchema.index({ title: 1, user: 1 }, { unique: true });

const Category = new mongoose.model("Category", categorySchema);
module.exports = Category;