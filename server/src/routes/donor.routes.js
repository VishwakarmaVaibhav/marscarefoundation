const express = require('express');
const router = express.Router();
const {
    getDonors,
    getDonor,
    createDonor,
    updateDonor,
    deleteDonor,
    exportDonors,
    getDonorStats
} = require('../controllers/donor.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/export', exportDonors);
router.get('/stats', getDonorStats);
router.get('/', getDonors);
router.get('/:id', getDonor);
router.post('/', createDonor);
router.put('/:id', updateDonor);
router.delete('/:id', authorize('admin'), deleteDonor);

module.exports = router;
