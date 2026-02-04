const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* CREATE PRODUCT (ADMIN) */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => { 
    try {
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: req.file ? req.file.path.replace(/\\/g, "/") : null  
      });
      res.status(201).json(product);
    } catch (err) {
      console.log("CRASH ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* GET ALL PRODUCTS (PUBLIC) */
router.get("/", async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
});

/* DELETE PRODUCT (ADMIN) */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
