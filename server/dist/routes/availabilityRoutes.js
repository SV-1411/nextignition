"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const availabilityController_1 = require("../controllers/availabilityController");
const router = express_1.default.Router();
// Expert routes (protected)
router.get('/my-availability', auth_1.protect, availabilityController_1.getMyAvailability);
router.post('/availability', auth_1.protect, availabilityController_1.setAvailability);
router.delete('/availability/:dayOfWeek', auth_1.protect, availabilityController_1.deleteAvailability);
// Specific date availability routes
router.get('/specific-dates', auth_1.protect, availabilityController_1.getSpecificDateSlots);
router.post('/specific-date', auth_1.protect, availabilityController_1.setSpecificDateSlots);
router.delete('/specific-date/:date', auth_1.protect, availabilityController_1.deleteSpecificDateSlots);
// Public route to view expert availability
router.get('/expert/:expertId', availabilityController_1.getExpertAvailability);
router.get('/expert/:expertId/date/:date', availabilityController_1.getSpecificDateAvailability);
exports.default = router;
