import multer from 'multer';
import cloudinary from '../../utils/cloudinary';
import path from 'path';

// Set up Multer storage configuration
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep the original file name
  },
});

const upload = multer({ storage });

// This handler will be used for uploading the image
const uploadMiddleware = upload.single('image');

// API route handler
export const config = {
  api: {
    bodyParser: false, // Disable body parser for Multer to work
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Use the Multer middleware
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Multer error',
        });
      }

      // Upload to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.status(200).json({
          success: true,
          message: 'Image uploaded',
          data: result,
        });
      } catch (cloudinaryErr) {
        console.error(cloudinaryErr);
        res.status(500).json({
          success: false,
          message: 'Cloudinary error',
        });
      }
    });
  } else {
    res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }
}
