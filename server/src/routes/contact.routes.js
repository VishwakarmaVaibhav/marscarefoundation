const express = require('express');
const router = express.Router();
const {
    submitContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth');
const { contactValidation, validate } = require('../middleware/validate');

// Public route
router.post('/', contactValidation, validate, submitContact);

// Protected routes
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
