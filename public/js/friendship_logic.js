// تحسين منطق طلبات الصداقة باستخدام Fetch API
document.addEventListener('DOMContentLoaded', () => {
  // إرسال طلب صداقة
  const sendRequestForms = document.querySelectorAll('form[action="/friends/send-request"]');
  sendRequestForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const friendId = form.querySelector('input[name="friendId"]').value;
      
      try {
        const response = await fetch('/friends/send-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ friendId }),
          credentials: 'include'
        });
        
        const result = await response.json();
        
        if (response.ok) {
          showMessage('تم إرسال طلب الصداقة بنجاح', 'success-message');
          // تحديث واجهة المستخدم
          const button = form.querySelector('button');
          button.textContent = 'طلب مرسل';
          button.disabled = true;
          button.classList.add('pending');
        } else {
          showMessage(result.message || 'حدث خطأ أثناء إرسال طلب الصداقة', 'error-message');
        }
      } catch (error) {
        showMessage('حدث خطأ في الاتصال بالخادم', 'error-message');
      }
    });
  });
  
  // قبول طلب صداقة
  const acceptRequestForms = document.querySelectorAll('form[action^="/friends/accept-request/"]');
  acceptRequestForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const requestId = form.action.split('/').pop();
      
      try {
        const response = await fetch(`/friends/accept-request/${requestId}`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          showMessage('تم قبول طلب الصداقة بنجاح', 'success-message');
          // إزالة طلب الصداقة من القائمة
          const listItem = form.closest('li');
          if (listItem) {
            listItem.remove();
            updateFriendRequestsCount();
          }
        } else {
          showMessage('حدث خطأ أثناء قبول طلب الصداقة', 'error-message');
        }
      } catch (error) {
        showMessage('حدث خطأ في الاتصال بالخادم', 'error-message');
      }
    });
  });
  
  // رفض طلب صداقة
  const rejectRequestForms = document.querySelectorAll('form[action^="/friends/reject-request/"]');
  rejectRequestForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const requestId = form.action.split('/').pop();
      
      try {
        const response = await fetch(`/friends/reject-request/${requestId}`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          showMessage('تم رفض طلب الصداقة', 'info-message');
          // إزالة طلب الصداقة من القائمة
          const listItem = form.closest('li');
          if (listItem) {
            listItem.remove();
            updateFriendRequestsCount();
          }
        } else {
          showMessage('حدث خطأ أثناء رفض طلب الصداقة', 'error-message');
        }
      } catch (error) {
        showMessage('حدث خطأ في الاتصال بالخادم', 'error-message');
      }
    });
  });
  
  // حظر صديق
  const blockForms = document.querySelectorAll('form[action^="/friends/block/"]');
  blockForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const friendId = form.action.split('/').pop();
      
      if (confirm('هل أنت متأكد من حظر هذا المستخدم؟')) {
        try {
          const response = await fetch(`/friends/block/${friendId}`, {
            method: 'POST',
            credentials: 'include'
          });
          
          if (response.ok) {
            showMessage('تم حظر المستخدم بنجاح', 'info-message');
            // إزالة الصديق من قائمة الأصدقاء
            const listItem = form.closest('li');
            if (listItem) {
              listItem.remove();
              updateFriendsCount();
            }
          } else {
            showMessage('حدث خطأ أثناء حظر المستخدم', 'error-message');
          }
        } catch (error) {
          showMessage('حدث خطأ في الاتصال بالخادم', 'error-message');
        }
      }
    });
  });
  
  // إلغاء حظر صديق
  const unblockForms = document.querySelectorAll('form[action^="/friends/unblock/"]');
  unblockForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const friendId = form.action.split('/').pop();
      
      try {
        const response = await fetch(`/friends/unblock/${friendId}`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          showMessage('تم إلغاء حظر المستخدم بنجاح', 'success-message');
          // إزالة المستخدم من قائمة المحظورين
          const listItem = form.closest('li');
          if (listItem) {
            listItem.remove();
          }
        } else {
          showMessage('حدث خطأ أثناء إلغاء حظر المستخدم', 'error-message');
        }
      } catch (error) {
        showMessage('حدث خطأ في الاتصال بالخادم', 'error-message');
      }
    });
  });
  
  // تحديث عدد طلبات الصداقة
  function updateFriendRequestsCount() {
    const requestsList = document.getElementById('friend-requests-list');
    const countSpan = document.querySelector('.text .unread-count');
    
    if (requestsList) {
      const requestItems = requestsList.querySelectorAll('li');
      const count = requestItems.length;
      
      if (countSpan) {
        if (count > 0) {
          countSpan.textContent = count;
          countSpan.style.display = 'inline';
        } else {
          countSpan.style.display = 'none';
          // إظهار رسالة "لا توجد طلبات صداقة جديدة"
          const noRequestsMessage = document.createElement('p');
          noRequestsMessage.className = 'no-results';
          noRequestsMessage.textContent = 'لا توجد طلبات صداقة جديدة';
          requestsList.appendChild(noRequestsMessage);
        }
      }
    }
  }
  
  // تحديث عدد الأصدقاء
  function updateFriendsCount() {
    const friendsList = document.getElementById('friends-list');
    const countSpan = document.getElementById('friends-count');
    
    if (friendsList && countSpan) {
      const friendItems = friendsList.querySelectorAll('li');
      const count = friendItems.length;
      
      countSpan.textContent = `(${count})`;
      
      if (count === 0) {
        // إظهار رسالة "لا يوجد أصدقاء حاليًا"
        const noFriendsMessage = document.createElement('p');
        noFriendsMessage.className = 'no-results';
        noFriendsMessage.textContent = 'لا يوجد أصدقاء حاليًا';
        friendsList.appendChild(noFriendsMessage);
      }
    }
  }
  
  // عرض رسائل النجاح والخطأ
  function showMessage(message, className) {
    const messageContainer = document.createElement('div');
    messageContainer.className = className;
    messageContainer.textContent = message;
    
    // إضافة الرسالة في أعلى الصفحة
    const container = document.querySelector('.all');
    if (container) {
      container.prepend(messageContainer);
      
      // إزالة الرسالة بعد 3 ثوانٍ
      setTimeout(() => {
        messageContainer.remove();
      }, 3000);
    }
  }
  
  // تحديث حالة الاتصال للأصدقاء كل دقيقة
  setInterval(async () => {
    try {
      const response = await fetch('/friends/online-status', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // تحديث حالة الاتصال لكل صديق
        data.onlineFriends.forEach(friendId => {
          const friendItem = document.querySelector(`li[data-id="${friendId}"]`);
          if (friendItem) {
            const statusSpan = friendItem.querySelector('.online, .offline');
            if (statusSpan) {
              statusSpan.className = 'online';
              statusSpan.textContent = 'متصل';
            }
          }
        });
        
        data.offlineFriends.forEach(friendId => {
          const friendItem = document.querySelector(`li[data-id="${friendId}"]`);
          if (friendItem) {
            const statusSpan = friendItem.querySelector('.online, .offline');
            if (statusSpan) {
              statusSpan.className = 'offline';
              statusSpan.textContent = 'غير متصل';
            }
          }
        });
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الاتصال:', error);
    }
  }, 60000); // تحديث كل دقيقة
});
