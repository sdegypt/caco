const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobControllers");
const fs = require("fs");
const { uploadJob } = require('../config/multerConfig');
const verifyToken = require("../middleware/verifyToken");

// تم حذف إعدادات multer المحلية بعد التحويل إلى Cloudinary

router.post("/jobs/add", verifyToken, uploadJob.single("logo"), JobController.addJob);
router.post("/apply-job", verifyToken, JobController.applyJob);
router.get("/jobPage/all", JobController.getAllJobs);
router.get("/applications/:jobId", verifyToken, JobController.getApplications);
router.get("/jobs", (req, res) => res.render("jobs"));
router.get("/add-job", verifyToken, (req, res) => res.render("add-job"));
router.get("/listing-job", JobController.renderAllJobs);
router.get("/jobapplications", verifyToken, JobController.renderAllApplications);
router.get("/job/:jobId", verifyToken, JobController.renderJobDetail);

module.exports = router;

