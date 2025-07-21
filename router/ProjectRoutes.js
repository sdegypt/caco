const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");
const MessagesProjectController = require("../controllers/MessagesProjectController");
const verifyToken = require("../middleware/verifyToken");

// عرض صفحة إنشاء المشروع
router.get("/create", verifyToken, ProjectController.getCreateProject);

// مسار إنشاء المشروع
router.post("/create", verifyToken, ProjectController.postCreateProject);

// مسار عرض قائمة المشاريع
router.get("/", ProjectController.getAllProjects);

// مسار تفاصيل المشروع
router.get("/project/:id", ProjectController.getProjectDetails);

// مسار إرسال طلب الانضمام
router.post("/apply-project", verifyToken, ProjectController.postApplyProject);

// مسار عرض طلبات المشروع
router.get("/project_requests", verifyToken, ProjectController.getProjectRequests);

// مسار قبول الطلب
router.post("/accept-request/:requestId", verifyToken, ProjectController.acceptRequest);

// مسار رفض الطلب
router.post("/reject-request/:requestId", verifyToken, ProjectController.rejectRequest);

// مسار تحديث حالة الطلب
router.post("/update-request/:requestId", verifyToken, ProjectController.updateRequestStatus);

// مسار المحادثات الجارية
router.get("/ongoing_chats", verifyToken, MessagesProjectController.getOngoingChats);

module.exports = router;