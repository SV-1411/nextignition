import mongoose, { Schema, Document } from 'mongoose';

export interface ICofounderProfile extends Document {
    user: mongoose.Schema.Types.ObjectId;
    currentRole?: string;
    lookingFor?: string;
    commitment?: 'Full-time' | 'Part-time' | 'Flexible';
    equityExpectation?: string;
    yearsExperience?: number;
    previousStartups?: number;
    availability?: string;
    vision?: string;
    strengths: string[];
    interests: string[];
    skills: string[];
    location?: string;
    startupStatus?: 'has-startup' | 'wants-to-join' | 'ideal';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CofounderProfileSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        currentRole: { type: String },
        lookingFor: { type: String },
        commitment: { type: String, enum: ['Full-time', 'Part-time', 'Flexible'] },
        equityExpectation: { type: String },
        yearsExperience: { type: Number },
        previousStartups: { type: Number },
        availability: { type: String },
        vision: { type: String },
        strengths: [{ type: String }],
        interests: [{ type: String }],
        skills: [{ type: String }],
        location: { type: String },
        startupStatus: { type: String, enum: ['has-startup', 'wants-to-join', 'ideal'] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ICofounderProfile>('CofounderProfile', CofounderProfileSchema);
