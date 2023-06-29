const appMaintenanceMiddleware = function (req, res, next) {
    if (process.env.MAINTENANCE_MODE === "true") {
        return res.status(503).json({
            success: false, 
            data: { 
                name: "Logora Render API", 
                status: "The render API is undergoing maintenance, please come back later.", 
                environment: process.env.TARGET_ENV, image_version: process.env.IMAGE_VERSION 
            }
        });
    } else {
        return next();
    }
}

module.exports = appMaintenanceMiddleware;