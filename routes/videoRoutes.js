import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import Video from "../models/Video.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "voxmorph/videos",
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { userId, url, publicId } = req.body;

    const video = await Video.create({
      userId,
      url,
      publicId,
    });

    res.json(video);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Vidéo introuvable" });
    }

    await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: "Vidéo supprimée avec succès" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
