"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const verificationController_1 = require("../controllers/verificationController");
const router = express_1.default.Router();
router.post('/complete', auth_1.protect, verificationController_1.completeVerification);
router.post('/banner', auth_1.protect, verificationController_1.setVerificationBannerState);
exports.default = router;
