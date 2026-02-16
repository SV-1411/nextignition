import { Request, Response } from 'express';
import NewsArticle from '../models/NewsArticle';
import { AuthRequest } from '../middleware/auth';

export const listNewsArticles = async (req: Request, res: Response) => {
    try {
        const { category, location, industry, limit = '20' } = req.query;
        
        const filter: any = { isPublished: true };
        if (category) filter.category = category;
        if (location && location !== 'global') filter.location = location;
        if (industry) filter.industries = { $in: [industry] };

        const articles = await NewsArticle.find(filter)
            .sort({ publishDate: -1 })
            .limit(parseInt(String(limit), 10));

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getNewsArticle = async (req: Request, res: Response) => {
    try {
        const article = await NewsArticle.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        // Increment views
        article.views += 1;
        await article.save();
        
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createNewsArticle = async (req: AuthRequest, res: Response) => {
    try {
        const article = await NewsArticle.create({
            ...req.body,
            publishDate: new Date()
        });
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTrendingTopics = async (req: Request, res: Response) => {
    try {
        // Aggregate trending topics from article tags/industries
        const articles = await NewsArticle.find({ isPublished: true }).select('industries');
        const tagCounts: Record<string, number> = {};
        
        articles.forEach(article => {
            article.industries.forEach(industry => {
                tagCounts[industry] = (tagCounts[industry] || 0) + 1;
            });
        });

        const trending = Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        res.json(trending);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
