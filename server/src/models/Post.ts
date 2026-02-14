import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    author: mongoose.Schema.Types.ObjectId;
    content: string;
    image?: string;
    industry?: string;
    likes: mongoose.Schema.Types.ObjectId[];
    comments: {
        user: mongoose.Schema.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    shares: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        image: { type: String },
        industry: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        shares: { type: Number, default: 0 },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
