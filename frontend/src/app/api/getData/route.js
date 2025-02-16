import connect from '../../lib/mongodb';
import User from '../../models/User';

export async function GET(req) {
  try {
    await connect(); // Connect to MongoDB
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
