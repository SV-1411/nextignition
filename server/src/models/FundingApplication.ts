import mongoose, { Schema, Document } from 'mongoose';

export type FundingApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

type UploadedFileMeta = {
    url: string;
    originalName?: string;
    size?: number;
    uploadedAt?: Date;
};

export interface IFundingApplication extends Document {
    founder: mongoose.Schema.Types.ObjectId;
    startup?: mongoose.Schema.Types.ObjectId;
    title?: string;
    pitchSummary?: string;
    fundingAsk?: number;
    currency?: string;
    equityOffered?: number;
    pitchDeckUrl?: string;
    demoVideoUrl?: string;
    pitchDeck?: UploadedFileMeta;
    pitchVideo?: UploadedFileMeta;
    businessDocuments?: (UploadedFileMeta & { docType?: string })[];
    steps?: {
        profileComplete?: boolean;
        pitchDeckUploaded?: boolean;
        pitchVideoUploaded?: boolean;
        businessDocumentsUploaded?: boolean;
        finalSubmitted?: boolean;
    };
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
        title: { type: String },
        pitchSummary: { type: String },
        fundingAsk: { type: Number },
        currency: { type: String, default: 'USD' },
        equityOffered: { type: Number },
        pitchDeckUrl: { type: String },
        demoVideoUrl: { type: String },
        pitchDeck: {
            url: { type: String },
            originalName: { type: String },
            size: { type: Number },
            uploadedAt: { type: Date },
        },
        pitchVideo: {
            url: { type: String },
            originalName: { type: String },
            size: { type: Number },
            uploadedAt: { type: Date },
        },
        businessDocuments: [
            {
                url: { type: String, required: true },
                originalName: { type: String },
                size: { type: Number },
                uploadedAt: { type: Date },
                docType: { type: String },
            },
        ],
        steps: {
            profileComplete: { type: Boolean, default: false },
            pitchDeckUploaded: { type: Boolean, default: false },
            pitchVideoUploaded: { type: Boolean, default: false },
            businessDocumentsUploaded: { type: Boolean, default: false },
            finalSubmitted: { type: Boolean, default: false },
        },
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
