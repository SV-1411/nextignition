"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const cofounderController_1 = require("../controllers/cofounderController");
const router = express_1.default.Router();
router.get('/', cofounderController_1.listCofounders);
router.get('/saved', auth_1.protect, cofounderController_1.listSavedCofounders);
router.post('/saved/:userId', auth_1.protect, cofounderController_1.saveCofounder);
router.get('/users/:userId', cofounderController_1.getUserPublic);
router.put('/me', auth_1.protect, cofounderController_1.upsertMyCofounderProfile);
exports.default = router;
