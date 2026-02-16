const express = require('express');
const router = express.Router();
const {
    getGalleryItems,
    getGalleryItem,
    uploadImages,
    updateGalleryItem,
    deleteGalleryItem,
    getAlbums,

    reorderItems,
    importProgramImages
} = require('../controllers/gallery.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/albums', getAlbums);
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItem);

// Protected routes
router.post('/import-program', protect, importProgramImages);
router.post('/', protect, upload.array('images', 20), uploadImages);
router.put('/reorder', protect, reorderItems);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
