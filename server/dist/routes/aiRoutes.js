"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/summary', auth_1.protect, aiController_1.generateStartupSummary);
router.post('/profile', auth_1.protect, aiController_1.summarizeProfile);
router.post('/pitch-deck', upload_1.uploadDocs.single('pitchDeck'), aiController_1.summarizePitchDeck);
router.post('/chat', auth_1.protect, aiController_1.aiChat);
router.post('/match-experts', auth_1.protect, aiController_1.matchExperts);
exports.default = router;
