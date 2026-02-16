"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const newsController_1 = require("../controllers/newsController");
const router = express_1.default.Router();
router.get('/', newsController_1.listNewsArticles);
router.get('/trending', newsController_1.getTrendingTopics);
router.get('/:id', newsController_1.getNewsArticle);
router.post('/', auth_1.protect, newsController_1.createNewsArticle);
exports.default = router;
