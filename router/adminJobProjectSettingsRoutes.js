const express = require("express");
const AdminJobProjectSettingsController = require("../controllers/AdminJobProjectSettingsController");
const router = express.Router();

router.get("/job-project-settings", AdminJobProjectSettingsController.showJobProjectSettings);
router.post("/job-project-settings", AdminJobProjectSettingsController.updateJobProjectSettings);
router.post("/job-project-settings/add-exception", AdminJobProjectSettingsController.addException);
router.post("/job-project-settings/remove-exception", AdminJobProjectSettingsController.removeException);
router.post("/job-project-settings/update-exception", AdminJobProjectSettingsController.updateException);

module.exports = router;