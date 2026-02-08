// Ethical Hacker Club - JavaScript Functionality

// Data Storage (using localStorage for persistence)
const DB_KEYS = {
    MEMBERS: 'ehc_members',
    EVENTS: 'ehc_events',
    NOTICES: 'ehc_notices',
    CURRENT_MEMBER: 'ehc_current_member'
};

// Initialize default data
function initializeData() {
    if (!localStorage.getItem(DB_KEYS.EVENTS)) {
        const defaultEvents = [
            {
                id: 1,
                title: 'Penetration Testing Workshop',
                description: 'Learn practical penetration testing techniques',
                date: '2026-02-15',
                time: '10:00',
                registered: []
            },
            {
                id: 2,
                title: 'CTF Competition',
                description: 'Test your skills in our CTF challenge',
                date: '2026-02-20',
                time: '09:00',
                registered: []
            },
            {
                id: 3,
                title: 'Cybersecurity Fundamentals',
                description: 'Basic cybersecurity concepts for beginners',
                date: '2026-02-25',
                time: '11:00',
                registered: []
            }
        ];
        localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(defaultEvents));
    }

    if (!localStorage.getItem(DB_KEYS.NOTICES)) {
        const defaultNotices = [
            {
                id: 1,
                title: 'Welcome to Ethical Hacker Club!',
                content: 'Join us to learn cybersecurity, ethical hacking, and protect the digital world.',
                date: 'Feb 8, 2026'
            },
            {
                id: 2,
                title: 'Next Workshop: Penetration Testing',
                content: 'Learn penetration testing techniques from industry experts.',
                date: 'Feb 15, 2026'
            },
            {
                id: 3,
                title: 'CTF Competition Coming Soon!',
                content: 'Prepare for our upcoming Capture The Flag competition.',
                date: 'Feb 20, 2026'
            }
        ];
        localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify(defaultNotices));
    }

    if (!localStorage.getItem(DB_KEYS.MEMBERS)) {
        localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify([]));
    }
}

// Call initialization on load
initializeData();

// ==================== ASSISTANT FUNCTIONS ====================

function toggleAssistant() {
    const panel = document.getElementById('assistantPanel');
    panel.classList.toggle('hidden');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendQuestion();
    }
}

function sendQuestion() {
    const input = document.getElementById('userQuestion');
    const question = input.value.trim();
    
    if (!question) return;
    
    // Add user message
    addMessage(question, 'user');
    input.value = '';
    
    // Process question and generate response
    setTimeout(() => {
        const response = generateResponse(question);
        addMessage(response, 'bot');
    }, 500);
}

function addMessage(text, type) {
    const container = document.getElementById('assistantMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function generateResponse(question) {
    const currentMember = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_MEMBER));
    const isPremium = currentMember && (currentMember.isPremium || currentMember.isLifetime);
    const q = question.toLowerCase();
    
    // Check if asking about code
    if (q.includes('code') || q.includes('programming') || q.includes('script') || 
        q.includes('hack') || q.includes('exploit') || q.includes('python') ||
        q.includes('javascript') || q.includes('bash') || q.includes('shell')) {
        
        if (isPremium) {
            return `
                <div class="code-response">
                    <p><i class="fas fa-crown" style="color: var(--gold-color);"></i> <strong>Premium Member Access Granted!</strong></p>
                    <p>As a ${currentMember.isLifetime ? 'Lifetime' : 'Premium'} member, here's code example for <strong>${question}</strong>:</p>
                    <div style="
                        background: var(--dark-bg);
                        padding: 1rem;
                        border-radius: 8px;
                        margin: 1rem 0;
                        font-family: 'Courier New', monospace;
                        font-size: 0.9rem;
                        border: 1px solid rgba(0, 255, 136, 0.3);
                    ">
                        <p style="color: var(--primary-color);"># Example Python Script</p>
                        <p style="color: var(--text-color);">def example_function():</p>
                        <p style="color: var(--text-color);">    print("Ethical hacking example")</p>
                        <p style="color: var(--text-color);">    return True</p>
                        <p style="color: var(--gold-color); font-size: 0.8rem;"># Premium content unlocked!</p>
                    </div>
                    <p style="color: var(--text-color); font-size: 0.85rem;">
                        <i class="fas fa-info-circle"></i> 
                        For detailed code assistance, contact admin for custom solutions.
                    </p>
                </div>
            `;
        } else {
            return `
                <div class="code-response">
                    <p>I understand you're asking about <strong>${question}</strong>.</p>
                    <p><i class="fas fa-lock"></i> <strong>Code Generation Locked</strong></p>
                    <p>Advanced code generation features require a premium upgrade.</p>
                    <button class="upgrade-btn" onclick="showUpgradeModal()" style="
                        padding: 0.75rem 1.5rem;
                        background: var(--gradient-primary);
                        border: none;
                        border-radius: 8px;
                        color: var(--dark-bg);
                        font-weight: 700;
                        cursor: pointer;
                        margin-top: 1rem;
                    ">
                        <i class="fas fa-rocket"></i> Upgrade to Premium
                    </button>
                    <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-color);">
                        <i class="fas fa-info-circle"></i> 
                        Admin can also manually upgrade your account upon request.
                    </p>
                </div>
            `;
        }
    }
    
    // General questions
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello! Welcome to Ethical Hacker Club. How can I assist you today?";
    }
    
    if (q.includes('membership') || q.includes('join') || q.includes('register')) {
        return "To become a member of Ethical Hacker Club, click the 'Join Now' button on our home page. You'll get access to exclusive events, workshops, and can earn medals and ranks!";
    }
    
    if (q.includes('event') || q.includes('workshop') || q.includes('training')) {
        return "We regularly host workshops, CTF competitions, and training sessions. Check our Events section for upcoming activities. Members get priority registration!";
    }
    
    if (q.includes('medal') || q.includes('rank') || q.includes('award')) {
        return "Members earn medals and ranks by participating in events and contributing to the community. Admin can award gold, silver, bronze, and participation medals!";
    }
    
    if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
        return "You can reach us through our membership registration form. We'll get back to you within 24-48 hours.";
    }
    
    if (q.includes('about') || q.includes('what is') || q.includes('who')) {
        return "Ethical Hacker Club is a community dedicated to teaching ethical hacking, cybersecurity, and digital protection skills. We focus on defensive security and ethical practices.";
    }
    
    // Default response
    return "That's a great question! For detailed inquiries about cybersecurity topics, premium members get access to advanced code generation. Would you like to upgrade to premium for more detailed assistance?";
}

function showUpgradeModal() {
    closeAssistant();
    document.getElementById('upgradeModal').classList.remove('hidden');
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('hidden');
}

function closeAssistant() {
    document.getElementById('assistantPanel').classList.add('hidden');
}

function copyUPI() {
    const upiId = document.getElementById('upiId').textContent;
    navigator.clipboard.writeText(upiId).then(() => {
        alert('UPI ID copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = upiId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('UPI ID copied to clipboard!');
    });
}

function confirmPayment() {
    const checkboxes = document.querySelectorAll('input[name="payment"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select a payment method');
        return;
    }
    
    closeUpgradeModal();
    document.getElementById('paymentConfirmModal').classList.remove('hidden');
}

function closePaymentConfirm() {
    document.getElementById('paymentConfirmModal').classList.add('hidden');
}

// ==================== ADMIN FUNCTIONS ====================

function showAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('hidden');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('hidden');
}

function adminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === '1122') {
        closeAdminLogin();
        showAdminPanel();
        loadMembers();
        loadAwardMembers();
    } else {
        alert('Invalid password!');
    }
}

function showAdminPanel() {
    document.getElementById('adminPanel').classList.remove('hidden');
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.add('hidden');
}

function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'members') {
        loadMembers();
    } else if (tabName === 'membership') {
        loadUpgradeMembers();
        loadPremiumMembers();
        loadPendingUpgrades();
    }
}

function addNewEvent(event) {
    event.preventDefault();
    
    const events = JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]');
    const newEvent = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        registered: []
    };
    
    events.push(newEvent);
    localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
    
    alert('Event added successfully!');
    document.getElementById('addEventForm').reset();
    renderEvents();
}

function addNewNotice(event) {
    event.preventDefault();
    
    const notices = JSON.parse(localStorage.getItem(DB_KEYS.NOTICES) || '[]');
    const newNotice = {
        id: Date.now(),
        title: document.getElementById('noticeTitle').value,
        content: document.getElementById('noticeContent').value,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    notices.unshift(newNotice);
    localStorage.setItem(DB_KEYS.NOTICES, JSON.stringify(notices));
    
    alert('Notice added successfully!');
    document.getElementById('addNoticeForm').reset();
    renderNotices();
}

function loadMembers() {
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const container = document.getElementById('membersList');
    
    if (members.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-color);">No members yet.</p>';
        return;
    }
    
    container.innerHTML = members.map(member => {
        let statusIcon = '';
        if (member.isLifetime) {
            statusIcon = '<i class="fas fa-crown" style="color: var(--gold-color);"></i>';
        } else if (member.isPremium) {
            statusIcon = '<i class="fas fa-star" style="color: var(--warning-color);"></i>';
        }
        
        return `
            <div class="member-item">
                <div class="member-info">
                    <h4>${member.name} ${statusIcon}</h4>
                    <p>${member.email} | ${member.phone}</p>
                    <p>Skills: ${member.skills || 'Not specified'}</p>
                </div>
                <div class="member-stats">
                    <span><i class="fas fa-medal"></i> ${member.medals.length}</span>
                    <span><i class="fas fa-star"></i> ${calculateXP(member)} XP</span>
                    <span><i class="fas fa-trophy"></i> ${getRank(member)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function loadAwardMembers() {
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const select = document.getElementById('awardMember');
    
    select.innerHTML = members.map(member => 
        `<option value="${member.id}">${member.name}</option>`
    ).join('');
}

function awardMedal(event) {
    event.preventDefault();
    
    const memberId = document.getElementById('awardMember').value;
    const medalType = document.getElementById('medalType').value;
    const reason = document.getElementById('awardReason').value;
    
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
        alert('Member not found!');
        return;
    }
    
    members[memberIndex].medals.push({
        type: medalType,
        reason: reason,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
    
    alert(`${medalType.charAt(0).toUpperCase() + medalType.slice(1)} medal awarded successfully!`);
    document.getElementById('awardForm').reset();
    loadMembers();
}

// ==================== MEMBER FUNCTIONS ====================

function showJoinForm() {
    document.getElementById('joinModal').classList.remove('hidden');
}

function closeJoinForm() {
    document.getElementById('joinModal').classList.add('hidden');
}

function submitJoinForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('memberNameInput').value;
    const email = document.getElementById('memberEmail').value;
    const phone = document.getElementById('memberPhone').value;
    const skills = document.getElementById('memberSkills').value;
    
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    
    // Check if email already exists
    if (members.some(m => m.email === email)) {
        alert('This email is already registered!');
        return;
    }
    
    const newMember = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        skills: skills,
        medals: [],
        joinedEvents: [],
        joinDate: new Date().toISOString(),
        xp: 0
    };
    
    members.push(newMember);
    localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
    
    // Set as current member
    localStorage.setItem(DB_KEYS.CURRENT_MEMBER, JSON.stringify(newMember));
    
    closeJoinForm();
    showRegistrationSuccess(newMember);
}

function showRegistrationSuccess(member) {
    document.getElementById('registrationSuccessModal').classList.remove('hidden');
    document.getElementById('newMemberProfile').innerHTML = `
        <div class="profile-preview" style="
            background: rgba(0, 255, 136, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        ">
            <p><strong>Name:</strong> ${member.name}</p>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>Rank:</strong> ${getRank(member)}</p>
            <p><strong>Medals:</strong> 0</p>
        </div>
    `;
}

function viewProfile() {
    document.getElementById('registrationSuccessModal').classList.add('hidden');
    const currentMember = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_MEMBER));
    if (currentMember) {
        showMemberProfile(currentMember);
    }
}

function showMemberProfile(member) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('memberProfile').classList.remove('hidden');
    
    document.getElementById('memberName').textContent = member.name;
    
    // Add premium badge if applicable
    const rankBadge = document.getElementById('memberRank');
    if (member.isLifetime) {
        rankBadge.innerHTML = `${getRank(member)} <i class="fas fa-crown" style="color: var(--gold-color);"></i>`;
    } else if (member.isPremium) {
        rankBadge.innerHTML = `${getRank(member)} <i class="fas fa-star" style="color: var(--warning-color);"></i>`;
    } else {
        rankBadge.textContent = getRank(member);
    }
    
    document.getElementById('medalCount').textContent = member.medals.length;
    document.getElementById('xpPoints').textContent = calculateXP(member);
    document.getElementById('eventsJoined').textContent = member.joinedEvents.length;
    
    renderMedals(member);
}

function renderMedals(member) {
    const container = document.getElementById('medalsGrid');
    
    if (member.medals.length === 0) {
        container.innerHTML = `
            <div class="medal empty-medal">
                <i class="fas fa-medal"></i>
                <span>No medals yet</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = member.medals.map(medal => `
        <div class="medal ${medal.type}">
            <i class="fas fa-medal"></i>
            <span>${medal.type.charAt(0).toUpperCase() + medal.type.slice(1)}</span>
            <span style="font-size: 0.7rem; opacity: 0.7;">${medal.reason || ''}</span>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem(DB_KEYS.CURRENT_MEMBER);
    document.getElementById('memberProfile').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
}

function closeRegistrationSuccess() {
    document.getElementById('registrationSuccessModal').classList.add('hidden');
}

function calculateXP(member) {
    let xp = 0;
    member.medals.forEach(medal => {
        switch (medal.type) {
            case 'gold': xp += 100; break;
            case 'silver': xp += 50; break;
            case 'bronze': xp += 25; break;
            case 'participation': xp += 10; break;
        }
    });
    member.joinedEvents.forEach(() => {
        xp += 5;
    });
    return xp;
}

function getRank(member) {
    const xp = calculateXP(member);
    if (xp >= 500) return 'Master Hacker';
    if (xp >= 300) return 'Expert Hacker';
    if (xp >= 150) return 'Skilled Hacker';
    if (xp >= 50) return 'Apprentice Hacker';
    return 'Novice Hacker';
}

// ==================== EVENT FUNCTIONS ====================

function registerForEvent(eventName) {
    const currentMember = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_MEMBER));
    
    if (!currentMember) {
        alert('Please join the club first to register for events!');
        showJoinForm();
        return;
    }
    
    const events = JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]');
    const event = events.find(e => e.title === eventName);
    
    if (!event) {
        alert('Event not found!');
        return;
    }
    
    if (event.registered.includes(currentMember.id)) {
        alert('You are already registered for this event!');
        return;
    }
    
    event.registered.push(currentMember.id);
    localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(events));
    
    // Update member's joined events
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const memberIndex = members.findIndex(m => m.id === currentMember.id);
    
    if (memberIndex !== -1) {
        members[memberIndex].joinedEvents.push({
            eventId: event.id,
            eventName: event.title,
            date: event.date
        });
        localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
        localStorage.setItem(DB_KEYS.CURRENT_MEMBER, JSON.stringify(members[memberIndex]));
    }
    
    document.getElementById('eventRegMessage').innerHTML = `
        <i class="fas fa-check-circle" style="color: var(--success-color); font-size: 2rem;"></i>
        <p style="margin-top: 1rem;">Successfully registered for "${event.title}"!</p>
        <p>Event Date: ${event.date} at ${event.time}</p>
    `;
    document.getElementById('eventRegModal').classList.remove('hidden');
}

function closeEventRegModal() {
    document.getElementById('eventRegModal').classList.add('hidden');
}

// ==================== RENDER FUNCTIONS ====================

function renderNotices() {
    const notices = JSON.parse(localStorage.getItem(DB_KEYS.NOTICES) || '[]');
    const container = document.getElementById('noticesContainer');
    
    container.innerHTML = notices.map(notice => `
        <div class="notice-card">
            <h3>${notice.title}</h3>
            <p>${notice.content}</p>
            <span class="date">${notice.date}</span>
        </div>
    `).join('');
}

function renderEvents() {
    const events = JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]');
    const container = document.getElementById('eventsContainer');
    
    const formattedDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        };
    };
    
    container.innerHTML = events.map(event => {
        const dateObj = formattedDate(event.date);
        return `
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${dateObj.day}</span>
                    <span class="month">${dateObj.month}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                    <p><i class="fas fa-clock"></i> ${formatTime(event.time)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Online</p>
                    <button class="register-btn" onclick="registerForEvent('${event.title}')">Register</button>
                </div>
            </div>
        `;
    }).join('');
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

// ==================== HOME PAGE ANIMATION ====================

function addHomePageAnimation() {
    // Add floating animation to event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to notice cards
    const noticeCards = document.querySelectorAll('.notice-card');
    noticeCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
    
    // Add pulse effect to join button
    const joinBtn = document.querySelector('.join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('mouseenter', () => {
            joinBtn.style.animation = 'none';
        });
        joinBtn.addEventListener('mouseleave', () => {
            joinBtn.style.animation = 'pulse 2s ease-in-out infinite';
        });
    }
}

// ==================== MEMBERSHIP UPGRADE FUNCTIONS ====================

function loadUpgradeMembers() {
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const select = document.getElementById('upgradeMemberSelect');
    
    // Only show non-premium members for upgrade
    const nonPremiumMembers = members.filter(m => !m.isPremium && !m.isLifetime);
    
    select.innerHTML = nonPremiumMembers.length > 0 
        ? nonPremiumMembers.map(member => 
            `<option value="${member.id}">${member.name} (${member.email})</option>`
          ).join('')
        : '<option value="">All members are premium!</option>';
}

function loadPremiumMembers() {
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const premiumMembers = members.filter(m => m.isPremium || m.isLifetime);
    const container = document.getElementById('premiumMembersList');
    
    if (premiumMembers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-color);">No premium members yet.</p>';
        return;
    }
    
    container.innerHTML = premiumMembers.map(member => `
        <div class="member-item">
            <div class="member-info">
                <h4>${member.name} ${member.isLifetime ? '<i class="fas fa-crown" style="color: var(--gold-color);"></i>' : '<i class="fas fa-star" style="color: var(--warning-color);"></i>'}</h4>
                <p>${member.email} | ${member.phone}</p>
                <p>Membership: ${member.isLifetime ? 'Lifetime' : 'Premium'} | Since: ${member.upgradeDate || 'N/A'}</p>
            </div>
            <div class="member-stats">
                <button onclick="revokeMembership('${member.id}')" style="
                    padding: 0.5rem 1rem;
                    background: var(--danger-color);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    font-size: 0.85rem;
                "><i class="fas fa-ban"></i> Revoke</button>
            </div>
        </div>
    `).join('');
}

function loadPendingUpgrades() {
    const pending = JSON.parse(localStorage.getItem('ehc_pending_upgrades') || '[]');
    const container = document.getElementById('pendingUpgradesList');
    
    if (pending.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-color);">No pending upgrade requests.</p>';
        return;
    }
    
    container.innerHTML = pending.map((req, index) => `
        <div class="member-item">
            <div class="member-info">
                <h4>${req.name}</h4>
                <p>${req.email}</p>
                <p>Requested: ${req.requestDate}</p>
                <p>Status: <span style="color: var(--warning-color);">Pending Admin Approval</span></p>
            </div>
            <div class="member-stats">
                <button onclick="approveUpgrade(${index})" style="
                    padding: 0.5rem 1rem;
                    background: var(--success-color);
                    border: none;
                    border-radius: 6px;
                    color: var(--dark-bg);
                    cursor: pointer;
                    font-size: 0.85rem;
                "><i class="fas fa-check"></i> Approve</button>
            </div>
        </div>
    `).join('');
}

function upgradeMember(event) {
    event.preventDefault();
    
    const memberId = document.getElementById('upgradeMemberSelect').value;
    const upgradeType = document.getElementById('upgradeType').value;
    const notes = document.getElementById('upgradeNotes').value;
    
    if (!memberId) {
        alert('Please select a member to upgrade.');
        return;
    }
    
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
        alert('Member not found!');
        return;
    }
    
    // Update member's premium status
    members[memberIndex].isPremium = upgradeType === 'premium';
    members[memberIndex].isLifetime = upgradeType === 'lifetime';
    members[memberIndex].upgradeDate = new Date().toLocaleDateString();
    members[memberIndex].upgradeNotes = notes;
    members[memberIndex].upgradeBy = 'Admin';
    
    localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
    
    alert(`${members[memberIndex].name} has been upgraded to ${upgradeType === 'lifetime' ? 'Lifetime' : 'Premium'} membership!`);
    
    // Refresh the lists
    document.getElementById('upgradeMemberForm').reset();
    loadUpgradeMembers();
    loadPremiumMembers();
    
    // Update current member if it's the one being upgraded
    const currentMember = JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_MEMBER));
    if (currentMember && currentMember.id === memberId) {
        localStorage.setItem(DB_KEYS.CURRENT_MEMBER, JSON.stringify(members[memberIndex]));
    }
}

function revokeMembership(memberId) {
    if (!confirm('Are you sure you want to revoke this member\'s premium status?')) {
        return;
    }
    
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const memberIndex = members.findIndex(m => m.id == memberId);
    
    if (memberIndex === -1) {
        alert('Member not found!');
        return;
    }
    
    const memberName = members[memberIndex].name;
    members[memberIndex].isPremium = false;
    members[memberIndex].isLifetime = false;
    members[memberIndex].upgradeDate = null;
    
    localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
    
    alert(`${memberName}'s premium membership has been revoked.`);
    loadPremiumMembers();
    loadUpgradeMembers();
}

function approveUpgrade(index) {
    const pending = JSON.parse(localStorage.getItem('ehc_pending_upgrades') || '[]');
    
    if (index < 0 || index >= pending.length) {
        alert('Invalid request!');
        return;
    }
    
    const request = pending[index];
    
    const members = JSON.parse(localStorage.getItem(DB_KEYS.MEMBERS) || '[]');
    const memberIndex = members.findIndex(m => m.email === request.email);
    
    if (memberIndex !== -1) {
        members[memberIndex].isPremium = true;
        members[memberIndex].upgradeDate = new Date().toLocaleDateString();
        members[memberIndex].upgradeNotes = 'Approved from payment request';
        localStorage.setItem(DB_KEYS.MEMBERS, JSON.stringify(members));
    }
    
    // Remove from pending list
    pending.splice(index, 1);
    localStorage.setItem('ehc_pending_upgrades', JSON.stringify(pending));
    
    alert('Upgrade approved!');
    loadPremiumMembers();
    loadPendingUpgrades();
}

function checkMemberPremiumStatus(member) {
    if (member.isLifetime) {
        return { status: 'lifetime', icon: '<i class="fas fa-crown" style="color: var(--gold-color);"></i>' };
    }
    if (member.isPremium) {
        return { status: 'premium', icon: '<i class="fas fa-star" style="color: var(--warning-color);"></i>' };
    }
    return { status: 'free', icon: '' };
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    renderNotices();
    renderEvents();
    addHomePageAnimation();
    
    // Check if member is logged in
    const currentMember = localStorage.getItem(DB_KEYS.CURRENT_MEMBER);
    if (currentMember) {
        const member = JSON.parse(currentMember);
        // Show profile silently if member is logged in
        console.log('Welcome back, ' + member.name);
    }
});

// Export functions for global use
window.toggleAssistant = toggleAssistant;
window.sendQuestion = sendQuestion;
window.handleKeyPress = handleKeyPress;
window.showJoinForm = showJoinForm;
window.closeJoinForm = closeJoinForm;
window.submitJoinForm = submitJoinForm;
window.showAdminLogin = showAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.adminLogin = adminLogin;
window.closeAdminPanel = closeAdminPanel;
window.showAdminTab = showAdminTab;
window.addNewEvent = addNewEvent;
window.addNewNotice = addNewNotice;
window.awardMedal = awardMedal;
window.registerForEvent = registerForEvent;
window.closeEventRegModal = closeEventRegModal;
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.copyUPI = copyUPI;
window.confirmPayment = confirmPayment;
window.closePaymentConfirm = closePaymentConfirm;
window.closeRegistrationSuccess = closeRegistrationSuccess;
window.viewProfile = viewProfile;
window.logout = logout;
window.upgradeMember = upgradeMember;
window.revokeMembership = revokeMembership;
window.approveUpgrade = approveUpgrade;
window.loadUpgradeMembers = loadUpgradeMembers;
window.loadPremiumMembers = loadPremiumMembers;
window.loadPendingUpgrades = loadPendingUpgrades;
