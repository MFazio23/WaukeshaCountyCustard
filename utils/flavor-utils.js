const moment = require('moment-timezone'),
      StoreUtils = require("../utils/store-utils");

getDateName = (date) => {
    if(!date) return "Today";
    return moment(date).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[On] dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: '[On] MMMM Do'
    });
};

module.exports = {
    convertFlavorsToDialogflowResponse: (flavors, date) => {
        let response = `${getDateName(date)}, `;
        const flavorKeys = Object.keys(flavors);
        flavorKeys.forEach((store, ind) => {
            response += `${StoreUtils.getProperStoreName(store)} ${moment(date).isBefore(moment(), 'day') ? 'had' : 'has'} `;
            response += flavors[store].map((flavor) => flavor.flavorName).join(" and ");

            if(flavorKeys.length > 1 && flavorKeys.length - 2 >= ind) {
                response += ", ";
                if(flavorKeys.length - 2 === ind) response += "and ";
            }
        });
        return `${response}.`;
    }
};