import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    type: 'text' | 'file' | 'image';
    fileUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        type: {
            type: String,
            enum: ['text', 'file', 'image'],
            default: 'text'
        },
        fileUrl: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
