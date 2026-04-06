// middleware to protect routes that require active sessions
const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'You must be logged in to do that' });
    }

    req.user = {
        userid: req.session.userId,
        username: req.session.username,
    };

    next();
};

module.exports = requireAuth;