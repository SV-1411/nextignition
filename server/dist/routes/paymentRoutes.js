"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
router.post('/razorpay/order', auth_1.protect, paymentController_1.createRazorpayOrder);
router.post('/razorpay/verify', auth_1.protect, paymentController_1.verifyRazorpayPayment);
exports.default = router;
