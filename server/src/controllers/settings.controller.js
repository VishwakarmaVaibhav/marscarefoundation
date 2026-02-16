const { Settings, defaultSettings } = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (some) / Private (all)
exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.find();

        // Convert to object
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });

        // Merge with defaults
        const mergedSettings = { ...defaultSettings, ...settingsObj };

        // If not authenticated, filter sensitive settings
        if (!req.user) {
            const publicKeys = [
                'siteName', 'siteTagline', 'siteLogo', 'favicon',
                'defaultMetaTitle', 'defaultMetaDescription',
                'facebookUrl', 'twitterUrl', 'instagramUrl', 'linkedinUrl', 'youtubeUrl',
                'contactEmail', 'contactPhone', 'contactAddress', 'googleMapsEmbed',
                'minimumDonation', 'suggestedAmounts'
            ];

            const publicSettings = {};
            publicKeys.forEach(key => {
                if (mergedSettings[key] !== undefined) {
                    publicSettings[key] = mergedSettings[key];
                }
            });

            return res.json({
                success: true,
                data: publicSettings
            });
        }

        res.json({
            success: true,
            data: mergedSettings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res, next) => {
    try {
        const updates = req.body;

        for (const [key, value] of Object.entries(updates)) {
            await Settings.findOneAndUpdate(
                { key },
                { key, value },
                { upsert: true, new: true }
            );
        }

        res.json({
            success: true,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single setting
// @route   GET /api/settings/:key
// @access  Public
exports.getSetting = async (req, res, next) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });

        const value = setting ? setting.value : defaultSettings[req.params.key];

        if (value === undefined) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        res.json({
            success: true,
            data: { key: req.params.key, value }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Initialize default settings
// @route   POST /api/settings/init
// @access  Private (Admin)
exports.initSettings = async (req, res, next) => {
    try {
        for (const [key, value] of Object.entries(defaultSettings)) {
            await Settings.findOneAndUpdate(
                { key },
                { key, value },
                { upsert: true }
            );
        }

        res.json({
            success: true,
            message: 'Default settings initialized'
        });
    } catch (error) {
        next(error);
    }
};
