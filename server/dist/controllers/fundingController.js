"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyBookmarks = exports.expressInterest = exports.bookmarkStartup = exports.listFundingStartups = exports.submitFundingApplication = void 0;
const Startup_1 = __importDefault(require("../models/Startup"));
const FundingApplication_1 = __importDefault(require("../models/FundingApplication"));
const FundingBookmark_1 = __importDefault(require("../models/FundingBookmark"));
const FundingInterest_1 = __importDefault(require("../models/FundingInterest"));
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
