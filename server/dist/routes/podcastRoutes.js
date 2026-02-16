"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const podcastController_1 = require("../controllers/podcastController");
const router = express_1.default.Router();
router.get('/', podcastController_1.listPodcastEpisodes);
router.get('/featured', podcastController_1.getFeaturedEpisodes);
router.get('/recently-played', auth_1.protect, podcastController_1.getRecentlyPlayed);
router.get('/recommended', auth_1.protect, podcastController_1.getRecommendedEpisodes);
router.get('/:id', podcastController_1.getPodcastEpisode);
router.post('/', auth_1.protect, podcastController_1.createPodcastEpisode);
exports.default = router;
