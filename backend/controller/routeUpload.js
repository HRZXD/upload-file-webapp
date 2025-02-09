const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');

router.post('/upload', upload.single('image'), async (req, res) => {
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Cloudinary error',
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Image uploaded',
            data: result
         });
    });
});

module.exports = router;
