import mongoose, { Schema, Document } from 'mongoose';

export interface IFundingBookmark extends Document {
    investor: mongoose.Schema.Types.ObjectId;
    startup: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const FundingBookmarkSchema: Schema = new Schema(
    {
        investor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startup: { type: Schema.Types.ObjectId, ref: 'Startup', required: true },
    },
    { timestamps: true }
);

FundingBookmarkSchema.index({ investor: 1, startup: 1 }, { unique: true });

export default mongoose.model<IFundingBookmark>('FundingBookmark', FundingBookmarkSchema);
