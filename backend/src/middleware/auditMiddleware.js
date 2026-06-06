const AuditLog = require('../models/AuditLog');

module.exports = async (req, res, next) => {

    await AuditLog.create({
        userId: req.user?.id || 'guest',
        action: req.method,
        ipAddress: req.ip,
        endpoint: req.originalUrl
    });

    next();
};