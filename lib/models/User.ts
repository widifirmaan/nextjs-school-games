import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['GURU', 'SISWA'] },
    fullName: String,
    email: { type: String, unique: true, sparse: true },
    kelas: String,
    schoolName: String,
    photoUrl: String,
    levels: { type: Map, of: String, default: {} }, // Storing JSON string as per Java model
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
