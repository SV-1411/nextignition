import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: {
        content: string;
        sender: mongoose.Types.ObjectId;
        timestamp: Date;
    };
    unreadCount: Map<string, number>;
    type: 'direct' | 'group';
    name?: string; // For group chats
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        lastMessage: {
            content: { type: String },
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date },
        },
        unreadCount: { type: Map, of: Number, default: {} },
        type: { type: String, enum: ['direct', 'group'], default: 'direct' },
        name: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
