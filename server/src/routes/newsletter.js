const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const Blog = require('../models/Blog');
const { Resend } = require('resend');

// Initialize Resend with API key from env
const resend = new Resend(process.env.RESEND_API_KEY);

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Check if already subscribed
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            if (!subscriber.isActive) {
                subscriber.isActive = true;
                await subscriber.save();
                return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
            }
            return res.status(400).json({ success: false, message: 'Email is already subscribed' });
        }

        subscriber = new Subscriber({ email });
        await subscriber.save();

        // Optional: Send welcome email
        try {
            await resend.emails.send({
                from: 'Mars Care <newsletter@marscarefoundation.org>', // Make sure to verify this domain in Resend
                to: email,
                subject: 'Welcome to Mars Care Foundation Community',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Welcome to the Family!</h1>
                        <p>Thank you for subscribing to the Mars Care Foundation newsletter.</p>
                        <p>You will now receive updates about our latest missions, success stories, and impact reports.</p>
                        <br/>
                        <p>Warm regards,</p>
                        <p>The Mars Care Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the request if email sending fails, just log it
        }

        res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
    } catch (error) {
        console.error('Newsletter Subscription Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/newsletter/send
// @desc    Send blog post to all subscribers
// @access  Admin (Protected)
// Note: Middleware for auth should be added in index.js or here if needed. Assuming global auth or trusted caller for now based on context.
router.post('/send', async (req, res) => {
    try {
        const { blogId } = req.body;

        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Blog ID is required' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Get all active subscribers
        const subscribers = await Subscriber.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.status(400).json({ success: false, message: 'No active subscribers found' });
        }

        // Send emails (Batching might be needed for large lists, keeping it simple for now)
        const emailPromises = subscribers.map(sub => {
            return resend.emails.send({
                from: 'Mars Care <newsletter@marscarefoundation.org>',
                to: sub.email,
                subject: `New Story: ${blog.title}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <img src="${blog.featuredImage?.url}" alt="${blog.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;" />
                        <h1>${blog.title}</h1>
                        <p>${blog.excerpt}</p>
                        <br/>
                        <a href="${process.env.CLIENT_URL || 'https://marscarefoundation.vercel.app'}/gallery" style="background-color: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Full Story</a>
                        <br/><br/>
                        <hr/>
                        <p style="font-size: 12px; color: #666;">You are receiving this because you subscribed to Mars Care Foundation newsletter. <a href="${process.env.CLIENT_URL}/unsubscribe?email=${sub.email}">Unsubscribe</a></p>
                    </div>
                `
            });
        });

        await Promise.allSettled(emailPromises);

        res.status(200).json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers` });

    } catch (error) {
        console.error('Newsletter Send Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send newsletter' });
    }
});

module.exports = router;
