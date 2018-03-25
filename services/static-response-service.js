const generalUtils = require('../utils/general-utils');

module.exports = {
    getWelcomeResponse: () => {
        return generalUtils.getRandomItemFromArray([
            "Welcome to the Waukesha County Custard assistant!  You can ask about today's flavors, for each store's hours, or where you can find a store. What would you like to know? You can always ask \"What can I say?\"",
            "Welcome to the Waukesha County Custard assistant!  How can I help you?  You can always say \"What can I say?\""
        ]);
    },
    getAboutResponse: () => {
        return generalUtils.getRandomItemFromArray([
            "The Waukesha County Custard assistant will let you know of the Flavors of the Day at various custard shops all over Waukesha County, including Brookfield, Waukesha, and other local towns.  How can I help you?",
            "The Waukesha County Custard assistant will let you know of the Flavors of the Day at various custard shops all over Waukesha County, including Brookfield, Waukesha, and other local towns.  You can also get info about each of the stores, including locations and hours.  Need help?  Just ask \"Waukesha County Custard, what can you tell me?\"",
            "You can also get info about various frozen custard shops around Waukesha County, including their flavors of the day, locations, and hours. What would you like to know?",
            "Currently, you can get information from Kopp's, Oscar's, and Murf's Frozen Custard.  Please note that none of these shops are sponsors of this app, and the app does not own any rights to any of these shops.  What can I do for you?"
        ]);
    },
    getHelpResponse: () => {
        return generalUtils.getRandomItemFromArray([
            "You can ask things like \"What flavors are available today?\", \"What was around yesterday?\", and \"What does Kopp's have next Thursday?\".  What would you like to know?",
            "You can ask things like \"What stores are in Waukesha?\", \"Where is Murf's located?\", and \"Where can I find Oscar's in Brookfield?\".  What would you like to know?"
        ]);
    },
    getUnknownResponse: () => {
        return generalUtils.getRandomItemFromArray([
            "I didn't get that. Can you say it again?",
            "I missed what you said. Say it again?",
            "Sorry, could you say that again?",
            "Sorry, can you say that again?",
            "Can you say that again?",
            "Sorry, I didn't get that.",
            "Sorry, what was that?",
            "One more time?",
            "What was that?",
            "Say that again?",
            "I didn't get that.",
            "I missed that."
        ]);
    },
    getGoodbyeResponse: () => {
        return generalUtils.getRandomItemFromArray([
            "Goodbye, and thank you for using the Waukesha County Custard assistant!",
            "Have a lovely day!",
            "Take care, and enjoy your custard!"
        ]);
    }
};