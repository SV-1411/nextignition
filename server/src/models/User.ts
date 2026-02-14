import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'founder' | 'expert' | 'investor' | 'co-founder' | 'admin';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    roles: UserRole[]; // Support for multiple roles
    avatar?: string;
    isVerified: boolean;
    profile: {
        bio?: string;
        skills: string[];
        interests: string[];
        location?: string;
        socials?: {
            linkedin?: string;
            twitter?: string;
            website?: string;
        };
        expertise?: string[]; // For experts
        experience?: string;
        hourlyRate?: number; // For experts
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['founder', 'expert', 'investor', 'co-founder', 'admin'],
            default: 'founder'
        },
        roles: [{
            type: String,
            enum: ['founder', 'expert', 'investor', 'co-founder', 'admin']
        }],
        avatar: { type: String },
        isVerified: { type: Boolean, default: false },
        profile: {
            bio: { type: String },
            skills: [{ type: String }],
            interests: [{ type: String }],
            location: { type: String },
            socials: {
                linkedin: { type: String },
                twitter: { type: String },
                website: { type: String },
            },
            expertise: [{ type: String }],
            experience: { type: String },
            hourlyRate: { type: Number },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
