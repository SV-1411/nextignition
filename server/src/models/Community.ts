import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  icon: string;
  description: string;
  roleExclusive?: string;
  memberCount: number;
  allowedRoles: ('founder' | 'expert' | 'investor')[];
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema: Schema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  roleExclusive: { type: String, default: null },
  memberCount: { type: Number, default: 0 },
  allowedRoles: [{ type: String, enum: ['founder', 'expert', 'investor'] }],
}, { timestamps: true });

export default mongoose.model<ICommunity>('Community', communitySchema);
