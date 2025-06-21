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
    const hoot = await Hoot.findById(req.params.hootId).populate([
      "author",
      "comments.author",
    ]);
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
    if (!hoot.author._id.equals(req.user._id)) {
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
    if (!hoot.author._id.equals(req.user._id)) {
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
    // Save comments to database
    await hoot.save();
    // Find the new comment
    const newComment = hoot.comments[hoot.comments.length - 1];
    newComment._doc.author = req.user;
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update Comment from Hoot ID
router.put("/:hootId/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    const comment = hoot.comments.id(req.params.commentId);

    // Ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this comment" });
    }

    comment.text = req.body.text;
    await hoot.save();
    res.status(200).json({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete Comment from Hoot ID
router.delete("/:hootId/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);
    if (!hoot) {
      return res.status(404).json({ message: "Hoot not found" });
    }
    const comment = hoot.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    // Ensures the current user is the author of the comment
    if (comment.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    // Remove the comment from the database
    hoot.comments.remove({ _id: req.params.commentId });
    // Save changes to the database
    await hoot.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
