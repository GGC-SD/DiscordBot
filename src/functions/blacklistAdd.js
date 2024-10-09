const blacklistSchema = require('../models/blacklistSchema');

async function insertBlacklistDB(userId, role) {
    const userIdString = userId.toString();
    const doc = await blacklistSchema.blackListDB.findOne();
    let duration = getDurationByRole(role);  // Set duration based on the role

    if (doc) {
        // Update the document by adding a new user to the blacklist
        await blacklistSchema.blackListDB.updateOne(
            { $addToSet: { blackListedUsers: { userId: userIdString, role: role, duration: duration } } }
        );
        console.log(`User ${userIdString} with role ${role} has been blacklisted for ${duration} days.`);
    } else {
        // Create a new document if it doesn't exist
        await blacklistSchema.blackListDB.create({
            blackListedUsers: [{ userId: userIdString, role: role, duration: duration }]
        });
        console.log(`New blacklist created with user ${userIdString} for ${duration} days.`);
    }
}

// Helper function to determine kick duration based on role
function getDurationByRole(role) {
    switch(role) {
        case 'VIP':
            return 30;  // VIPs get 30 days
        case 'Moderator':
            return 60;  // Moderators get 60 days
        default:
            return 7;  // Default duration is 7 days
    }
}

module.exports = {
    insertBlacklistDB
};rtBlacklistDB
