"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedEpisodes = exports.getRecentlyPlayed = exports.getFeaturedEpisodes = exports.createPodcastEpisode = exports.getPodcastEpisode = exports.listPodcastEpisodes = void 0;
const PodcastEpisode_1 = __importDefault(require("../models/PodcastEpisode"));
const listPodcastEpisodes = async (req, res) => {
    try {
        const { tier, category, featured, limit = '50' } = req.query;
        const filter = { isPublished: true };
        if (tier && tier !== 'all')
            filter.tier = tier;
        if (category && category !== 'all')
            filter.category = category;
        if (featured === 'true')
            filter.featured = true;
        const episodes = await PodcastEpisode_1.default.find(filter)
            .sort({ publishDate: -1 })
            .limit(parseInt(String(limit), 10));
        res.json(episodes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listPodcastEpisodes = listPodcastEpisodes;
const getPodcastEpisode = async (req, res) => {
    try {
        const episode = await PodcastEpisode_1.default.findById(req.params.id);
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        // Increment plays
        episode.plays += 1;
        await episode.save();
        res.json(episode);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getPodcastEpisode = getPodcastEpisode;
const createPodcastEpisode = async (req, res) => {
    try {
        const episode = await PodcastEpisode_1.default.create({
            ...req.body,
            publishDate: new Date()
        });
        res.status(201).json(episode);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createPodcastEpisode = createPodcastEpisode;
const getFeaturedEpisodes = async (req, res) => {
    try {
        const episodes = await PodcastEpisode_1.default.find({ featured: true, isPublished: true })
            .sort({ publishDate: -1 })
            .limit(5);
        res.json(episodes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getFeaturedEpisodes = getFeaturedEpisodes;
const getRecentlyPlayed = async (req, res) => {
    try {
        // Return most played episodes in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const episodes = await PodcastEpisode_1.default.find({
            isPublished: true,
            updatedAt: { $gte: thirtyDaysAgo }
        })
            .sort({ plays: -1 })
            .limit(5);
        res.json(episodes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getRecentlyPlayed = getRecentlyPlayed;
const getRecommendedEpisodes = async (req, res) => {
    try {
        const userRole = req.user?.role || 'founder';
        // Recommend based on user role
        const episodes = await PodcastEpisode_1.default.find({
            isPublished: true,
            targetAudience: { $in: [userRole] }
        })
            .sort({ plays: -1 })
            .limit(3);
        res.json(episodes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getRecommendedEpisodes = getRecommendedEpisodes;
