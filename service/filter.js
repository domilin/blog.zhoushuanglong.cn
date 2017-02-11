module.exports = function filter(req, res, next) {
    if (!req.session.username) {
        res.json({
            unlogin: true
        });
    } else {
        next();
    }
};