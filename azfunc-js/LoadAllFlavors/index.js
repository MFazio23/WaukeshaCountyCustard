const flavorService = require("../services/flavor-service");

module.exports = async function (context, req) {

    const flavorResult = await flavorService();

    context.res = {
        body: {
            success: true,
            flavorCount: flavorResult.flavorCount,
            flavors: flavorResult.flavors,
        },
        contentType: "application/json",
    };
};
