import { Request, Response } from 'express';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { content, image, industry, tags } = req.body;

        const post = await Post.create({
            author: req.user.id,
            content,
            image,
            industry,
            tags,
        });

        const populatedPost = await post.populate('author', 'name role avatar');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFeed = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name role avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const likePost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.user.id);
        if (likeIndex === -1) {
            post.likes.push(req.user.id);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            user: req.user.id,
            text,
            createdAt: new Date(),
        });

        await post.save();
        const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name avatar');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
