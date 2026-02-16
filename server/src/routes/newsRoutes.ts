import express from 'express';
import { protect } from '../middleware/auth';
import {
    listNewsArticles,
    getNewsArticle,
    createNewsArticle,
    getTrendingTopics
} from '../controllers/newsController';

const router = express.Router();

router.get('/', listNewsArticles);
router.get('/trending', getTrendingTopics);
router.get('/:id', getNewsArticle);
router.post('/', protect, createNewsArticle);

export default router;
