import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: 'booking' | 'message' | 'connection' | 'system' | 'ai' | 'post' | 'review' | 'community';
    title: string;
    content: string;
    link?: string;
    metadata?: Record<string, any>;
    read: boolean;
    sender?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['booking', 'message', 'connection', 'system', 'ai', 'post', 'review', 'community'],
            required: true,
        },
        title: { type: String, required: true },
        content: { type: String, required: true },
        link: { type: String },
        metadata: { type: Schema.Types.Mixed },
        read: { type: Boolean, default: false },
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
