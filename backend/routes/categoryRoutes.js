const express = require("express");
const Category = require("../models/Category");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

/* CREATE CATEGORY (ADMIN) */
router.post("/", protect, adminOnly, async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
});

/* GET ALL CATEGORIES */
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = router;
