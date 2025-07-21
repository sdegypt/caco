const SupportModel = require("../models/SupportModel");

class SupportController {
  // Middleware للتحقق من دور المستخدم وتمرير isAdmin
  static async checkSupportAccess(req, res, next) {
    const token = req.cookies.token;
    try {
      const role = await SupportModel.getUserRole(token);
      res.locals.isAdmin = role === 'admin';
      res.locals.userId = token ? jwt.verify(token, "your_jwt_secret").id : null;
    } catch (error) {
      res.locals.isAdmin = false;
      res.locals.userId = null;
    }
    next();
  }
}

module.exports = SupportController;