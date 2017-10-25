const storeNames = {
    "kopps": "Kopp's",
    "oscars": "Oscar's",
    "murfs": "Murf's"
};

module.exports = {
    getProperStoreName: (storeName) => {
        return storeNames[storeName];
    }
};