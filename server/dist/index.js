"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const startupRoutes_1 = __importDefault(require("./routes/startupRoutes"));
const feedRoutes_1 = __importDefault(require("./routes/feedRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const verificationRoutes_1 = __importDefault(require("./routes/verificationRoutes"));
const fundingRoutes_1 = __importDefault(require("./routes/fundingRoutes"));
const cofounderRoutes_1 = __importDefault(require("./routes/cofounderRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const podcastRoutes_1 = __importDefault(require("./routes/podcastRoutes"));
const availabilityRoutes_1 = __importDefault(require("./routes/availabilityRoutes"));
const messagingRoutes_1 = __importDefault(require("./routes/messagingRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// CORS configuration - works for both local dev and production
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextignition';
// Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Socket.io connection
exports.io.on('connection', (socket) => {
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
app.use('/api/auth', authRoutes_1.default);
app.use('/api/startups', startupRoutes_1.default);
app.use('/api/feed', feedRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/communities', communityRoutes_1.default);
app.use('/api/verification', verificationRoutes_1.default);
app.use('/api/funding', fundingRoutes_1.default);
app.use('/api/cofounders', cofounderRoutes_1.default);
app.use('/api/news', newsRoutes_1.default);
app.use('/api/podcasts', podcastRoutes_1.default);
app.use('/api/availability', availabilityRoutes_1.default);
app.use('/api/messaging', messagingRoutes_1.default);
app.use('/api/follow', followRoutes_1.default);
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
mongoose_1.default
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
