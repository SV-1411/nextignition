import mongoose, { Schema, Document } from 'mongoose';

export interface ICofounderSave extends Document {
    user: mongoose.Schema.Types.ObjectId;
    cofounderUser: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CofounderSaveSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        cofounderUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

CofounderSaveSchema.index({ user: 1, cofounderUser: 1 }, { unique: true });

export default mongoose.model<ICofounderSave>('CofounderSave', CofounderSaveSchema);
