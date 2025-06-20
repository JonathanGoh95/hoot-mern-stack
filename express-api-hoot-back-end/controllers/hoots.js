const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const router = express.Router();

// Create Hoot
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id; // Ensures that the logged-in user is recorded as the author of the hoot
    const hoot = await Hoot.create(req.body); // Create the new hoot document in the database
    hoot._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Read Hoots
router.get("/", verifyToken, async (req, res) => {
  try {
    const hoots = await Hoot.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(hoots);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Find Hoot via Hoot ID
router.get("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId).populate("author");
    res.status(200).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update Hoot via Hoot ID
router.put("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    // Check for permissions (Note the syntax)
    if (!hoot.author.equals(req.user._id)) {
      res.status(403).send("Unauthorized User");
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    );
    // Append req.user to the author property
    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete Hoot via Hoot ID
router.delete("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    // Check for permissions (Note the syntax)
    if (!hoot.author.equals(req.user._id)) {
      res.status(403).send("Unauthorized User");
    }

    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);

    res.status(200).json(deletedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create Comment from Hoot ID
router.post("/:hootId/comments", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id; // Ensures that the logged-in user is recorded as the author of the hoot
    const hoot = await Hoot.findById(req.params.hootId);
    hoot.comments.push(req.body);
    // Find the new comment
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
