"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAny = exports.uploadVideo = exports.uploadDocs = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const UPLOAD_DIR = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '').toLowerCase();
        const safeExt = ext && ext.length <= 10 ? ext : '';
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPG/PNG/WEBP images are allowed'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
const docsFileFilter = (_req, file, cb) => {
    const allowed = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF/PPT/PPTX/DOC/DOCX/XLS/XLSX files are allowed'));
    }
};
exports.uploadDocs = (0, multer_1.default)({
    storage,
    fileFilter: docsFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
const videoFileFilter = (_req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only MP4/WEBM/MOV videos are allowed'));
    }
};
exports.uploadVideo = (0, multer_1.default)({
    storage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 200 * 1024 * 1024,
    },
});
exports.uploadAny = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});
