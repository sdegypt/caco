const StoreModel = require("../models/StoreModel");

class AdminStoreController {
  /**
   * عرض صفحة إدارة طلبات المتاجر
   */
  static async showStoreRequestsPage(req, res) {
    try {
      const { status } = req.query;
      const requests = await StoreModel.getStoreRequestsByStatus(status);

      res.render('admin/store-requests', {
        title: 'إدارة طلبات المتاجر',
        requests: requests,
        status: status,
        user: req.user
      });

    } catch (error) {
      console.error("خطأ في عرض صفحة طلبات المتاجر:", error);
      res.status(500).render('error', {
        message: "حدث خطأ في جلب طلبات المتاجر"
      });
    }
  }

  /**
   * معالجة طلب متجر (موافقة/رفض)
   */
  static async processStoreRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { action, adminNotes } = req.body;
      const adminId = req.user.id;

      // التحقق من صحة العملية
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "عملية غير صحيحة"
        });
      }

      // الحصول على تفاصيل الطلب
      const request = await StoreModel.getStoreRequestById(requestId);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: "الطلب غير موجود"
        });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: "تم معالجة هذا الطلب مسبقاً"
        });
      }

      const status = action === 'approve' ? 'approved' : 'rejected';

      // تحديث حالة الطلب
      await StoreModel.updateStoreRequestStatus(requestId, status, adminId, adminNotes);

      // إذا تمت الموافقة، إنشاء المتجر
      if (action === 'approve') {
        await StoreModel.createStore(
          request.user_id,
          request.store_name,
          request.store_description
        );
      }

      res.json({
        success: true,
        message: action === 'approve' ? "تمت الموافقة على المتجر وتم إنشاؤه بنجاح" : "تم رفض الطلب"
      });

    } catch (error) {
      console.error("خطأ في معالجة طلب المتجر:", error, error && error.stack);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم",
        error: error && error.message
      });
    }
  }

  /**
   * الحصول على إحصائيات النظام
   */
  static async getSystemStats(req, res) {
    try {
      const stats = await StoreModel.getSystemStats();

      res.json({
        success: true,
        stats: stats
      });

    } catch (error) {
      console.error("خطأ في جلب إحصائيات النظام:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * عرض جميع المتاجر للأدمن
   */
  static async showAllStores(req, res) {
    try {
      const stores = await StoreModel.getAllApprovedStores();

      res.render('admin/stores-management', {
        title: 'إدارة المتاجر',
        stores: stores,
        user: req.user
      });

    } catch (error) {
      console.error("خطأ في عرض المتاجر:", error);
      res.status(500).render('error', {
        message: "حدث خطأ في جلب المتاجر"
      });
    }
  }

  /**
   * حذف متجر (للأدمن فقط)
   */
  static async deleteStore(req, res) {
    try {
      const { storeId } = req.params;

      // التحقق من وجود المتجر
      const store = await StoreModel.getStoreById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "المتجر غير موجود"
        });
      }

      // حذف المتجر
      await StoreModel.deleteStore(storeId);

      res.json({
        success: true,
        message: "تم حذف المتجر بنجاح"
      });

    } catch (error) {
      console.error("خطأ في حذف المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }

  /**
   * تعليق/إلغاء تعليق متجر
   */
  static async toggleStoreStatus(req, res) {
    try {
      const { storeId } = req.params;

      // التحقق من وجود المتجر
      const store = await StoreModel.getStoreById(storeId);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "المتجر غير موجود"
        });
      }

      // تغيير حالة المتجر
      const newStatus = store.status === 'approved' ? 'suspended' : 'approved';
      await StoreModel.updateStoreStatus(storeId, newStatus);

      res.json({
        success: true,
        message: newStatus === 'approved' ? "تم تفعيل المتجر" : "تم تعليق المتجر"
      });

    } catch (error) {
      console.error("خطأ في تغيير حالة المتجر:", error);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم"
      });
    }
  }
}

module.exports = AdminStoreController;

