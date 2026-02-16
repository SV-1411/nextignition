import express from 'express';
import { protect } from '../middleware/auth';
import {
    listPodcastEpisodes,
    getPodcastEpisode,
    createPodcastEpisode,
    getFeaturedEpisodes,
    getRecentlyPlayed,
    getRecommendedEpisodes
} from '../controllers/podcastController';

const router = express.Router();

router.get('/', listPodcastEpisodes);
router.get('/featured', getFeaturedEpisodes);
router.get('/recently-played', protect, getRecentlyPlayed);
router.get('/recommended', protect, getRecommendedEpisodes);
router.get('/:id', getPodcastEpisode);
router.post('/', protect, createPodcastEpisode);

export default router;
