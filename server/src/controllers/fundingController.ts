import { Request, Response } from 'express';
import Startup from '../models/Startup';
import FundingApplication from '../models/FundingApplication';
import FundingBookmark from '../models/FundingBookmark';
import FundingInterest from '../models/FundingInterest';
import { AuthRequest } from '../middleware/auth';

const getBaseUrl = () => process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const buildFileMeta = (file: Express.Multer.File) => {
    const baseUrl = getBaseUrl();
    return {
        url: `${baseUrl}/uploads/${file.filename}`,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
    };
};

export const getMyFundingDraft = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const draft = await FundingApplication.findOne({ founder: String(req.user.id) as any, status: 'draft' }).sort({ createdAt: -1 });
        if (!draft) {
            return res.json(null);
        }
        return res.json(draft);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

export const upsertMyFundingDraft = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const update: any = {
            startup: req.body.startupId,
            title: req.body.title,
            pitchSummary: req.body.pitchSummary,
            fundingAsk: req.body.fundingAsk,
            currency: req.body.currency,
            equityOffered: req.body.equityOffered,
            tags: Array.isArray(req.body.tags) ? req.body.tags : undefined,
            steps: req.body.steps,
        };

        Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

        const draft = await FundingApplication.findOneAndUpdate(
            { founder: String(req.user.id) as any, status: 'draft' },
            { $set: update, $setOnInsert: { founder: String(req.user.id) as any, status: 'draft' } },
            { new: true, upsert: true }
        );

        return res.json(draft);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

export const uploadMyPitchDeck = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = (req as any).file as Express.Multer.File | undefined;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const meta = buildFileMeta(file);

        const draft = await FundingApplication.findOneAndUpdate(
            { founder: String(req.user.id) as any, status: 'draft' },
            {
                $set: {
                    pitchDeck: meta,
                    pitchDeckUrl: meta.url,
                    'steps.pitchDeckUploaded': true,
                },
                $setOnInsert: { founder: String(req.user.id) as any, status: 'draft' },
            },
            { new: true, upsert: true }
        );

        return res.json({ pitchDeck: draft.pitchDeck, pitchDeckUrl: draft.pitchDeckUrl, draft });
    } catch (error: any) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};

export const uploadMyPitchVideo = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = (req as any).file as Express.Multer.File | undefined;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const meta = buildFileMeta(file);

        const draft = await FundingApplication.findOneAndUpdate(
            { founder: String(req.user.id) as any, status: 'draft' },
            {
                $set: {
                    pitchVideo: meta,
                    demoVideoUrl: meta.url,
                    'steps.pitchVideoUploaded': true,
                },
                $setOnInsert: { founder: String(req.user.id) as any, status: 'draft' },
            },
            { new: true, upsert: true }
        );

        return res.json({ pitchVideo: draft.pitchVideo, demoVideoUrl: draft.demoVideoUrl, draft });
    } catch (error: any) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};

export const uploadMyBusinessDocuments = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const files = ((req as any).files || []) as Express.Multer.File[];
        if (!files.length) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const metas = files.map((f) => ({ ...buildFileMeta(f), docType: req.body?.docType }));

        const draft = await FundingApplication.findOneAndUpdate(
            { founder: String(req.user.id) as any, status: 'draft' },
            {
                $push: { businessDocuments: { $each: metas } },
                $set: { 'steps.businessDocumentsUploaded': true },
                $setOnInsert: { founder: String(req.user.id) as any, status: 'draft' },
            },
            { new: true, upsert: true }
        );

        return res.json({ businessDocuments: draft.businessDocuments || [], draft });
    } catch (error: any) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};

export const submitMyFundingDraft = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const draft = await FundingApplication.findOne({ founder: String(req.user.id) as any, status: 'draft' }).sort({ createdAt: -1 });
        if (!draft) {
            return res.status(400).json({ message: 'No draft found' });
        }

        const title = req.body.title || draft.title;
        if (!title) {
            return res.status(400).json({ message: 'title is required' });
        }

        draft.title = title;
        draft.status = 'submitted';
        draft.submittedAt = new Date();
        draft.steps = {
            ...(draft.steps || {}),
            finalSubmitted: true,
        };

        await draft.save();
        return res.json(draft);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

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
            steps: {
                profileComplete: true,
                pitchDeckUploaded: !!pitchDeckUrl,
                pitchVideoUploaded: !!demoVideoUrl,
                businessDocumentsUploaded: false,
                finalSubmitted: true,
            },
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
