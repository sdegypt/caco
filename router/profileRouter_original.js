// إضافة مسار معالجة إجراءات الصداقة في صفحة الملف الشخصي
router.post("/profile/friend-action", verifyToken, ProfileControllers.handleFriendAction);

