"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const startupController_1 = require("../controllers/startupController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, startupController_1.createStartup);
router.get('/my', auth_1.protect, startupController_1.getMyStartups);
router.get('/', startupController_1.getAllStartups);
router.put('/:id', auth_1.protect, startupController_1.updateStartup);
exports.default = router;
