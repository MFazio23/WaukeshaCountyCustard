module.exports = async function (context, loadAllFlavorsTimer) {
    var timeStamp = new Date().toISOString();

    if (loadAllFlavorsTimer.isPastDue) {
        context.log('JavaScript is running late!');
    }

    const flavorResult = await flavorService();

    context.res = {
        body: {
            success: true,
            flavorCount: flavorResult.flavorCount,
            flavors: flavorResult.flavors,
        },
        contentType: "application/json",
    };

    context.log('JavaScript timer trigger function ran!', timeStamp);
};