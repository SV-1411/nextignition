import mongoose, { Schema, Document } from 'mongoose';

export interface IFundingInterest extends Document {
    investor: mongoose.Schema.Types.ObjectId;
    startup: mongoose.Schema.Types.ObjectId;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}

const FundingInterestSchema: Schema = new Schema(
    {
        investor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startup: { type: Schema.Types.ObjectId, ref: 'Startup', required: true },
        note: { type: String },
    },
    { timestamps: true }
);

FundingInterestSchema.index({ investor: 1, startup: 1 }, { unique: true });

export default mongoose.model<IFundingInterest>('FundingInterest', FundingInterestSchema);
