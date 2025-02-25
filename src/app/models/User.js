import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  file: [{
    url: { type: String, default: null },
    id: { type: String, default: null }
  }]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
