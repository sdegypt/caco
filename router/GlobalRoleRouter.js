const express = require("express");
const router = express.Router();

// مسار /forum
router.get("/forum", (req, res) => {
  res.render("forum", {
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin,
    unreadCount: res.locals.unreadCount || 0,
    unreadMessagesCount: 0
  });
});

// مسار /admin/dashboard
router.get("/admin/dashboard", (req, res) => {
  if (!res.locals.isAdmin) {
    return res.redirect("/forum");
  }
  res.render("admin/dashboard", {
    userId: res.locals.userId,
    isAdmin: res.locals.isAdmin,
    unreadCount: res.locals.unreadCount || 0
  });
});

module.exports = router;