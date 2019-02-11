//TODO: Shouldn't this be coming from the DB?
const storeNames = {
    "kopps": "Kopp's",
    "oscars": "Oscar's",
    "murfs": "Murf's"
};

const getProperStoreName = (storeName) => storeNames[storeName];

module.exports = {
    getProperStoreName: getProperStoreName,
    convertStoresToAssistantResponse: (stores, storeName, city) => {
        let response = `I found ${stores.locationCount} ${storeName ? getProperStoreName(storeName) : (stores.locationCount === 1 ? 'store' : 'stores')}${city ? ` in ${city}` : ''}: `;

        let storeResponses = [];
        Object.keys(stores).filter((storeKey) => storeKey !== 'locationCount').forEach((storeKey) => {
            const store = stores[storeKey];
            Object.keys(store.locations).forEach((locationKey) => {
                let storeResponse = '';
                const location = store.locations[locationKey];
                if(storeName && city) storeResponse += `It`;
                else if (storeName) storeResponse += `The ${location.city} store`;
                else if (city) storeResponse += `${store.shortName}`;
                else storeResponse += `${store.shortName} in ${location.city}`;
                storeResponse += ` is located at ${location.address}`;
                storeResponses.push(storeResponse);
            });
        });

        response += storeResponses.join("; ");

        return `${response}.`;
    },
    convertStoreHoursToAssistantResponse: (stores, storeName, city) => {
        let response = '';
        if(stores.locationCount === 1) {
            const currentStoreName = Object.keys(stores)[0];
            const currentCityName = Object.keys(stores[currentStoreName].locations)[0];
            const currentLocation = stores[currentStoreName].locations[currentCityName];
            const hours = currentLocation.hours;

            response = `The ${getProperStoreName(storeName)} in ${city} opens at ${hours.open} and closes at ${hours.close}`;
        } else {
            response = `I found ${stores.locationCount} ${storeName ? getProperStoreName(storeName) : 'stores'}${city ? ` in ${city}` : ''}: `;

            let storeResponses = [];
            Object.keys(stores).filter((storeKey) => storeKey !== 'locationCount').forEach((storeKey) => {
                const store = stores[storeKey];
                Object.keys(store.locations).forEach((locationKey) => {
                    let storeResponse = '';
                    const location = store.locations[locationKey];
                    if (storeName && city) storeResponse += `It`;
                    else if (storeName) storeResponse += `The ${location.city} store`;
                    else if (city) storeResponse += `${store.shortName}`;
                    else storeResponse += `${store.shortName} in ${location.city}`;
                    storeResponse += ` opens at ${location.hours.open} and closes at ${location.hours.close}`;
                    storeResponses.push(storeResponse);
                });
            });

            response += storeResponses.join("; ");
        }

        return `${response}.`;
    }
};