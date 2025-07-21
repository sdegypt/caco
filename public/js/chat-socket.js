// ملف واجهة الدردشة باستخدام socket.io
// يتطلب تضمين socket.io-client في الصفحة

const socket = io();

// يجب أن توفر هذه المتغيرات من السيرفر أو DOM
const userId = window.CURRENT_USER_ID; // عرّفها في الصفحة
const friendId = window.CURRENT_FRIEND_ID; // عرّفها في الصفحة

// تسجيل المستخدم عند الاتصال
socket.emit('register', userId);

// إرسال رسالة
function sendMessage(content) {
  if (!content || !userId || !friendId) return;
  socket.emit('chat:send', {
    from: userId,
    to: friendId,
    content: content.trim()
  });
}

// استقبال رسالة جديدة
socket.on('chat:receive', (msg) => {
  // تحقق أن الرسالة تخص هذه المحادثة
  if (
    (msg.from == userId && msg.to == friendId) ||
    (msg.from == friendId && msg.to == userId)
  ) {
    appendMessage(msg);
  }
});

// تحديث DOM
function appendMessage(msg) {
  const list = document.getElementById('messages-list');
  if (!list) return;
  const li = document.createElement('li');
  li.textContent = `${msg.from == userId ? 'أنا' : 'هو'}: ${msg.content}`;
  list.appendChild(li);
  // scroll للأسفل إذا كان المستخدم في الأسفل
  if (list.scrollHeight - list.scrollTop - list.clientHeight < 50) {
    list.scrollTop = list.scrollHeight;
  }
}

// إرسال الرسالة عند الضغط على زر الإرسال أو Enter
const form = document.getElementById('chat-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (input && input.value.trim()) {
      sendMessage(input.value);
      input.value = '';
    }
  });
} 