const blacklistSchema = require("../models/blacklistSchema");
const { channelMention, roleMention, userMention } = require('discord.js');


async function removeBlacklistDB(userid, userTag){
    const userIdString = userid.toString();
    const mentionedUser = userMention(userid);
    const doc = await blacklistSchema.blackListDB.findOne();
    const exist = await blacklistSchema.blackListDB.findOne({blackListedUsers: userIdString});
    const mention = "insert method";
    if(doc){
        if(exist){
            await blacklistSchema.blackListDB.updateOne({$pull: {blackListedUsers: userIdString}});
            console.log(`User ${userTag} has been removed from the Blacklist.`);
            const resultMessage = (`User ${mentionedUser.toString()} has been removed from the Blacklist.`);
            return resultMessage;
        }
        else{
            console.log(`User ${userIdString} is not in the Blacklist`);
            const resultMessage = (`User ${mentionedUser.toString()} is not in the Blacklist`);
            return resultMessage;
        }
    }
    else{
        const resultMessage = ("Blacklist does not exist");
        console.log(resultMessage);
        return resultMessage;
    }
}

module.exports = {
    removeBlacklistDB
} 