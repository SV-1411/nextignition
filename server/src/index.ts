import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import startupRoutes from './routes/startupRoutes';
import feedRoutes from './routes/feedRoutes';
import aiRoutes from './routes/aiRoutes';
import bookingRoutes from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import eventRoutes from './routes/eventRoutes';
import paymentRoutes from './routes/paymentRoutes';
import communityRoutes from './routes/communityRoutes';
import verificationRoutes from './routes/verificationRoutes';
import fundingRoutes from './routes/fundingRoutes';
import cofounderRoutes from './routes/cofounderRoutes';
import newsRoutes from './routes/newsRoutes';
import podcastRoutes from './routes/podcastRoutes';
import availabilityRoutes from './routes/availabilityRoutes';
import messagingRoutes from './routes/messagingRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration - works for both local dev and production
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

export const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextignition';

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.id} left conversation: ${conversationId}`);
    });

    // Send a message
    socket.on('send_message', (data) => {
        const { conversationId, message } = data;
        socket.to(conversationId).emit('receive_message', message);
    });

    // Typing indicator
    socket.on('typing', (data) => {
        const { conversationId, userId } = data;
        socket.to(conversationId).emit('user_typing', { userId });
    });

    socket.on('stop_typing', (data) => {
        const { conversationId, userId } = data;
        socket.to(conversationId).emit('user_stop_typing', { userId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/cofounders', cofounderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/messaging', messagingRoutes);

// Health check route (important for Render deployment)
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'NextIgnition API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Database Connection
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
