// ملف بديل لـ socket.js يوفر واجهة متوافقة مع الكود القديم
// لكن يستخدم نموذج مبسط بدلاً من socket.io

// كائن وهمي للحفاظ على توافق الواجهة البرمجية
const dummyIO = {
  to: (room) => ({
    emit: (event, data) => {
      // لا يفعل شيئًا - سيتم استبدال هذه الوظائف بـ fetch API
      console.log(`[Socket Compatibility Layer] Event ${event} to room ${room} would be emitted with:`, data);
    }
  }),
  emit: (event, data) => {
    // لا يفعل شيئًا - سيتم استبدال هذه الوظائف بـ fetch API
    console.log(`[Socket Compatibility Layer] Global event ${event} would be emitted with:`, data);
  }
};

// دالة تهيئة وهمية للحفاظ على توافق الواجهة البرمجية
const initSocket = (server) => {
  console.log("[Socket Compatibility Layer] Socket initialization bypassed - using fetch API instead");
  return dummyIO;
};

// دالة للحصول على كائن IO وهمي
const getIO = () => {
  return dummyIO;
};

module.exports = { initSocket, getIO };
