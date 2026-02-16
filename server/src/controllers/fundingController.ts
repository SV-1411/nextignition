import { Request, Response } from 'express';
import Startup from '../models/Startup';
import FundingApplication from '../models/FundingApplication';
import FundingBookmark from '../models/FundingBookmark';
import FundingInterest from '../models/FundingInterest';
import { AuthRequest } from '../middleware/auth';

export const submitFundingApplication = async (req: AuthRequest, res: Response) => {
    try {
        const {
            startupId,
            title,
            pitchSummary,
            fundingAsk,
            currency,
            equityOffered,
            pitchDeckUrl,
            demoVideoUrl,
            tags,
        } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'title is required' });
        }

        const app = await FundingApplication.create({
            founder: req.user.id,
            startup: startupId,
            title,
            pitchSummary,
            fundingAsk,
            currency,
            equityOffered,
            pitchDeckUrl,
            demoVideoUrl,
            tags: Array.isArray(tags) ? tags : [],
            status: 'submitted',
            submittedAt: new Date(),
        });

        res.status(201).json(app);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const listFundingStartups = async (req: Request, res: Response) => {
    try {
        const startups = await Startup.find().populate('founder', 'name avatar role').sort({ createdAt: -1 });
        res.json(startups);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const bookmarkStartup = async (req: AuthRequest, res: Response) => {
    try {
        const startupId = String(req.params.startupId);
        const investorId = String(req.user.id);

        const existing = await FundingBookmark.findOne({ investor: investorId as any, startup: startupId as any });
        if (existing) {
            await FundingBookmark.deleteOne({ _id: existing._id });
            return res.json({ bookmarked: false });
        }
        await FundingBookmark.create({ investor: investorId as any, startup: startupId as any });
        res.json({ bookmarked: true });
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.json({ bookmarked: true });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const expressInterest = async (req: AuthRequest, res: Response) => {
    try {
        const startupId = String(req.params.startupId);
        const investorId = String(req.user.id);
        const { note } = req.body;

        const existing = await FundingInterest.findOne({ investor: investorId as any, startup: startupId as any });
        if (existing) {
            return res.json(existing);
        }

        const interest = await FundingInterest.create({
            investor: investorId as any,
            startup: startupId as any,
            note,
        });

        res.status(201).json(interest);
    } catch (error: any) {
        if (error?.code === 11000) {
            const startupId = String(req.params.startupId);
            const existing = await FundingInterest.findOne({ investor: String(req.user.id) as any, startup: startupId as any });
            return res.json(existing);
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const listMyBookmarks = async (req: AuthRequest, res: Response) => {
    try {
        const bookmarks = await FundingBookmark.find({ investor: String(req.user.id) as any }).select('startup');
        res.json(bookmarks.map(b => String(b.startup)));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
