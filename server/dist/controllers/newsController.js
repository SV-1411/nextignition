"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingTopics = exports.createNewsArticle = exports.getNewsArticle = exports.listNewsArticles = void 0;
const NewsArticle_1 = __importDefault(require("../models/NewsArticle"));
const listNewsArticles = async (req, res) => {
    try {
        const { category, location, industry, limit = '20' } = req.query;
        const filter = { isPublished: true };
        if (category)
            filter.category = category;
        if (location && location !== 'global')
            filter.location = location;
        if (industry)
            filter.industries = { $in: [industry] };
        const articles = await NewsArticle_1.default.find(filter)
            .sort({ publishDate: -1 })
            .limit(parseInt(String(limit), 10));
        res.json(articles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listNewsArticles = listNewsArticles;
const getNewsArticle = async (req, res) => {
    try {
        const article = await NewsArticle_1.default.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        // Increment views
        article.views += 1;
        await article.save();
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNewsArticle = getNewsArticle;
const createNewsArticle = async (req, res) => {
    try {
        const article = await NewsArticle_1.default.create({
            ...req.body,
            publishDate: new Date()
        });
        res.status(201).json(article);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createNewsArticle = createNewsArticle;
const getTrendingTopics = async (req, res) => {
    try {
        // Aggregate trending topics from article tags/industries
        const articles = await NewsArticle_1.default.find({ isPublished: true }).select('industries');
        const tagCounts = {};
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTrendingTopics = getTrendingTopics;
