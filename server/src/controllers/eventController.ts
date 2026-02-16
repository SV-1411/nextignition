import { Request, Response } from 'express';
import Event, { EventType, EventStatus, EventFormat } from '../models/Event';
import { AuthRequest } from '../middleware/auth';

const parseCommaList = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).map(s => s.trim()).filter(Boolean);
    return String(value)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
};

// GET /api/events
export const listEvents = async (req: Request, res: Response) => {
    try {
        const { status, type, q, hostType } = req.query as {
            status?: EventStatus;
            type?: EventType;
            q?: string;
            hostType?: 'platform' | 'expert' | 'investor';
        };

        const filter: any = {};
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (hostType) filter.hostType = hostType;
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
            ];
        }

        const events = await Event.find(filter)
            .populate('hostUser', 'name role avatar isVerified')
            .sort({ startAt: 1 })
            .limit(100);

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/events/mine?mode=attending|hosting
export const listMyEvents = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const mode = (req.query.mode as string) || 'attending';

        const filter: any = {};
        if (mode === 'hosting') {
            filter.hostUser = userId;
        } else {
            filter.registeredUsers = userId;
        }

        const events = await Event.find(filter)
            .populate('hostUser', 'name role avatar isVerified')
            .sort({ startAt: 1 })
            .limit(100);

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/events (expert/investor/admin)
export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userRole = req.user.role as string;
        const userId = req.user.id as string;

        const {
            title,
            description,
            type,
            category,
            tags,
            status,
            startAt,
            durationMinutes,
            format,
            location,
            meetingLink,
            priceType,
            priceAmount,
            currency,
            maxAttendees,
            thumbnailUrl,
        } = req.body;

        // Host rules
        const isAdmin = userRole === 'admin';
        const isFounder = userRole === 'founder';
        const isExpert = userRole === 'expert';
        const isInvestor = userRole === 'investor';
        if (!isAdmin && !isFounder && !isExpert && !isInvestor) {
            return res.status(403).json({ message: 'Not authorized to create events' });
        }

        const hostType = isAdmin ? 'platform' : isExpert ? 'expert' : isInvestor ? 'investor' : 'founder';

        const event = await Event.create({
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
            format: (format as EventFormat) || 'virtual',
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
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/events/:id (host/admin)
export const updateEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isAdmin = userRole === 'admin';
        const isHost = event.hostUser?.toString() === userId;
        if (!isAdmin && !isHost) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (req.body.tags !== undefined) {
            req.body.tags = parseCommaList(req.body.tags);
        }

        const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('hostUser', 'name role avatar isVerified');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/events/:id/register
export const registerForEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const idx = event.registeredUsers.findIndex(u => u.toString() === userId);
        if (idx === -1) {
            event.registeredUsers.push(userId as any);
        }

        await event.save();
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/events/:id/unregister
export const unregisterFromEvent = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.registeredUsers = event.registeredUsers.filter(u => u.toString() !== userId);
        await event.save();

        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/events/:id/bookmark
export const toggleBookmark = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const idx = event.bookmarkedBy.findIndex(u => u.toString() === userId);
        if (idx === -1) {
            event.bookmarkedBy.push(userId as any);
        } else {
            event.bookmarkedBy.splice(idx, 1);
        }

        await event.save();
        const populated = await event.populate('hostUser', 'name role avatar isVerified');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
