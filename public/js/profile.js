document.addEventListener('DOMContentLoaded', function() {
    const friendActionButton = document.getElementById('friend-action-button');
    const likeButton = document.getElementById('likeButton');
    const feedbackContainer = document.getElementById('feedback-message-profile');

    // تحديث حالة زر الصداقة
    function updateFriendButton(status) {
        if (!friendActionButton) return;
        console.log('تحديث حالة الزر إلى:', status);

        const buttonIcon = friendActionButton.querySelector('.button-icon i');
        const buttonText = friendActionButton.querySelector('.button-text');

        buttonIcon.className = ''; // إزالة جميع الأيقونات
        
        switch(status) {
            case 'accepted':
                console.log('تحديث الزر لحالة: صديق');
                buttonIcon.className = 'fas fa-user-minus';
                buttonText.textContent = 'إلغاء الصداقة';
                friendActionButton.classList.remove('pending', 'add');
                friendActionButton.classList.add('remove');
                break;
            case 'pending':
                console.log('تحديث الزر لحالة: قيد الانتظار');
                buttonIcon.className = 'fas fa-user-clock';
                buttonText.textContent = 'إلغاء الطلب';
                friendActionButton.classList.remove('remove', 'add');
                friendActionButton.classList.add('pending');
                break;
            case 'no_friend':
            default:
                console.log('تحديث الزر لحالة: غير صديق');
                buttonIcon.className = 'fas fa-user-plus';
                buttonText.textContent = 'إضافة صديق';
                friendActionButton.classList.remove('pending', 'remove');
                friendActionButton.classList.add('add');
                break;
        }

        friendActionButton.dataset.status = status;
        console.log('تم تحديث dataset.status إلى:', status);
    }

    // عرض رسالة التنبيه
    function showFeedback(message, type = 'success') {
        if (!feedbackContainer) return;
        console.log('عرض رسالة:', message, 'النوع:', type);

        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${type}`;
        feedbackDiv.textContent = message;

        feedbackContainer.appendChild(feedbackDiv);
        setTimeout(() => feedbackDiv.remove(), 3000);
    }

    // معالجة نقر زر الصداقة
    if (friendActionButton) {
        const initialStatus = friendActionButton.dataset.initialStatus || 'no_friend';
        console.log('الحالة الأولية للزر:', initialStatus);
        updateFriendButton(initialStatus);

        friendActionButton.addEventListener('click', async function() {
            const friendId = this.dataset.friendId;
            const currentStatus = this.dataset.status;
            console.log('تم النقر على زر الصداقة:', { friendId, currentStatus });
            
            try {
                let endpoint = '/friends/handle-action';
                let action;
                
                switch(currentStatus) {
                    case 'accepted':
                        if (!confirm('هل أنت متأكد من رغبتك في إلغاء الصداقة؟')) {
                            console.log('تم إلغاء عملية إزالة الصداقة من قبل المستخدم');
                            return;
                        }
                        action = 'remove_friend';
                        break;
                    case 'pending':
                        action = 'cancel_request';
                        break;
                    case 'no_friend':
                    default:
                        action = 'send_request';
                        break;
                }

                console.log('إرسال طلب:', { endpoint, action, friendId });

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        friendId: friendId,
                        action: action 
                    }),
                    credentials: 'include'
                });

                console.log('استجابة الخادم الأولية:', response.status, response.statusText);
                const data = await response.json();
                console.log('بيانات الاستجابة:', data);

                if (data.success) {
                    console.log('تم تنفيذ الإجراء بنجاح، تحديث الحالة إلى:', data.friendStatus);
                    updateFriendButton(data.friendStatus);
                    showFeedback(data.message, 'success');
                } else {
                    console.log('فشل تنفيذ الإجراء:', data.message);
                    showFeedback(data.message, 'error');
                }
            } catch (error) {
                console.error('خطأ في تنفيذ الإجراء:', error);
                showFeedback('حدث خطأ في الشبكة أو الخادم', 'error');
            }
        });
    }

    // معالجة نقر زر الإعجاب
    if (likeButton) {
        likeButton.addEventListener('click', async function() {
            const userId = this.dataset.userId;
            console.log('تم النقر على زر الإعجاب:', userId);
            
            try {
                const response = await fetch('/friends/toggle-like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ friendId: userId }),
                    credentials: 'include'
                });

                const data = await response.json();
                console.log('استجابة الإعجاب:', data);

                if (data.success) {
                    const likeIcon = this.querySelector('.button-icon i');
                    const likeText = this.querySelector('.button-text');
                    const likeCount = document.getElementById('like-count');
                    const rankingCount = document.getElementById('ranking-count');

                    this.classList.toggle('liked');
                    likeIcon.className = this.classList.contains('liked') ? 'fas fa-heart-crack' : 'fas fa-heart';
                    likeText.textContent = this.classList.contains('liked') ? 'إلغاء الإعجاب' : 'إعجاب';
                    
                    if (likeCount) likeCount.textContent = data.likes;
                    if (rankingCount) rankingCount.textContent = data.ranking;
                    
                    showFeedback(data.liked ? 'تم الإعجاب بنجاح' : 'تم إلغاء الإعجاب', 'success');
                } else {
                    showFeedback(data.message, 'error');
                }
            } catch (error) {
                console.error('خطأ في تنفيذ الإعجاب:', error);
                showFeedback('حدث خطأ في الشبكة أو الخادم', 'error');
            }
        });
    }
}); 