import mongoose, { Schema, Document } from 'mongoose';

export type NewsCategory = 'funding' | 'product-launch' | 'market-trends' | 'acquisition' | 'industry-news';

export interface INewsArticle extends Document {
    headline: string;
    summary: string;
    content: string;
    category: NewsCategory;
    source: {
        name: string;
        logo?: string;
    };
    author?: string;
    publishDate: Date;
    readTime: string;
    image?: string;
    views: number;
    location: string;
    industries: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NewsArticleSchema: Schema = new Schema(
    {
        headline: { type: String, required: true },
        summary: { type: String, required: true },
        content: { type: String, required: true },
        category: {
            type: String,
            enum: ['funding', 'product-launch', 'market-trends', 'acquisition', 'industry-news'],
            default: 'industry-news'
        },
        source: {
            name: { type: String, required: true },
            logo: { type: String }
        },
        author: { type: String },
        publishDate: { type: Date, default: Date.now },
        readTime: { type: String, default: '5 min' },
        image: { type: String },
        views: { type: Number, default: 0 },
        location: { type: String, default: 'global' },
        industries: [{ type: String }],
        isPublished: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);
