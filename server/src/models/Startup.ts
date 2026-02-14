import mongoose, { Schema, Document } from 'mongoose';

export interface IStartup extends Document {
    founder: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    industry: string;
    stage: 'idea' | 'mvp' | 'beta' | 'growth' | 'scale';
    location: string;
    equity: number;
    pitchDeckUrl?: string;
    summary?: string;
    milestones: {
        title: string;
        completed: boolean;
        date?: Date;
    }[];
    funding: {
        target: number;
        raised: number;
        currency: string;
    };
    team: {
        user: mongoose.Schema.Types.ObjectId;
        role: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const StartupSchema: Schema = new Schema(
    {
        founder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        industry: { type: String, required: true },
        stage: {
            type: String,
            enum: ['idea', 'mvp', 'beta', 'growth', 'scale'],
            default: 'idea'
        },
        location: { type: String },
        equity: { type: Number, default: 0 },
        pitchDeckUrl: { type: String },
        summary: { type: String },
        milestones: [
            {
                title: { type: String, required: true },
                completed: { type: Boolean, default: false },
                date: { type: Date },
            },
        ],
        funding: {
            target: { type: Number, default: 0 },
            raised: { type: Number, default: 0 },
            currency: { type: String, default: 'USD' },
        },
        team: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                role: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IStartup>('Startup', StartupSchema);
