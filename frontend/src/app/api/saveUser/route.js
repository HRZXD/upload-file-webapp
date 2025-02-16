import connect from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req) {
  const { email, name } = await req.json();  // Parse the incoming JSON body

  try {
    // Connect to MongoDB
    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user exists, return a 200 status with a message
      return new Response(
        JSON.stringify({ message: 'User already exists', user: existingUser }),
        { status: 200 }
      );
    }

    // Create and save the new user
    const newUser = new User({ email, name, file: [] });
    await newUser.save();

    return new Response(
      JSON.stringify({ message: 'User saved successfully', user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving user:', error);

    // Check if the error is a duplicate key error
    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 200 } // Return 200 if you still want to handle it as a non-error case
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to save user', details: error.message }),
      { status: 500 }
    );
  }
}
