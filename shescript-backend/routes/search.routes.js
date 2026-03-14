import express from "express";
import Search from "../models/Search.model.js";

const router = express.Router();

// @route   POST /api/search
// @desc    Save a new search result to history
router.post("/", async (req, res) => {
  try {
    const { medicine, result, language } = req.body;

    // Create a new search document based on the Search model
    const newSearch = new Search({
      medicine,
      result,
      language,
    });

    const savedSearch = await newSearch.save();
    res.status(201).json(savedSearch);
  } catch (error) {
    console.error("Error saving search:", error);
    res.status(500).json({ message: "Server error while saving search data." });
  }
});

// @route   GET /api/search
// @desc    Get all search history
router.get("/", async (req, res) => {
  try {
    const searches = await Search.find().sort({ date: -1 });
    res.status(200).json(searches);
  } catch (error) {
    console.error("Error fetching searches:", error);
    res.status(500).json({ message: "Server error while fetching history." });
  }
});

export default router;