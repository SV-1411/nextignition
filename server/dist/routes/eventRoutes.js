"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', eventController_1.listEvents);
router.get('/mine', auth_1.protect, eventController_1.listMyEvents);
router.post('/', auth_1.protect, eventController_1.createEvent);
router.put('/:id', auth_1.protect, eventController_1.updateEvent);
router.post('/:id/register', auth_1.protect, eventController_1.registerForEvent);
router.post('/:id/unregister', auth_1.protect, eventController_1.unregisterFromEvent);
router.post('/:id/bookmark', auth_1.protect, eventController_1.toggleBookmark);
exports.default = router;
