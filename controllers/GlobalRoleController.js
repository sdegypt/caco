const GlobalRoleModel = require("../models/GlobalRoleModel");

class GlobalRoleController {
  static async setGlobalRole(req, res, next) {
    const token = req.cookies.token;
    try {
      const { isAdmin, userId } = await GlobalRoleModel.checkUserRole(token);
      res.locals.isAdmin = isAdmin;
      res.locals.userId = userId;
      next();
    } catch (error) {
      res.locals.isAdmin = false;
      res.locals.userId = null;
      next();
    }
  }
}

module.exports = GlobalRoleController;