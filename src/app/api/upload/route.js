import cloudinary from '@/app/utils/cloudinary';
import { config as dotenvConfig } from 'dotenv';
import multer from 'multer';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import connect from '../../lib/mongodb';
import User from '../../models/User';

dotenvConfig();

const unlinkAsync = promisify(fs.unlink);
const upload = multer({ dest: '/tmp' });

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');
  const emails = formData.get('email');

  if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  const tempPath = path.join('/tmp', file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(tempPath, buffer);

  try {
      const result = await cloudinary.uploader.upload(tempPath);
      await unlinkAsync(tempPath); // Cleanup temp file

      // Check if the session is valid and the user exists
      if (!emails) {
          return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
      }

      // Connect to MongoDB and update the user
      await connect();
      const user = await User.updateOne(
        { email: emails }, 
        { $push: { file: { url: result.secure_url, id: result.public_id } } },
        { runValidators: true }
      );
      
      console.log("MongoDB update response:", user);
      
      if (user.matchedCount === 0) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }
      if (user.modifiedCount === 0) {
        return NextResponse.json({ success: false, message: 'User update failed' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Image uploaded', data: result });
  } catch (error) {
      return NextResponse.json({ success: false, message: 'Cloudinary or database error', error }, { status: 500 });
  }
}

