"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyBookmarks = exports.expressInterest = exports.bookmarkStartup = exports.listFundingStartups = exports.submitFundingApplication = exports.submitMyFundingDraft = exports.uploadMyBusinessDocuments = exports.uploadMyPitchVideo = exports.uploadMyPitchDeck = exports.upsertMyFundingDraft = exports.getMyFundingDraft = void 0;
const Startup_1 = __importDefault(require("../models/Startup"));
const FundingApplication_1 = __importDefault(require("../models/FundingApplication"));
const FundingBookmark_1 = __importDefault(require("../models/FundingBookmark"));
const FundingInterest_1 = __importDefault(require("../models/FundingInterest"));
const getBaseUrl = () => process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
const buildFileMeta = (file) => {
    const baseUrl = getBaseUrl();
    return {
        url: `${baseUrl}/uploads/${file.filename}`,
        originalName: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
    };
};
const getMyFundingDraft = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const draft = await FundingApplication_1.default.findOne({ founder: String(req.user.id), status: 'draft' }).sort({ createdAt: -1 });
        if (!draft) {
            return res.json(null);
        }
        return res.json(draft);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.getMyFundingDraft = getMyFundingDraft;
const upsertMyFundingDraft = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const update = {
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
        const draft = await FundingApplication_1.default.findOneAndUpdate({ founder: String(req.user.id), status: 'draft' }, { $set: update, $setOnInsert: { founder: String(req.user.id), status: 'draft' } }, { new: true, upsert: true });
        return res.json(draft);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.upsertMyFundingDraft = upsertMyFundingDraft;
const uploadMyPitchDeck = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const meta = buildFileMeta(file);
        const draft = await FundingApplication_1.default.findOneAndUpdate({ founder: String(req.user.id), status: 'draft' }, {
            $set: {
                pitchDeck: meta,
                pitchDeckUrl: meta.url,
                'steps.pitchDeckUploaded': true,
            },
            $setOnInsert: { founder: String(req.user.id), status: 'draft' },
        }, { new: true, upsert: true });
        return res.json({ pitchDeck: draft.pitchDeck, pitchDeckUrl: draft.pitchDeckUrl, draft });
    }
    catch (error) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};
exports.uploadMyPitchDeck = uploadMyPitchDeck;
const uploadMyPitchVideo = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const meta = buildFileMeta(file);
        const draft = await FundingApplication_1.default.findOneAndUpdate({ founder: String(req.user.id), status: 'draft' }, {
            $set: {
                pitchVideo: meta,
                demoVideoUrl: meta.url,
                'steps.pitchVideoUploaded': true,
            },
            $setOnInsert: { founder: String(req.user.id), status: 'draft' },
        }, { new: true, upsert: true });
        return res.json({ pitchVideo: draft.pitchVideo, demoVideoUrl: draft.demoVideoUrl, draft });
    }
    catch (error) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};
exports.uploadMyPitchVideo = uploadMyPitchVideo;
const uploadMyBusinessDocuments = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const files = (req.files || []);
        if (!files.length) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const metas = files.map((f) => ({ ...buildFileMeta(f), docType: req.body?.docType }));
        const draft = await FundingApplication_1.default.findOneAndUpdate({ founder: String(req.user.id), status: 'draft' }, {
            $push: { businessDocuments: { $each: metas } },
            $set: { 'steps.businessDocumentsUploaded': true },
            $setOnInsert: { founder: String(req.user.id), status: 'draft' },
        }, { new: true, upsert: true });
        return res.json({ businessDocuments: draft.businessDocuments || [], draft });
    }
    catch (error) {
        return res.status(500).json({ message: 'Upload failed', error: error?.message });
    }
};
exports.uploadMyBusinessDocuments = uploadMyBusinessDocuments;
const submitMyFundingDraft = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const draft = await FundingApplication_1.default.findOne({ founder: String(req.user.id), status: 'draft' }).sort({ createdAt: -1 });
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
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.submitMyFundingDraft = submitMyFundingDraft;
const submitFundingApplication = async (req, res) => {
    try {
        const { startupId, title, pitchSummary, fundingAsk, currency, equityOffered, pitchDeckUrl, demoVideoUrl, tags, } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'title is required' });
        }
        const app = await FundingApplication_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.submitFundingApplication = submitFundingApplication;
const listFundingStartups = async (req, res) => {
    try {
        const startups = await Startup_1.default.find().populate('founder', 'name avatar role').sort({ createdAt: -1 });
        res.json(startups);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listFundingStartups = listFundingStartups;
const bookmarkStartup = async (req, res) => {
    try {
        const startupId = String(req.params.startupId);
        const investorId = String(req.user.id);
        const existing = await FundingBookmark_1.default.findOne({ investor: investorId, startup: startupId });
        if (existing) {
            await FundingBookmark_1.default.deleteOne({ _id: existing._id });
            return res.json({ bookmarked: false });
        }
        await FundingBookmark_1.default.create({ investor: investorId, startup: startupId });
        res.json({ bookmarked: true });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.json({ bookmarked: true });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.bookmarkStartup = bookmarkStartup;
const expressInterest = async (req, res) => {
    try {
        const startupId = String(req.params.startupId);
        const investorId = String(req.user.id);
        const { note } = req.body;
        const existing = await FundingInterest_1.default.findOne({ investor: investorId, startup: startupId });
        if (existing) {
            return res.json(existing);
        }
        const interest = await FundingInterest_1.default.create({
            investor: investorId,
            startup: startupId,
            note,
        });
        res.status(201).json(interest);
    }
    catch (error) {
        if (error?.code === 11000) {
            const startupId = String(req.params.startupId);
            const existing = await FundingInterest_1.default.findOne({ investor: String(req.user.id), startup: startupId });
            return res.json(existing);
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.expressInterest = expressInterest;
const listMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await FundingBookmark_1.default.find({ investor: String(req.user.id) }).select('startup');
        res.json(bookmarks.map(b => String(b.startup)));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listMyBookmarks = listMyBookmarks;
