import mongoose, { Schema, Document } from 'mongoose';

export interface IChannel extends Document {
  communityId: mongoose.Types.ObjectId;
  name: string;
  type: 'text' | 'voice';
  description: string;
  readOnly?: boolean;
  createdAt: Date;
}

const channelSchema: Schema = new Schema({
  communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'voice'], default: 'text' },
  description: { type: String, default: '' },
  readOnly: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IChannel>('Channel', channelSchema);
