import cloudinary from '@/app/utils/cloudinary';
import { config as dotenvConfig } from 'dotenv';
import multer from 'multer';
import { NextResponse } from 'next/server';
import connect from '../../lib/mongodb';
import User from '../../models/User';

dotenvConfig();

const upload = multer({ dest: '/tmp' });

export async function POST(req) {
    const formData = await req.formData();
    const email = formData.get('email');
    const imgId = formData.get('id');
    
    try {
        await connect();
        
        // Delete the image from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(imgId);
        
        if (cloudinaryResponse.result !== 'ok') {
            return NextResponse.json({ success: false, message: 'Failed to delete image from Cloudinary' }, { status: 500 });
        }
        
        // Update the user document in MongoDB
        await User.updateOne(
            { email: email },
            { $pull: { file: { id: imgId } } }
        );

        return NextResponse.json({ success: true, message: 'Image deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error deleting image:', err);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
