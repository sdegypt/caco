    const userId = "<%= locals.userId || '' %>";
    const friendRequestsList = document.getElementById("friend-requests-list");
    const friendsList = document.getElementById("friends-list");
    const blockedFriendsList = document.getElementById("blocked-friends-list");
    const friendsCountElement = document.getElementById("friends-count");
    const unreadFriendRequestsCountElement = document.querySelector(".left .text .unread-count"); // More specific selector

    let lastFriendUpdateTimestamp = 0; // For polling friend list changes
    let lastRequestUpdateTimestamp = 0; // For polling friend request changes

    // --- Helper Functions ---
    function displayMessage(message, type = "success") {
        const container = document.querySelector(".notifications-container");
        if (!container) return;

        const notificationDiv = document.createElement("div");
        notificationDiv.className = `message-${type} notification-fade`;
        
        const messageSpan = document.createElement("span");
        messageSpan.textContent = message;
        
        const closeButton = document.createElement("button");
        closeButton.className = "close-notification";
        closeButton.innerHTML = "&times;";
        closeButton.onclick = () => notificationDiv.remove();
        
        notificationDiv.appendChild(messageSpan);
        notificationDiv.appendChild(closeButton);
        container.appendChild(notificationDiv);

        // إزالة التنبيه تلقائياً بعد 4 ثواني
        setTimeout(() => {
            if (notificationDiv.parentElement) {
                notificationDiv.remove();
            }
        }, 4000);
    }

    function updateElementText(element, text) {
        if (element) element.textContent = text;
    }

    function updateFriendsCount(count) {
        if (friendsCountElement) friendsCountElement.textContent = `(${count})`;
    }

    function updateUnreadRequestsCount(count) {
        if (unreadFriendRequestsCountElement) {
            if (count > 0) {
                unreadFriendRequestsCountElement.textContent = count;
                unreadFriendRequestsCountElement.style.display = "inline"; // Make sure it's visible
            } else {
                unreadFriendRequestsCountElement.style.display = "none"; // Hide if zero
            }
        } else if (count > 0) {
            const textElement = document.querySelector(".left .text"); // The parent text element
            if (textElement) {
                const newSpan = document.createElement("span");
                newSpan.className = "unread-count";
                newSpan.textContent = count;
                textElement.appendChild(document.createTextNode(" ")); // Add a space before the span
                textElement.appendChild(newSpan);
            }
        }
    }

    // --- Friend Request Handling (Polling) ---
    async function fetchFriendRequests() {
        try {
            const response = await fetch(`/friends/get-requests?since=${lastRequestUpdateTimestamp}`);
            const data = await response.json();
            if (data.success) {
                if (data.requests.length > 0) {
                    data.requests.forEach(addFriendRequestToDOM);
                    lastRequestUpdateTimestamp = data.latestTimestamp || Date.now();
                }
                updateUnreadRequestsCount(data.unreadCount);
                // Handle removed/cancelled requests if the backend provides such info
                if (data.removedRequestIds && data.removedRequestIds.length > 0) {
                    data.removedRequestIds.forEach(removeFriendRequestFromDOM);
                }
            }
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    }

    function addFriendRequestToDOM(request) {
        if (!friendRequestsList || document.querySelector(`#friend-requests-list li[data-id="${request.id}"]`)) return;
        const noRequestsMsg = friendRequestsList.querySelector(".no-results");
        if (noRequestsMsg) noRequestsMsg.remove();

        const li = document.createElement("li");
        li.className = "li";
        li.dataset.id = request.id;
        li.innerHTML = `
            <div class="friend-info">
                <img src="${request.sender_avatar || 	"/uploads/images/pngwing.com.png"}" 
                     alt="صورة مرسل الطلب" 
                     onerror="this.src=\"/uploads/images/pngwing.com.png\"" />
                <span>${request.sender_name}</span>
            </div>
            <div class="friend-actions">
                <form class="friend-action-form" data-action="accept-request" data-request-id="${request.id}">
                    <button type="submit" class="action-button accept">قبول</button>
                </form>
                <form class="friend-action-form" data-action="reject-request" data-request-id="${request.id}">
                    <button type="submit" class="action-button reject">رفض</button>
                </form>
            </div>
        `;
        friendRequestsList.prepend(li);
        li.querySelectorAll(".friend-action-form").forEach(addFormEventListener);
    }
    
    function removeFriendRequestFromDOM(requestId) {
        const requestElement = document.querySelector(`#friend-requests-list li[data-id="${requestId}"]`);
        if (requestElement) requestElement.remove();
        if (friendRequestsList && friendRequestsList.children.length === 0) {
            const p = document.createElement("p");
            p.className = "no-results";
            p.textContent = "لا توجد طلبات صداقة جديدة";
            friendRequestsList.appendChild(p);
        }
    }

    // --- Friends List Handling (Polling) ---
    async function fetchFriendsListUpdates() {
        try {
            const response = await fetch(`/friends/get-friends-updates?since=${lastFriendUpdateTimestamp}`);
            const data = await response.json();
            if (data.success) {
                if (data.newFriends && data.newFriends.length > 0) {
                    data.newFriends.forEach(addFriendToDOM);
                }
                if (data.updatedFriends && data.updatedFriends.length > 0) {
                    data.updatedFriends.forEach(updateFriendInDOM); // For online status etc.
                }
                if (data.removedFriendIds && data.removedFriendIds.length > 0) {
                    data.removedFriendIds.forEach(removeFriendFromDOM);
                }
                if (data.blockedFriends && data.blockedFriends.length > 0) {
                     data.blockedFriends.forEach(addBlockedFriendToDOM);
                }
                if (data.unblockedFriendIds && data.unblockedFriendIds.length > 0) {
                    data.unblockedFriendIds.forEach(removeBlockedFriendFromDOM);
                }
                updateFriendsCount(data.friendsCount);
                lastFriendUpdateTimestamp = data.latestTimestamp || Date.now();
            }
        } catch (error) {
            console.error("Error fetching friends list updates:", error);
        }
    }

    function addFriendToDOM(friend) {
        if (!friendsList || document.querySelector(`#friends-list li[data-id="${friend.id}"]`)) return;
        const noFriendsMsg = friendsList.querySelector(".no-results");
        if (noFriendsMsg) noFriendsMsg.remove();

        const li = document.createElement("li");
        li.className = "li";
        li.dataset.id = friend.id;
        li.innerHTML = `
            <div class="friend-info">
                <a href="/profile?userId=${friend.id}" class="friend-link">
                  <img src="${friend.avatar || "/uploads/images/pngwing.com.png"}" 
                       alt="صورة الصديق" 
                       onerror="this.src='/uploads/images/pngwing.com.png'" />
                  <span>${friend.name}</span>
                </a>
                <span class="${friend.online ? "online" : "offline"}">${friend.online ? "متصل" : "غير متصل"}</span>
            </div>
            <div class="friend-actions">
                <a href="/chat/${friend.id}" class="action-icon" title="الدردشة"><i class="fas fa-comment"></i></a>
                <form class="friend-action-form" data-action="block" data-friend-id="${friend.id}" style="display: inline;">
                    <button type="submit" class="action-icon" title="حظر"><i class="fas fa-ban"></i></button>
                </form>
            </div>
        `;
        friendsList.prepend(li);
        li.querySelector("form[data-action=\"block\"]").addEventListener("submit", handleFriendAction);
    }

    function updateFriendInDOM(friend) {
        const friendElement = document.querySelector(`#friends-list li[data-id="${friend.id}"]`);
        if (friendElement) {
            const onlineStatusElement = friendElement.querySelector(".friend-info .online, .friend-info .offline");
            if (onlineStatusElement) {
                onlineStatusElement.className = friend.online ? "online" : "offline";
                onlineStatusElement.textContent = friend.online ? "متصل" : "غير متصل";
            }
            // Update other details if needed
        }
    }

    function removeFriendFromDOM(friendId) {
        const friendElement = document.querySelector(`#friends-list li[data-id="${friendId}"]`);
        if (friendElement) friendElement.remove();
         if (friendsList && friendsList.children.length === 0) {
            const p = document.createElement("p");
            p.className = "no-results";
            p.textContent = "لا يوجد أصدقاء حاليًا";
            friendsList.appendChild(p);
        }
    }
    
    function addBlockedFriendToDOM(blockedFriend) {
        if (!blockedFriendsList || document.querySelector(`#blocked-friends-list li[data-id="${blockedFriend.id}"]`)) return;
        const noBlockedMsg = blockedFriendsList.querySelector(".no-results");
        if (noBlockedMsg) noBlockedMsg.remove();

        const li = document.createElement("li");
        li.className = "li";
        li.dataset.id = blockedFriend.id;
        li.innerHTML = `
            <div class="friend-info">
                <img src="${blockedFriend.avatar || 	"/uploads/images/pngwing.com.png"}" 
                     alt="صورة المحظور" 
                     onerror="this.src=\"/uploads/images/pngwing.com.png\"" />
                <span>${blockedFriend.name}</span>
            </div>
            <form class="friend-action-form" data-action="unblock" data-friend-id="${blockedFriend.id}">
                <button type="submit">إلغاء الحظر</button>
            </form>
        `;
        blockedFriendsList.prepend(li);
        li.querySelector("form[data-action=\"unblock\"]").addEventListener("submit", handleFriendAction);
    }

    function removeBlockedFriendFromDOM(friendId) {
        const blockedElement = document.querySelector(`#blocked-friends-list li[data-id="${friendId}"]`);
        if (blockedElement) blockedElement.remove();
        if (blockedFriendsList && blockedFriendsList.children.length === 0) {
            const p = document.createElement("p");
            p.className = "no-results";
            p.textContent = "لا يوجد أصدقاء محظورين";
            blockedFriendsList.appendChild(p);
        }
    }

    // --- Generic Form Submission Handler (AJAX) ---
    async function handleFriendAction(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const action = form.dataset.action;
        const friendId = form.dataset.friendId;
        const requestId = form.dataset.requestId;
        let url, body = {};

        switch (action) {
            case "send-request":
                url = "/friends/send-request";
                body = { friendId: form.querySelector("input[name=\"friendId\"]").value }; // Get from hidden input
                break;
            case "accept-request":
                url = `/friends/accept-request/${requestId}`;
                break;
            case "reject-request":
                url = `/friends/reject-request/${requestId}`;
                break;
            case "block":
                url = `/friends/block/${friendId}`;
                break;
            case "unblock":
                url = `/friends/unblock/${friendId}`;
                break;
            default:
                return;
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: Object.keys(body).length ? JSON.stringify(body) : null,
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                displayMessage(data.message || "تمت العملية بنجاح", "success");
                // تحديث واجهة المستخدم مباشرة
                if (action === "send-request") {
                    const button = form.querySelector("button");
                    if (button) {
                        button.textContent = "طلب مرسل";
                        button.disabled = true;
                    }
                } else if (action === "accept-request" || action === "reject-request") {
                    const requestElement = form.closest("li");
                    if (requestElement) {
                        requestElement.remove();
                        if (friendRequestsList && friendRequestsList.children.length === 0) {
                            const p = document.createElement("p");
                            p.className = "no-results";
                            p.textContent = "لا توجد طلبات صداقة جديدة";
                            friendRequestsList.appendChild(p);
                        }
                    }
                }
                // تحديث القوائم
                fetchFriendRequests();
                fetchFriendsListUpdates();
            } else {
                displayMessage(data.message || "فشلت العملية", "error");
            }
        } catch (error) {
            console.error(`Error with action ${action}:`, error);
            displayMessage("حدث خطأ في الشبكة أو الخادم", "error");
        }
    }
    
    function addFormEventListener(formElement) {
        formElement.addEventListener("submit", handleFriendAction);
    }

    // --- Initial Setup ---
    document.addEventListener("DOMContentLoaded", () => {
        // إضافة مستمعي الأحداث لجميع النماذج الموجودة
        document.querySelectorAll("form[action^=\"/friends/send-request\"]").forEach(form => {
            form.dataset.action = "send-request";
            addFormEventListener(form);
        });
        document.querySelectorAll("form[action*=\"/accept-request/\"]").forEach(form => {
            form.dataset.action = "accept-request";
            form.dataset.requestId = form.action.split("/").pop();
            addFormEventListener(form);
        });
        document.querySelectorAll("form[action*=\"/reject-request/\"]").forEach(form => {
            form.dataset.action = "reject-request";
            form.dataset.requestId = form.action.split("/").pop();
            addFormEventListener(form);
        });
        document.querySelectorAll("form[action*=\"/block/\"]").forEach(form => {
            form.dataset.action = "block";
            form.dataset.friendId = form.action.split("/").pop();
            addFormEventListener(form);
        });
        document.querySelectorAll("form[action*=\"/unblock/\"]").forEach(form => {
            form.dataset.action = "unblock";
            form.dataset.friendId = form.action.split("/").pop();
            addFormEventListener(form);
        });

        // بدء التحديث التلقائي
        fetchFriendRequests();
        fetchFriendsListUpdates();
        setInterval(fetchFriendRequests, 15000); // تحديث طلبات الصداقة كل 15 ثانية
        setInterval(fetchFriendsListUpdates, 20000); // تحديث قائمة الأصدقاء كل 20 ثانية
    });

