import { Request, Response } from 'express';
import PodcastEpisode from '../models/PodcastEpisode';
import { AuthRequest } from '../middleware/auth';

export const listPodcastEpisodes = async (req: Request, res: Response) => {
    try {
        const { tier, category, featured, limit = '50' } = req.query;
        
        const filter: any = { isPublished: true };
        if (tier && tier !== 'all') filter.tier = tier;
        if (category && category !== 'all') filter.category = category;
        if (featured === 'true') filter.featured = true;

        const episodes = await PodcastEpisode.find(filter)
            .sort({ publishDate: -1 })
            .limit(parseInt(String(limit), 10));

        res.json(episodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPodcastEpisode = async (req: Request, res: Response) => {
    try {
        const episode = await PodcastEpisode.findById(req.params.id);
        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }
        
        // Increment plays
        episode.plays += 1;
        await episode.save();
        
        res.json(episode);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createPodcastEpisode = async (req: AuthRequest, res: Response) => {
    try {
        const episode = await PodcastEpisode.create({
            ...req.body,
            publishDate: new Date()
        });
        res.status(201).json(episode);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFeaturedEpisodes = async (req: Request, res: Response) => {
    try {
        const episodes = await PodcastEpisode.find({ featured: true, isPublished: true })
            .sort({ publishDate: -1 })
            .limit(5);
        res.json(episodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRecentlyPlayed = async (req: AuthRequest, res: Response) => {
    try {
        // Return most played episodes in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const episodes = await PodcastEpisode.find({ 
            isPublished: true,
            updatedAt: { $gte: thirtyDaysAgo }
        })
            .sort({ plays: -1 })
            .limit(5);
        
        res.json(episodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRecommendedEpisodes = async (req: AuthRequest, res: Response) => {
    try {
        const userRole = req.user?.role || 'founder';
        
        // Recommend based on user role
        const episodes = await PodcastEpisode.find({
            isPublished: true,
            targetAudience: { $in: [userRole] }
        })
            .sort({ plays: -1 })
            .limit(3);
        
        res.json(episodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
