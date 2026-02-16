"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EventSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ['webinar', 'workshop', 'demo-day', 'networking', 'masterclass'],
        required: true,
    },
    category: { type: String },
    tags: [{ type: String }],
    hostType: {
        type: String,
        enum: ['platform', 'expert', 'investor', 'founder'],
        required: true,
    },
    hostUser: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['draft', 'upcoming', 'live', 'completed', 'cancelled'],
        default: 'draft',
    },
    startAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    format: { type: String, enum: ['virtual', 'in-person'], default: 'virtual' },
    location: { type: String },
    meetingLink: { type: String },
    priceType: { type: String, enum: ['free', 'paid'], default: 'free' },
    priceAmount: { type: Number },
    currency: { type: String, default: 'INR' },
    maxAttendees: { type: Number },
    registeredUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    bookmarkedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    thumbnailUrl: { type: String },
    recordingUrl: { type: String },
}, { timestamps: true });
EventSchema.index({ startAt: 1, status: 1 });
EventSchema.index({ type: 1, status: 1 });
exports.default = mongoose_1.default.model('Event', EventSchema);
