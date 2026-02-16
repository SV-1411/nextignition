"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBookmark = exports.unregisterFromEvent = exports.registerForEvent = exports.updateEvent = exports.createEvent = exports.listMyEvents = exports.listEvents = void 0;
const Event_1 = __importDefault(require("../models/Event"));
const parseCommaList = (value) => {
    if (!value)
        return [];
    if (Array.isArray(value))
        return value.map(String).map(s => s.trim()).filter(Boolean);
    return String(value)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
};
// GET /api/events
const listEvents = async (req, res) => {
    try {
        const { status, type, q, hostType } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (type)
            filter.type = type;
        if (hostType)
            filter.hostType = hostType;
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
            ];
        }
        const events = await Event_1.default.find(filter)
            .populate('hostUser', 'name role avatar isVerified')
            .sort({ startAt: 1 })
            .limit(100);
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listEvents = listEvents;
// GET /api/events/mine?mode=attending|hosting
const listMyEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const mode = req.query.mode || 'attending';
        const filter = {};
        if (mode === 'hosting') {
            filter.hostUser = userId;
        }
        else {
            filter.registeredUsers = userId;
        }
        const events = await Event_1.default.find(filter)
            .populate('hostUser', 'name role avatar isVerified')
            .sort({ startAt: 1 })
            .limit(100);
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listMyEvents = listMyEvents;
// POST /api/events (expert/investor/admin)
const createEvent = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;
        const { title, description, type, category, tags, status, startAt, durationMinutes, format, location, meetingLink, priceType, priceAmount, currency, maxAttendees, thumbnailUrl, } = req.body;
        // Host rules
        const isAdmin = userRole === 'admin';
        const isFounder = userRole === 'founder';
        const isExpert = userRole === 'expert';
        const isInvestor = userRole === 'investor';
        if (!isAdmin && !isFounder && !isExpert && !isInvestor) {
            return res.status(403).json({ message: 'Not authorized to create events' });
        }
        const hostType = isAdmin ? 'platform' : isExpert ? 'expert' : isInvestor ? 'investor' : 'founder';
        const event = await Event_1.default.create({
            title,
            description,
            type,
            category,
            tags: parseCommaList(tags),
            hostType,
            hostUser: isAdmin ? undefined : userId,
            status: status || 'draft',
            startAt: new Date(startAt),
            durationMinutes: durationMinutes ?? 60,
            format: format || 'virtual',
            location,
            meetingLink,
            priceType: priceType || 'free',
            priceAmount: priceType === 'paid' ? Number(priceAmount || 0) : undefined,
            currency: currency || 'INR',
            maxAttendees,
            thumbnailUrl,
        });
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.status(201).json(populated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createEvent = createEvent;
// PUT /api/events/:id (host/admin)
const updateEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const event = await Event_1.default.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        const isAdmin = userRole === 'admin';
        const isHost = event.hostUser?.toString() === userId;
        if (!isAdmin && !isHost) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (req.body.tags !== undefined) {
            req.body.tags = parseCommaList(req.body.tags);
        }
        const updated = await Event_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('hostUser', 'name role avatar isVerified');
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateEvent = updateEvent;
// POST /api/events/:id/register
const registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const event = await Event_1.default.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }
        const idx = event.registeredUsers.findIndex(u => u.toString() === userId);
        if (idx === -1) {
            event.registeredUsers.push(userId);
        }
        await event.save();
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.registerForEvent = registerForEvent;
// POST /api/events/:id/unregister
const unregisterFromEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const event = await Event_1.default.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        event.registeredUsers = event.registeredUsers.filter(u => u.toString() !== userId);
        await event.save();
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.unregisterFromEvent = unregisterFromEvent;
// POST /api/events/:id/bookmark
const toggleBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const event = await Event_1.default.findById(req.params.id);
        if (!event)
            return res.status(404).json({ message: 'Event not found' });
        const idx = event.bookmarkedBy.findIndex(u => u.toString() === userId);
        if (idx === -1) {
            event.bookmarkedBy.push(userId);
        }
        else {
            event.bookmarkedBy.splice(idx, 1);
        }
        await event.save();
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.toggleBookmark = toggleBookmark;
