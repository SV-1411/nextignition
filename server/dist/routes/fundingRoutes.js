"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const fundingController_1 = require("../controllers/fundingController");
const router = express_1.default.Router();
router.get('/startups', fundingController_1.listFundingStartups);
router.post('/applications', auth_1.protect, fundingController_1.submitFundingApplication);
router.get('/bookmarks', auth_1.protect, fundingController_1.listMyBookmarks);
router.post('/startups/:startupId/bookmark', auth_1.protect, fundingController_1.bookmarkStartup);
router.post('/startups/:startupId/interest', auth_1.protect, fundingController_1.expressInterest);
exports.default = router;
