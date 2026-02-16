const express = require('express');
const router = express.Router();
const {
    getVolunteers,
    getVolunteer,
    registerVolunteer,
    updateVolunteer,
    deleteVolunteer,
    getVolunteerStats,
    logHours,
    approveVolunteer,
    assignVolunteer
} = require('../controllers/volunteer.controller');
const { protect, authorize } = require('../middleware/auth');
const { volunteerValidation, validate } = require('../middleware/validate');

// Public route
router.post('/register', volunteerValidation, validate, registerVolunteer);

// Protected routes
router.get('/stats', protect, getVolunteerStats);
router.get('/', protect, getVolunteers);
router.get('/:id', protect, getVolunteer);
router.put('/:id', protect, updateVolunteer);
router.put('/:id/hours', protect, logHours);
router.delete('/:id', protect, authorize('admin'), deleteVolunteer);
router.put('/:id/approve', protect, authorize('admin'), approveVolunteer);
router.post('/:id/assign', protect, authorize('admin'), assignVolunteer);

module.exports = router;
