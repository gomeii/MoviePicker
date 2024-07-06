
exports.healthCheck = async (req,res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).send('OK');
    } else {
        res.status(503).send('Service Unavailable');
    }
};
