const NotificationModel = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");

class AdminRolesPermissionsController {
  static async showRolesPermissions(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const roles = await NotificationModel.getAllRoles();
      const permissions = await NotificationModel.getAllPermissions();
      const admins = await NotificationModel.getAdmins();

      const adminsWithDetails = await Promise.all(admins.map(async (admin) => {
        const userPermissions = admin.role_id ? await NotificationModel.getUserPermissions(admin.role_id) : [];
        return {
          ...admin,
          permissions: userPermissions
        };
      }));

      res.render("admin/roles-permissions", {
        roles,
        permissions,
        admins: adminsWithDetails,
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: null,
        successMessage: null
      });
    } catch (error) {
      logger.error("خطأ في عرض صفحة الأدوار والصلاحيات:", error);
      res.render("admin/roles-permissions", {
        roles: [],
        permissions: [],
        admins: [],
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: "حدث خطأ أثناء جلب البيانات",
        successMessage: null
      });
    }
  }

  static async addRole(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const { name, title, description } = req.body;
      if (!name || !title) {
        throw new Error("اسم الدور واللقب مطلوبان");
      }

      await NotificationModel.addRole(name, title, description);

      const roles = await NotificationModel.getAllRoles();
      const permissions = await NotificationModel.getAllPermissions();
      const admins = await NotificationModel.getAdmins();
      const adminsWithDetails = await Promise.all(admins.map(async (admin) => {
        const userPermissions = admin.role_id ? await NotificationModel.getUserPermissions(admin.role_id) : [];
        return { ...admin, permissions: userPermissions };
      }));

      res.render("admin/roles-permissions", {
        roles,
        permissions,
        admins: adminsWithDetails,
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: null,
        successMessage: "تم إضافة الدور بنجاح"
      });
    } catch (error) {
      logger.error("خطأ في إضافة الدور:", error);
      res.render("admin/roles-permissions", {
        roles: await NotificationModel.getAllRoles(),
        permissions: await NotificationModel.getAllPermissions(),
        admins: await NotificationModel.getAdmins(),
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: error.message || "حدث خطأ أثناء إضافة الدور",
        successMessage: null
      });
    }
  }

  static async addPermission(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const { roleId, permission, can_edit_users } = req.body;
      if (!roleId || !permission) {
        throw new Error("معرف الدور واسم الصلاحية مطلوبان");
      }

      await NotificationModel.addPermission(roleId, permission, can_edit_users);

      const roles = await NotificationModel.getAllRoles();
      const permissions = await NotificationModel.getAllPermissions();
      const admins = await NotificationModel.getAdmins();
      const adminsWithDetails = await Promise.all(admins.map(async (admin) => {
        const userPermissions = admin.role_id ? await NotificationModel.getUserPermissions(admin.role_id) : [];
        return { ...admin, permissions: userPermissions };
      }));

      res.render("admin/roles-permissions", {
        roles,
        permissions,
        admins: adminsWithDetails,
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: null,
        successMessage: "تم إضافة الصلاحية بنجاح"
      });
    } catch (error) {
      logger.error("خطأ في إضافة الصلاحية:", error);
      res.render("admin/roles-permissions", {
        roles: await NotificationModel.getAllRoles(),
        permissions: await NotificationModel.getAllPermissions(),
        admins: await NotificationModel.getAdmins(),
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: error.message || "حدث خطأ أثناء إضافة الصلاحية",
        successMessage: null
      });
    }
  }

  static async updateRolesPermissions(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const decoded = jwt.verify(token, "your_jwt_secret");
      const userId = decoded.id;

      const user = await NotificationModel.getUserById(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).send("غير مصرح لك");
      }

      const { adminId, roleId } = req.body;

      if (!adminId || !roleId) throw new Error("معرف الأدمن ومعرف الدور مطلوبان");

      await NotificationModel.assignRoleToUser(adminId, roleId);

      const roles = await NotificationModel.getAllRoles();
      const permissions = await NotificationModel.getAllPermissions();
      const admins = await NotificationModel.getAdmins();
      const adminsWithDetails = await Promise.all(admins.map(async (admin) => {
        const userPermissions = admin.role_id ? await NotificationModel.getUserPermissions(admin.role_id) : [];
        return { ...admin, permissions: userPermissions };
      }));

      res.render("admin/roles-permissions", {
        roles,
        permissions,
        admins: adminsWithDetails,
        selectedRoleId: parseInt(roleId),
        selectedPermissions: [],
        errorMessage: null,
        successMessage: "تم تحديث دور الأدمن بنجاح"
      });
    } catch (error) {
      logger.error("خطأ في تحديث الأدوار والصلاحيات:", error);
      res.render("admin/roles-permissions", {
        roles: await NotificationModel.getAllRoles(),
        permissions: await NotificationModel.getAllPermissions(),
        admins: await NotificationModel.getAdmins(),
        selectedRoleId: null,
        selectedPermissions: [],
        errorMessage: error.message || "حدث خطأ أثناء التحديث",
        successMessage: null
      });
    }
  }
}

module.exports = AdminRolesPermissionsController;