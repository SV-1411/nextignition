"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharePost = exports.addComment = exports.likePost = exports.getFeed = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const index_1 = require("../index");
const createPost = async (req, res) => {
    try {
        const { content, image, industry, tags } = req.body;
        const post = await Post_1.default.create({
            author: req.user.id,
            content,
            image,
            industry,
            tags,
        });
        const populatedPost = await post.populate('author', 'name role avatar');
        index_1.io.emit('feed_post_created', populatedPost);
        res.status(201).json(populatedPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createPost = createPost;
const getFeed = async (req, res) => {
    try {
        const posts = await Post_1.default.find()
            .populate('author', 'name role avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getFeed = getFeed;
const likePost = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            post.likes.push(req.user.id);
        }
        else {
            post.likes.splice(likeIndex, 1);
        }
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.likePost = likePost;
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.comments.push({
            user: req.user.id,
            text,
            createdAt: new Date(),
        });
        await post.save();
        const updatedPost = await Post_1.default.findById(req.params.id).populate('comments.user', 'name avatar');
        res.json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.addComment = addComment;
const sharePost = async (req, res) => {
    try {
        const post = await Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.shares = (post.shares || 0) + 1;
        await post.save();
        index_1.io.emit('feed_post_shared', { postId: String(post._id), shares: post.shares });
        res.json({ postId: String(post._id), shares: post.shares });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.sharePost = sharePost;
