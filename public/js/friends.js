// ملف JavaScript لإدارة منطق الأصدقاء باستخدام fetch API

class FriendsManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUnreadCount();
    }

    // ربط الأحداث
    bindEvents() {
        // أزرار إرسال طلب صداقة
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('send-friend-request') || e.target.closest('.send-friend-request')) {
                e.preventDefault();
                const button = e.target.classList.contains('send-friend-request') ? e.target : e.target.closest('.send-friend-request');
                const friendId = button.dataset.friendId;
                this.sendFriendRequest(friendId, button);
            }
        });

        // أزرار قبول طلب صداقة
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept-friend-request') || e.target.closest('.accept-friend-request')) {
                e.preventDefault();
                const button = e.target.classList.contains('accept-friend-request') ? e.target : e.target.closest('.accept-friend-request');
                const requestId = button.dataset.requestId;
                this.acceptFriendRequest(requestId, button);
            }
        });

        // أزرار رفض طلب صداقة
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reject-friend-request') || e.target.closest('.reject-friend-request')) {
                e.preventDefault();
                const button = e.target.classList.contains('reject-friend-request') ? e.target : e.target.closest('.reject-friend-request');
                const requestId = button.dataset.requestId;
                this.rejectFriendRequest(requestId, button);
            }
        });

        // أزرار إلغاء طلب صداقة
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-friend-request') || e.target.closest('.cancel-friend-request')) {
                e.preventDefault();
                const button = e.target.classList.contains('cancel-friend-request') ? e.target : e.target.closest('.cancel-friend-request');
                const friendId = button.dataset.friendId;
                this.cancelFriendRequest(friendId, button);
            }
        });

        // أزرار حظر مستخدم
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('block-user') || e.target.closest('.block-user')) {
                e.preventDefault();
                const button = e.target.classList.contains('block-user') ? e.target : e.target.closest('.block-user');
                const friendId = button.dataset.friendId;
                this.blockUser(friendId, button);
            }
        });

        // أزرار إلغاء حظر مستخدم
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('unblock-user') || e.target.closest('.unblock-user')) {
                e.preventDefault();
                const button = e.target.classList.contains('unblock-user') ? e.target : e.target.closest('.unblock-user');
                const friendId = button.dataset.friendId;
                this.unblockUser(friendId, button);
            }
        });

        // أزرار إزالة صديق
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-friend') || e.target.closest('.remove-friend')) {
                e.preventDefault();
                const button = e.target.classList.contains('remove-friend') ? e.target : e.target.closest('.remove-friend');
                const friendId = button.dataset.friendId;
                this.removeFriend(friendId, button);
            }
        });
    }

    // إرسال طلب صداقة
    async sendFriendRequest(friendId, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/send-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: parseInt(friendId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.updateButtonState(button, 'request_sent', friendId);
                this.updateUnreadCount();
            } else {
                this.showMessage(data.message, 'error');
                this.setButtonLoading(button, false);
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            this.showMessage('حدث خطأ أثناء إرسال طلب الصداقة', 'error');
            this.setButtonLoading(button, false);
        }
    }

    // قبول طلب صداقة
    async acceptFriendRequest(requestId, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/accept-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: parseInt(requestId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.removeRequestFromList(requestId);
                this.updateUnreadCount();
                // إعادة تحميل الصفحة لتحديث قوائم الأصدقاء
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
                this.setButtonLoading(button, false);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            this.showMessage('حدث خطأ أثناء قبول طلب الصداقة', 'error');
            this.setButtonLoading(button, false);
        }
    }

    // رفض طلب صداقة
    async rejectFriendRequest(requestId, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/reject-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId: parseInt(requestId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.removeRequestFromList(requestId);
                this.updateUnreadCount();
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            this.showMessage('حدث خطأ أثناء رفض طلب الصداقة', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // إلغاء طلب صداقة
    async cancelFriendRequest(friendId, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/cancel-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: parseInt(friendId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.updateButtonState(button, 'not_friend', friendId);
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            console.error('Error canceling friend request:', error);
            this.showMessage('حدث خطأ أثناء إلغاء طلب الصداقة', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // حظر مستخدم
    async blockUser(friendId, button) {
        if (!confirm('هل أنت متأكد من أنك تريد حظر هذا المستخدم؟')) {
            return;
        }

        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: parseInt(friendId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.updateButtonState(button, 'blocked', friendId);
                // إعادة تحميل الصفحة لتحديث القوائم
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
                this.setButtonLoading(button, false);
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            this.showMessage('حدث خطأ أثناء حظر المستخدم', 'error');
            this.setButtonLoading(button, false);
        }
    }

    // إلغاء حظر مستخدم
    async unblockUser(friendId, button) {
        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/unblock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: parseInt(friendId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.updateButtonState(button, 'not_friend', friendId);
                // إعادة تحميل الصفحة لتحديث القوائم
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
                this.setButtonLoading(button, false);
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            this.showMessage('حدث خطأ أثناء إلغاء حظر المستخدم', 'error');
            this.setButtonLoading(button, false);
        }
    }

    // إزالة صديق
    async removeFriend(friendId, button) {
        if (!confirm('هل أنت متأكد من أنك تريد إزالة هذا الصديق؟')) {
            return;
        }

        try {
            this.setButtonLoading(button, true);
            
            const response = await fetch('/friends/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: parseInt(friendId) })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage(data.message, 'success');
                this.updateButtonState(button, 'not_friend', friendId);
                // إعادة تحميل الصفحة لتحديث القوائم
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(data.message, 'error');
                this.setButtonLoading(button, false);
            }
        } catch (error) {
            console.error('Error removing friend:', error);
            this.showMessage('حدث خطأ أثناء إزالة الصديق', 'error');
            this.setButtonLoading(button, false);
        }
    }

    // تحديث حالة الزر
    updateButtonState(button, status, friendId) {
        const container = button.closest('.user-actions') || button.parentElement;
        
        // إزالة جميع الأزرار الحالية
        container.innerHTML = '';
        
        // إضافة الأزرار المناسبة حسب الحالة
        switch (status) {
            case 'not_friend':
                container.innerHTML = `
                    <button class="btn btn-primary send-friend-request" data-friend-id="${friendId}">
                        <i class="fas fa-user-plus"></i> إرسال طلب
                    </button>
                    <button class="btn btn-danger block-user" data-friend-id="${friendId}">
                        <i class="fas fa-ban"></i> حظر
                    </button>
                `;
                break;
            case 'request_sent':
                container.innerHTML = `
                    <button class="btn btn-warning cancel-friend-request" data-friend-id="${friendId}">
                        <i class="fas fa-times"></i> إلغاء الطلب
                    </button>
                    <button class="btn btn-danger block-user" data-friend-id="${friendId}">
                        <i class="fas fa-ban"></i> حظر
                    </button>
                `;
                break;
            case 'friend':
                container.innerHTML = `
                    <a href="/chat/${friendId}" class="btn btn-primary">
                        <i class="fas fa-comment"></i> مراسلة
                    </a>
                    <button class="btn btn-warning remove-friend" data-friend-id="${friendId}">
                        <i class="fas fa-user-minus"></i> إزالة
                    </button>
                    <button class="btn btn-danger block-user" data-friend-id="${friendId}">
                        <i class="fas fa-ban"></i> حظر
                    </button>
                `;
                break;
            case 'blocked':
                container.innerHTML = `
                    <button class="btn btn-secondary unblock-user" data-friend-id="${friendId}">
                        <i class="fas fa-unlock"></i> إلغاء الحظر
                    </button>
                `;
                break;
        }
    }

    // إزالة طلب من القائمة
    removeRequestFromList(requestId) {
        const requestElement = document.querySelector(`[data-request-id="${requestId}"]`)?.closest('.friend-request-item');
        if (requestElement) {
            requestElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            requestElement.style.opacity = '0';
            requestElement.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                requestElement.remove();
                this.updateRequestsTabCount();
            }, 300);
        }
    }

    // تحديث عدد طلبات الصداقة في التبويب
    updateRequestsTabCount() {
        const requestsTab = document.querySelector('#requests-tab');
        const requestItems = document.querySelectorAll('.friend-request-item');
        const count = requestItems.length;
        
        if (requestsTab) {
            const badge = requestsTab.querySelector('.badge-notification');
            if (count > 0) {
                if (badge) {
                    badge.textContent = count;
                } else {
                    const newBadge = document.createElement('span');
                    newBadge.className = 'badge-notification unread-requests-count';
                    newBadge.textContent = count;
                    requestsTab.appendChild(newBadge);
                }
            } else {
                if (badge) {
                    badge.remove();
                }
            }
        }
    }

    // تعيين حالة التحميل للزر
    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            const originalContent = button.innerHTML;
            button.dataset.originalContent = originalContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        } else {
            button.disabled = false;
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                delete button.dataset.originalContent;
            }
        }
    }

    // عرض رسالة
    showMessage(message, type = 'info') {
        // إزالة الرسائل السابقة
        const existingMessages = document.querySelectorAll('.alert-message');
        existingMessages.forEach(msg => msg.remove());

        // إنشاء رسالة جديدة
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show alert-message`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        alertDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // إزالة الرسالة تلقائياً بعد 5 ثوان
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // تحديث عدد الإشعارات غير المقروءة
    updateUnreadCount() {
        // يمكن إضافة منطق لتحديث عدد الإشعارات غير المقروءة هنا
        // إذا كان هناك عنصر في الصفحة يعرض هذا العدد
    }
}

// تهيئة مدير الأصدقاء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    new FriendsManager();
    
    // إضافة تأثيرات بصرية إضافية
    const userCards = document.querySelectorAll('.user-card');
    userCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // تحسين تجربة التبويبات
    const tabButtons = document.querySelectorAll('.nav-link');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إضافة تأثير انتقال سلس
            const targetPane = document.querySelector(this.dataset.bsTarget);
            if (targetPane) {
                targetPane.style.opacity = '0';
                setTimeout(() => {
                    targetPane.style.opacity = '1';
                }, 150);
            }
        });
    });
});

