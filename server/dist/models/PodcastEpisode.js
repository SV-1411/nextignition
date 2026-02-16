"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PodcastEpisodeSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
PodcastEpisodeSchema.index({ tier: 1, category: 1 });
PodcastEpisodeSchema.index({ featured: 1, publishDate: -1 });
exports.default = mongoose_1.default.model('PodcastEpisode', PodcastEpisodeSchema);
