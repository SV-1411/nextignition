"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedController_1 = require("../controllers/feedController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, feedController_1.createPost);
router.get('/', feedController_1.getFeed);
router.post('/:id/like', auth_1.protect, feedController_1.likePost);
router.post('/:id/comment', auth_1.protect, feedController_1.addComment);
router.post('/:id/share', auth_1.protect, feedController_1.sharePost);
exports.default = router;
