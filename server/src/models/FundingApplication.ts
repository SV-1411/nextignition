import mongoose, { Schema, Document } from 'mongoose';

export type FundingApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface IFundingApplication extends Document {
    founder: mongoose.Schema.Types.ObjectId;
    startup?: mongoose.Schema.Types.ObjectId;
    title: string;
    pitchSummary?: string;
    fundingAsk?: number;
    currency?: string;
    equityOffered?: number;
    pitchDeckUrl?: string;
    demoVideoUrl?: string;
    tags: string[];
    status: FundingApplicationStatus;
    submittedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const FundingApplicationSchema: Schema = new Schema(
    {
        founder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startup: { type: Schema.Types.ObjectId, ref: 'Startup' },
        title: { type: String, required: true },
        pitchSummary: { type: String },
        fundingAsk: { type: Number },
        currency: { type: String, default: 'USD' },
        equityOffered: { type: Number },
        pitchDeckUrl: { type: String },
        demoVideoUrl: { type: String },
        tags: [{ type: String }],
        status: {
            type: String,
            enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected'],
            default: 'draft',
        },
        submittedAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IFundingApplication>('FundingApplication', FundingApplicationSchema);
