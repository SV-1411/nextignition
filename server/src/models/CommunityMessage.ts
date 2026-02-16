import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityMessage extends Document {
  channelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'system' | 'milestone' | 'poll' | 'shared-post';
  reactions: { emoji: string; count: number; users: mongoose.Types.ObjectId[] }[];
  threadCount: number;
  pinned: boolean;
  pollOptions?: { text: string; votes: number; voters: mongoose.Types.ObjectId[] }[];
  milestoneData?: { title: string; description: string };
  createdAt: Date;
  updatedAt: Date;
}

const communityMessageSchema: Schema = new Schema({
  channelId: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'system', 'milestone', 'poll', 'shared-post'], default: 'text' },
  reactions: [{
    emoji: { type: String, required: true },
    count: { type: Number, default: 0 },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  }],
  threadCount: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  pollOptions: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
    voters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  }],
  milestoneData: {
    title: { type: String },
    description: { type: String },
  },
}, { timestamps: true });

export default mongoose.model<ICommunityMessage>('CommunityMessage', communityMessageSchema);
