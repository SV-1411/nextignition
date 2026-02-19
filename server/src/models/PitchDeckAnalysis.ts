import mongoose, { Schema, Document } from 'mongoose';

export interface IPitchDeckAnalysis extends Document {
    user: mongoose.Schema.Types.ObjectId;
    analysis: Record<string, any>;
    source?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PitchDeckAnalysisSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        analysis: { type: Schema.Types.Mixed, required: true },
        source: { type: String },
    },
    { timestamps: true }
);

PitchDeckAnalysisSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IPitchDeckAnalysis>('PitchDeckAnalysis', PitchDeckAnalysisSchema);
