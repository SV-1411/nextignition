import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityInvite extends Document {
  community: mongoose.Types.ObjectId;
  inviter: mongoose.Types.ObjectId;
  invitee: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const CommunityInviteSchema: Schema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    invitee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

CommunityInviteSchema.index(
  { community: 1, invitee: 1, status: 1 },
  { partialFilterExpression: { status: 'pending' } }
);

CommunityInviteSchema.index(
  { community: 1, invitee: 1, inviter: 1 },
  { unique: true }
);

export default mongoose.model<ICommunityInvite>('CommunityInvite', CommunityInviteSchema);
