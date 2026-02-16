"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const communityController_1 = require("../controllers/communityController");
const router = express_1.default.Router();
router.get('/', auth_1.protect, communityController_1.getCommunities);
router.get('/:communityId/channels', auth_1.protect, communityController_1.getChannels);
router.get('/:communityId/members', auth_1.protect, communityController_1.getMembers);
router.get('/channels/:channelId/messages', auth_1.protect, communityController_1.getMessages);
router.post('/channels/:channelId/messages', auth_1.protect, communityController_1.sendMessage);
exports.default = router;
