import mongoose, { Schema, Document } from 'mongoose';

export type PodcastTier = 'free' | 'pro' | 'elite' | 'expert';

export interface IPodcastEpisode extends Document {
    title: string;
    episodeNumber: number;
    duration: string;
    durationSeconds: number;
    publishDate: Date;
    thumbnail?: string;
    host: {
        name: string;
        avatar?: string;
    };
    tier: PodcastTier;
    category: string;
    description: string;
    isBookmarked: boolean;
    plays: number;
    isVideo: boolean;
    targetAudience?: ('founder' | 'expert' | 'investor')[];
    tags?: string[];
    audioUrl?: string;
    videoUrl?: string;
    isPublished: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PodcastEpisodeSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        episodeNumber: { type: Number, required: true },
        duration: { type: String, required: true },
        durationSeconds: { type: Number, required: true },
        publishDate: { type: Date, default: Date.now },
        thumbnail: { type: String },
        host: {
            name: { type: String, required: true },
            avatar: { type: String }
        },
        tier: {
            type: String,
            enum: ['free', 'pro', 'elite', 'expert'],
            default: 'free'
        },
        category: { type: String, default: 'tech' },
        description: { type: String, required: true },
        isBookmarked: { type: Boolean, default: false },
        plays: { type: Number, default: 0 },
        isVideo: { type: Boolean, default: false },
        targetAudience: [{ type: String, enum: ['founder', 'expert', 'investor'] }],
        tags: [{ type: String }],
        audioUrl: { type: String },
        videoUrl: { type: String },
        isPublished: { type: Boolean, default: true },
        featured: { type: Boolean, default: false }
    },
    { timestamps: true }
);

PodcastEpisodeSchema.index({ tier: 1, category: 1 });
PodcastEpisodeSchema.index({ featured: 1, publishDate: -1 });

export default mongoose.model<IPodcastEpisode>('PodcastEpisode', PodcastEpisodeSchema);
