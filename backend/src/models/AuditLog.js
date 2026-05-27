const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({

    userId: String,

    action: String,

    ipAddress: String,

    endpoint: String,

    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    'AuditLog',
    auditLogSchema
);