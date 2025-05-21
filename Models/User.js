import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  displayname: { type: String, unique: true, sparse: true },
  tagline: { type: String, required: false },
  email:    { type: String, required: true, unique: true },
  password: { type: String }, 
  provider: { type: String, default: 'credentials' },
  picture:  { type: String, required: false },
  coverpic: { type: String, required: false},
  razorpayId: { type: String, required: false},
  razorpaySecret: { type: String, required: false },
  isProfile: {type: Boolean, default:false}
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User