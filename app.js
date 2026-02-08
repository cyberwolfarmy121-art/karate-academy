// Karate Academy - Main JavaScript

// Belt levels configuration
const BELT_LEVELS = [
    { name: 'White Belt', level: 1, color: '#ffffff' },
    { name: 'Yellow Belt', level: 2, color: '#f1c40f' },
    { name: 'Orange Belt', level: 3, color: '#e67e22' },
    { name: 'Green Belt', level: 4, color: '#27ae60' },
    { name: 'Blue Belt', level: 5, color: '#3498db' },
    { name: 'Purple Belt', level: 6, color: '#9b59b6' },
    { name: 'Brown Belt', level: 7, color: '#8b4513' },
    { name: 'Black Belt', level: 8, color: '#2c3e50' }
];

// Video configuration with belt level requirements
const VIDEO_CONFIG = {
    basics: [
        { id: 'basics-1', title: 'Stances (Dachi)', requiredBelt: 1, description: 'Learn the fundamental stances', image: null, videoUrl: '' },
        { id: 'basics-2', title: 'Punches (Tsuki)', requiredBelt: 1, description: 'Master the straight punch and reverse punch', image: null, videoUrl: '' },
        { id: 'basics-3', title: 'Kicks (Geri)', requiredBelt: 2, description: 'Learn Mae-geri, Yoko-geri, Mawashi-geri', image: null, videoUrl: '' },
        { id: 'basics-4', title: 'Blocks (Uke)', requiredBelt: 1, description: 'Perfect your blocking techniques', image: null, videoUrl: '' }
    ],
    kata: [
        { id: 'kata-1', title: 'Taikyoku Shodan', requiredBelt: 1, description: 'The first kata for beginners', image: null, videoUrl: '' },
        { id: 'kata-2', title: 'Heian Shodan', requiredBelt: 2, description: 'The most famous kata with 21 movements', image: null, videoUrl: '' },
        { id: 'kata-3', title: 'Heian Nidan', requiredBelt: 3, description: 'Second form in the Heian series', image: null, videoUrl: '' },
        { id: 'kata-4', title: 'Kankū', requiredBelt: 5, description: 'Advanced kata focusing on reading the opponent', image: null, videoUrl: '' }
    ],
    kumite: [
        { id: 'kumite-1', title: 'Kihon Ippon Kumite', requiredBelt: 1, description: 'Basic one-step sparring for beginners', image: null, videoUrl: '' },
        { id: 'kumite-2', title: 'Jiyu Ippon Kumite', requiredBelt: 3, description: 'Free one-step sparring with more freedom', image: null, videoUrl: '' },
        { id: 'kumite-3', title: 'Competition Kumite', requiredBelt: 4, description: 'Learn techniques used in tournaments', image: null, videoUrl: '' },
        { id: 'kumite-4', title: 'Self-Defense Kumite', requiredBelt: 2, description: 'Practical self-defense techniques', image: null, videoUrl: '' }
    ]
};

// Initialize data storage
const AppData = {
    members: JSON.parse(localStorage.getItem('karateMembers')) || [],
    champions: JSON.parse(localStorage.getItem('karateChampions')) || [],
    masters: JSON.parse(localStorage.getItem('karateMasters')) || [],
    events: JSON.parse(localStorage.getItem('karateEvents')) || [],
    videoRequirements: JSON.parse(localStorage.getItem('videoRequirements')) || VIDEO_CONFIG,
    adminLoggedIn: false,
    currentMember: null
};

// Save data to localStorage
function saveData() {
    localStorage.setItem('karateMembers', JSON.stringify(AppData.members));
    localStorage.setItem('karateChampions', JSON.stringify(AppData.champions));
    localStorage.setItem('karateMasters', JSON.stringify(AppData.masters));
    localStorage.setItem('karateEvents', JSON.stringify(AppData.events));
    localStorage.setItem('videoRequirements', JSON.stringify(AppData.videoRequirements));
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Navigation active state
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                navLinks?.classList.remove('active');
            }
        });
    });
}

// ==================== VIDEO LOCKING FUNCTIONS ====================

// Get member's belt level
function getMemberBeltLevel() {
    if (!AppData.currentMember) return 0;
    const belt = BELT_LEVELS.find(b => b.name === AppData.currentMember.rank);
    return belt ? belt.level : 0;
}

// Get video requirement for a video card
function getVideoRequirement(card) {
    const type = card.dataset.type;
    const index = Array.from(card.parentElement.children).indexOf(card);
    if (AppData.videoRequirements[type] && AppData.videoRequirements[type][index]) {
        return AppData.videoRequirements[type][index];
    }
    return { requiredBelt: 1, title: 'Video' };
}

// Update lock overlay message
function updateLockOverlay(card, requirement) {
    let overlay = card.querySelector('.lock-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'lock-overlay';
        card.appendChild(overlay);
    }
    
    const beltInfo = BELT_LEVELS.find(b => b.level === requirement.requiredBelt);
    const beltName = beltInfo ? beltInfo.name : 'Unknown';
    
    overlay.innerHTML = `
        <span class="lock-icon">🔒</span>
        <p>Requires: ${beltName}</p>
    `;
}

// Update video locks based on member's belt level
function updateVideoLocks() {
    const videoCards = document.querySelectorAll('.video-card');
    const memberLevel = getMemberBeltLevel();
    
    videoCards.forEach(card => {
        const requirement = getVideoRequirement(card);
        const canAccess = memberLevel >= requirement.requiredBelt;
        
        if (canAccess) {
            card.classList.remove('locked');
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        } else {
            card.classList.add('locked');
            updateLockOverlay(card, requirement);
            const overlay = card.querySelector('.lock-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        }
    });
}

// Check if member is logged in
function isMemberLoggedIn() {
    return AppData.currentMember !== null;
}

// Lock all videos for non-members
function lockAllVideos() {
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const requirement = getVideoRequirement(card);
        card.classList.add('locked');
        updateLockOverlay(card, requirement);
        const overlay = card.querySelector('.lock-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    });
}

// Unlock all videos
function unlockAllVideos() {
    updateVideoLocks();
}

// Render video cards for a section
function renderVideoCards(section) {
    const grid = document.getElementById(`${section}Videos`);
    if (!grid) return;
    
    grid.innerHTML = '';
    const videos = AppData.videoRequirements[section] || [];
    
    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.type = section;
        card.dataset.index = index;
        
        const isLocked = !isMemberLoggedIn() || getMemberBeltLevel() < video.requiredBelt;
        
        card.innerHTML = `
            <div class="video-placeholder" ${isLocked ? '' : `onclick="playVideo('${section}', ${index})"`}>
                ${video.image ? `<img src="${video.image}" alt="${video.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;" onerror="this.parentElement.innerHTML='<span class=\'play-icon\'>▶</span><h3>${video.title}</h3><p>${video.description}</p>'">` : `<span class="play-icon">▶</span><h3>${video.title}</h3><p>${video.description}</p>`}
            </div>
            <div class="lock-overlay" style="display: ${isLocked ? 'flex' : 'none'}">
                <span class="lock-icon">🔒</span>
                <p>Requires: ${BELT_LEVELS.find(b => b.level === video.requiredBelt)?.name || 'Unknown'}</p>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Render all video sections
function renderAllVideos() {
    ['basics', 'kata', 'kumite'].forEach(section => {
        renderVideoCards(section);
    });
    updateVideoLocks();
}

// ==================== VIDEO PLAYER FUNCTIONS ====================

// Play video
function playVideo(section, index) {
    const video = AppData.videoRequirements[section]?.[index];
    if (!video) return;
    
    const modal = document.getElementById('videoModal');
    const titleEl = document.getElementById('modalVideoTitle');
    const descEl = document.getElementById('modalVideoDesc');
    const iframe = document.getElementById('videoIframe');
    const placeholder = document.getElementById('videoPlayerPlaceholder');
    
    titleEl.textContent = video.title;
    descEl.textContent = video.description;
    
    if (video.videoUrl) {
        // Check if YouTube URL
        if (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) {
            let embedUrl = video.videoUrl;
            if (video.videoUrl.includes('youtu.be')) {
                const videoId = video.videoUrl.split('/').pop();
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (video.videoUrl.includes('youtube.com/watch')) {
                const urlParams = new URLSearchParams(new URL(video.videoUrl).search);
                const videoId = urlParams.get('v');
                if (videoId) {
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }
            }
            iframe.src = embedUrl;
            iframe.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            // Direct video URL or other
            iframe.src = video.videoUrl;
            iframe.style.display = 'block';
            placeholder.style.display = 'none';
        }
    } else {
        // Show placeholder
        iframe.style.display = 'none';
        placeholder.style.display = 'flex';
    }
    
    modal.classList.add('show');
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    
    iframe.src = '';
    modal.classList.remove('show');
}

// Close modal on background click
function setupVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }
}

// ==================== MEMBER FUNCTIONS ====================

// Generate unique member ID
function generateMemberId() {
    return 'KA' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Register new member
function registerMember(formData) {
    const member = {
        id: generateMemberId(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        experience: formData.experience,
        goals: formData.goals,
        rank: 'White Belt',
        achievements: [],
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
    };
    
    AppData.members.push(member);
    saveData();
    return member;
}

// Login member
function loginMember() {
    const memberId = document.getElementById('memberIdInput').value.trim();
    const member = AppData.members.find(m => m.id === memberId);
    
    if (member) {
        AppData.currentMember = member;
        document.getElementById('memberInfo').style.display = 'none';
        document.getElementById('memberDetails').style.display = 'block';
        
        document.getElementById('memberInitial').textContent = member.name.charAt(0).toUpperCase();
        document.getElementById('memberName').textContent = member.name;
        document.getElementById('memberRank').textContent = member.rank;
        document.getElementById('detailMemberId').textContent = member.id;
        document.getElementById('memberJoinDate').textContent = member.joinDate;
        document.getElementById('memberStatus').textContent = member.status;
        
        const achievementsContainer = document.getElementById('memberAchievements');
        achievementsContainer.innerHTML = '';
        if (member.achievements && member.achievements.length > 0) {
            member.achievements.forEach(achievement => {
                const badge = document.createElement('span');
                badge.className = 'achievement-badge';
                badge.textContent = achievement;
                achievementsContainer.appendChild(badge);
            });
        } else {
            achievementsContainer.innerHTML = '<p style="color: var(--text-light);">No achievements yet</p>';
        }
        
        // Unlock videos when member logs in
        unlockAllVideos();
        
        showNotification(`Welcome back, ${member.name}! Videos are now unlocked.`, 'success');
    } else {
        showNotification('Member ID not found. Please check and try again.', 'error');
    }
}

// Logout member
function logoutMember() {
    AppData.currentMember = null;
    document.getElementById('memberInfo').style.display = 'block';
    document.getElementById('memberDetails').style.display = 'none';
    document.getElementById('memberIdInput').value = '';
    
    // Lock videos when member logs out
    lockAllVideos();
    
    showNotification('Logged out successfully', 'info');
}

// Upgrade member rank
function upgradeMember(memberId) {
    const member = AppData.members.find(m => m.id === memberId);
    if (member) {
        const ranks = ['White Belt', 'Yellow Belt', 'Orange Belt', 'Green Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt'];
        const currentIndex = ranks.indexOf(member.rank);
        
        if (currentIndex < ranks.length - 1) {
            member.rank = ranks[currentIndex + 1];
            member.achievements.push(`Promoted to ${member.rank}`);
            saveData();
            loadMembers();
            
            // Update current member if logged in
            if (AppData.currentMember && AppData.currentMember.id === memberId) {
                AppData.currentMember = member;
                document.getElementById('memberRank').textContent = member.rank;
            }
            
            showNotification(`${member.name} upgraded to ${member.rank}`, 'success');
        } else {
            showNotification('Member is already at the highest rank!', 'info');
        }
    }
}

// Delete member
function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        AppData.members = AppData.members.filter(m => m.id !== memberId);
        saveData();
        loadMembers();
        showNotification('Member deleted successfully', 'success');
    }
}

// Load members for admin
function loadMembers() {
    const membersList = document.getElementById('membersList');
    if (!membersList) return;
    
    membersList.innerHTML = '';
    
    if (AppData.members.length === 0) {
        membersList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No members registered yet.</p>';
        return;
    }
    
    AppData.members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <div class="member-info">
                <h4>${member.name}</h4>
                <p>ID: ${member.id} | ${member.rank} | ${member.experience}</p>
            </div>
            <div class="member-actions">
                <button class="btn-upgrade" onclick="upgradeMember('${member.id}')">Upgrade</button>
                <button class="btn-delete" onclick="deleteMember('${member.id}')">Delete</button>
            </div>
        `;
        membersList.appendChild(memberItem);
    });
}

// ==================== CHAMPIONS FUNCTIONS ====================

// Add champion
function addChampion() {
    const name = document.getElementById('championName').value.trim();
    const imageUrl = document.getElementById('championImage').value.trim();
    
    if (!name) {
        showNotification('Please enter champion name', 'error');
        return;
    }
    
    const champion = {
        id: Date.now(),
        name: name,
        image: imageUrl || null
    };
    
    AppData.champions.push(champion);
    saveData();
    loadChampions();
    loadAdminChampions();
    
    document.getElementById('championName').value = '';
    document.getElementById('championImage').value = '';
    
    showNotification('Champion added successfully', 'success');
}

// Load champions for admin
function loadAdminChampions() {
    const gallery = document.getElementById('adminChampionsGallery');
    const gallerySelect = document.getElementById('championsGallerySelect');
    const imageSelect = document.getElementById('championImage');
    
    // Load gallery selection grid
    if (gallerySelect) {
        gallerySelect.innerHTML = '';
        if (AppData.champions.length === 0) {
            gallerySelect.innerHTML = '<p style="color: var(--text-light); grid-column: 1/-1;">No champions to select. Add champions first.</p>';
        } else {
            AppData.champions.forEach(champion => {
                const item = document.createElement('div');
                item.className = 'gallery-item gallery-item-selectable';
                item.innerHTML = `
                    <div class="image-slot">
                        ${champion.image ? `<img src="${champion.image}" alt="${champion.name}" onerror="this.parentElement.innerHTML='<span class=\'placeholder-icon\'>🏆</span><p>${champion.name}</p>'">` : `<span class="placeholder-icon">🏆</span><p>${champion.name}</p>`}
                    </div>
                `;
                item.onclick = function() { selectChampionImage(champion); };
                gallerySelect.appendChild(item);
            });
        }
    }
    
    // Populate select dropdown
    if (imageSelect) {
        const currentValue = imageSelect.value;
        let options = '<option value="">Choose from gallery...</option>';
        AppData.champions.forEach((champion, idx) => {
            const selected = (champion.name === document.getElementById('championName').value) ? 'selected' : '';
            options += `<option value="${champion.image || ''}" ${selected}>${champion.name}</option>`;
        });
        imageSelect.innerHTML = options;
    }
    
    // Load admin gallery
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (AppData.champions.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1/-1;">No champions added yet.</p>';
        return;
    }
    
    AppData.champions.forEach(champion => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <div class="image-slot">
                ${champion.image ? `<img src="${champion.image}" alt="${champion.name}" onerror="this.parentElement.innerHTML='<span class=\'placeholder-icon\'>🏆</span><p>${champion.name}</p>'">` : `<span class="placeholder-icon">🏆</span><p>${champion.name}</p>`}
                <button onclick="deleteChampion(${champion.id})" style="margin-top: 10px; padding: 5px 15px; background: var(--primary-color); color: white; border: none; border-radius: 15px; cursor: pointer;">Remove</button>
            </div>
        `;
        gallery.appendChild(item);
    });
}

// Select champion image
function selectChampionImage(champion) {
    document.getElementById('championName').value = champion.name;
    document.getElementById('championImage').value = champion.image || '';
    showNotification('Selected: ' + champion.name, 'info');
}

// Delete champion
function deleteChampion(id) {
    if (confirm('Are you sure you want to remove this champion?')) {
        AppData.champions = AppData.champions.filter(c => c.id !== id);
        saveData();
        loadChampions();
        loadAdminChampions();
        showNotification('Champion removed successfully', 'success');
    }
}

// Load champions
function loadChampions() {
    const gallery = document.getElementById('championsGallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    const displayChampions = AppData.champions.length > 0 ? AppData.champions : [
        { name: 'Champion 1' },
        { name: 'Champion 2' },
        { name: 'Champion 3' },
        { name: 'Champion 4' }
    ];
    
    displayChampions.forEach((champion, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        if (champion.image) {
            item.innerHTML = `
                <div class="image-slot">
                    <img src="${champion.image}" alt="${champion.name}" onerror="this.parentElement.innerHTML='<span class=\\'placeholder-icon\\'>🏆</span><p>${champion.name}</p>'">
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="image-slot">
                    <span class="placeholder-icon">🏆</span>
                    <p>${champion.name}</p>
                </div>
            `;
        }
        
        gallery.appendChild(item);
    });
}

// ==================== MASTERS FUNCTIONS ====================

// Add master
function addMaster() {
    const name = document.getElementById('masterName').value.trim();
    const imageUrl = document.getElementById('masterImage').value.trim();
    
    if (!name) {
        showNotification('Please enter master name', 'error');
        return;
    }
    
    const master = {
        id: Date.now(),
        name: name,
        image: imageUrl || null
    };
    
    AppData.masters.push(master);
    saveData();
    loadMasters();
    loadAdminMasters();
    
    document.getElementById('masterName').value = '';
    document.getElementById('masterImage').value = '';
    
    showNotification('Master added successfully', 'success');
}

// Load masters for admin
function loadAdminMasters() {
    const gallery = document.getElementById('adminMastersGallery');
    const gallerySelect = document.getElementById('mastersGallerySelect');
    const imageSelect = document.getElementById('masterImage');
    
    // Load gallery selection grid
    if (gallerySelect) {
        gallerySelect.innerHTML = '';
        if (AppData.masters.length === 0) {
            gallerySelect.innerHTML = '<p style="color: var(--text-light); grid-column: 1/-1;">No masters to select. Add masters first.</p>';
        } else {
            AppData.masters.forEach(master => {
                const item = document.createElement('div');
                item.className = 'gallery-item gallery-item-selectable';
                item.innerHTML = `
                    <div class="image-slot">
                        ${master.image ? `<img src="${master.image}" alt="${master.name}" onerror="this.parentElement.innerHTML='<span class=\'placeholder-icon\'>🥋</span><p>${master.name}</p>'">` : `<span class="placeholder-icon">🥋</span><p>${master.name}</p>`}
                    </div>
                `;
                item.onclick = function() { selectMasterImage(master); };
                gallerySelect.appendChild(item);
            });
        }
    }
    
    // Populate select dropdown
    if (imageSelect) {
        let options = '<option value="">Choose from gallery...</option>';
        AppData.masters.forEach(master => {
            const selected = (master.name === document.getElementById('masterName').value) ? 'selected' : '';
            options += `<option value="${master.image || ''}" ${selected}>${master.name}</option>`;
        });
        imageSelect.innerHTML = options;
    }
    
    // Load admin gallery
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    if (AppData.masters.length === 0) {
        gallery.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1/-1;">No masters added yet.</p>';
        return;
    }
    
    AppData.masters.forEach(master => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <div class="image-slot">
                ${master.image ? `<img src="${master.image}" alt="${master.name}" onerror="this.parentElement.innerHTML='<span class=\'placeholder-icon\'>🥋</span><p>${master.name}</p>'">` : `<span class="placeholder-icon">🥋</span><p>${master.name}</p>`}
                <button onclick="deleteMaster(${master.id})" style="margin-top: 10px; padding: 5px 15px; background: var(--primary-color); color: white; border: none; border-radius: 15px; cursor: pointer;">Remove</button>
            </div>
        `;
        gallery.appendChild(item);
    });
}

// Select master image
function selectMasterImage(master) {
    document.getElementById('masterName').value = master.name;
    document.getElementById('masterImage').value = master.image || '';
    showNotification('Selected: ' + master.name, 'info');
}

// Delete master
function deleteMaster(id) {
    if (confirm('Are you sure you want to remove this master?')) {
        AppData.masters = AppData.masters.filter(m => m.id !== id);
        saveData();
        loadMasters();
        loadAdminMasters();
        showNotification('Master removed successfully', 'success');
    }
}

// Load masters
function loadMasters() {
    const gallery = document.getElementById('mastersGallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    const displayMasters = AppData.masters.length > 0 ? AppData.masters : [
        { name: 'Master 1' },
        { name: 'Master 2' },
        { name: 'Master 3' },
        { name: 'Master 4' }
    ];
    
    displayMasters.forEach((master, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        if (master.image) {
            item.innerHTML = `
                <div class="image-slot">
                    <img src="${master.image}" alt="${master.name}" onerror="this.parentElement.innerHTML='<span class=\\'placeholder-icon\\'>🥋</span><p>${master.name}</p>'">
                </div>
            `;
        } else {
            item.innerHTML = `
                <div class="image-slot">
                    <span class="placeholder-icon">🥋</span>
                    <p>${master.name}</p>
                </div>
            `;
        }
        
        gallery.appendChild(item);
    });
}

// ==================== EVENTS FUNCTIONS ====================

// Add event
function addEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value.trim();
    
    if (!title || !date) {
        showNotification('Please fill in event title and date', 'error');
        return;
    }
    
    const event = {
        id: Date.now(),
        title: title,
        date: date,
        description: description
    };
    
    AppData.events.push(event);
    saveData();
    loadEvents();
    
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventDescription').value = '';
    
    showNotification('Event added successfully', 'success');
}

// Load events
function loadEvents() {
    const eventsList = document.getElementById('eventsList');
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    if (AppData.events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No events scheduled yet.</p>';
        return;
    }
    
    AppData.events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.innerHTML = `
            <div class="event-info">
                <h4>${event.title}</h4>
                <p>${event.date} - ${event.description}</p>
            </div>
            <button onclick="deleteEvent(${event.id})" style="padding: 5px 15px; background: var(--primary-color); color: white; border: none; border-radius: 15px; cursor: pointer;">Remove</button>
        `;
        eventsList.appendChild(item);
    });
}

// Delete event
function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        AppData.events = AppData.events.filter(e => e.id !== id);
        saveData();
        loadEvents();
        showNotification('Event deleted successfully', 'success');
    }
}

// ==================== VIDEO MANAGEMENT FUNCTIONS ====================

// Load video configuration for admin
function loadVideoConfiguration() {
    const sections = ['basics', 'kata', 'kumite'];
    
    sections.forEach(section => {
        const container = document.getElementById(`${section}VideosConfig`);
        if (!container) return;
        
        // Add video form at the top
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        let galleryOptions = '<option value="">Custom Image URL</option>';
        
        // Add champions
        AppData.champions.forEach((champ, idx) => {
            galleryOptions += `<option value="${champ.image || ''}">Champion: ${champ.name}</option>`;
        });
        
        // Add masters
        AppData.masters.forEach((master, idx) => {
            galleryOptions += `<option value="${master.image || ''}">Master: ${master.name}</option>`;
        });
        
        container.innerHTML = `
            <div class="add-video-form">
                <h5>Add New Video to ${sectionName}</h5>
                <div class="form-row">
                    <input type="text" id="${section}Title" placeholder="Video Title" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
                    <select id="${section}Belt" style="padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
                        ${BELT_LEVELS.map(b => `<option value="${b.level}">${b.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <textarea id="${section}Desc" placeholder="Description" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; min-height: 60px;"></textarea>
                </div>
                <div class="form-row">
                    <input type="text" id="${section}VideoUrl" placeholder="YouTube Video URL (optional)" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px;">
                </div>
                <div class="form-row">
                    <input type="file" id="${section}ImageFile" accept="image/*" onchange="handleVideoImageSelect(this, '${section}')" style="display: none;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${section}ImageFile').click()" style="padding: 10px 20px;">Choose Image from Gallery</button>
                    <input type="text" id="${section}Image" placeholder="Selected image URL" readonly style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; margin-left: 10px;">
                    <div id="${section}ImagePreview" style="margin-left: 10px;"></div>
                </div>
                <button class="btn btn-primary" onclick="addVideo('${section}')">Add Video</button>
            </div>
            <h5 style="margin-top: 30px;">Manage ${sectionName} Videos</h5>
        `;
        
        // Load existing videos
        const videos = AppData.videoRequirements[section] || [];
        
        videos.forEach((video, index) => {
            const item = document.createElement('div');
            item.className = 'video-config-item';
            
            // Build belt options
            let beltOptions = '';
            BELT_LEVELS.forEach(belt => {
                const selected = video.requiredBelt === belt.level ? 'selected' : '';
                beltOptions += `<option value="${belt.level}" ${selected}>${belt.name}</option>`;
            });
            
            item.innerHTML = `
                <div class="video-info">
                    <h5>${video.title}</h5>
                    <p>${video.description}</p>
                    <small>Requires: ${BELT_LEVELS.find(b => b.level === video.requiredBelt)?.name || 'Unknown'}</small>
                </div>
                <div class="config-actions">
                    <select onchange="updateVideoBelt('${section}', ${index}, this.value)">
                        ${beltOptions}
                    </select>
                    <button onclick="deleteVideo('${section}', ${index})" style="padding: 8px 15px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">Delete</button>
                </div>
            `;
            
            container.appendChild(item);
        });
    });
}

// Toggle custom image input
function toggleCustomImageInput(section) {
    const select = document.getElementById(`${section}Image`);
    const customInput = document.getElementById(`${section}CustomImage`);
    if (select.value === '') {
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
    }
}

// Add new video
function addVideo(section) {
    const title = document.getElementById(`${section}Title`).value.trim();
    const belt = parseInt(document.getElementById(`${section}Belt`).value);
    const desc = document.getElementById(`${section}Desc`).value.trim();
    const videoUrl = document.getElementById(`${section}VideoUrl`).value.trim();
    const image = document.getElementById(`${section}Image`).value.trim() || null;
    
    if (!title) {
        showNotification('Please enter a video title', 'error');
        return;
    }
    
    const newVideo = {
        id: `${section}-${Date.now()}`,
        title: title,
        requiredBelt: belt,
        description: desc,
        videoUrl: videoUrl,
        image: image
    };
    
    if (!AppData.videoRequirements[section]) {
        AppData.videoRequirements[section] = [];
    }
    
    AppData.videoRequirements[section].push(newVideo);
    saveData();
    loadVideoConfiguration();
    renderAllVideos();
    
    // Clear form
    document.getElementById(`${section}Title`).value = '';
    document.getElementById(`${section}Desc`).value = '';
    document.getElementById(`${section}VideoUrl`).value = '';
    document.getElementById(`${section}Image`).value = '';
    document.getElementById(`${section}ImagePreview`).innerHTML = '';
    
    showNotification(`Video "${title}" added to ${section}!`, 'success');
}

// Delete video
function deleteVideo(section, index) {
    if (confirm('Are you sure you want to delete this video?')) {
        AppData.videoRequirements[section].splice(index, 1);
        saveData();
        loadVideoConfiguration();
        renderAllVideos();
        showNotification('Video deleted successfully', 'success');
    }
}

// Update video belt requirement
function updateVideoBelt(section, index, level) {
    if (AppData.videoRequirements[section] && AppData.videoRequirements[section][index]) {
        const beltName = BELT_LEVELS.find(b => b.level === parseInt(level))?.name || 'Unknown';
        AppData.videoRequirements[section][index].requiredBelt = parseInt(level);
        saveData();
        renderAllVideos();
        showNotification(`${AppData.videoRequirements[section][index].title} now requires ${beltName}`, 'info');
    }
}

// Save all video requirements
function saveVideoRequirements() {
    saveData();
    updateVideoLocks();
    showNotification('Video access settings saved successfully!', 'success');
}

// ==================== ADMIN FUNCTIONS ====================

// Show admin panel
function showAdminPanel() {
    const adminSection = document.getElementById('admin');
    if (adminSection) {
        adminSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Admin login
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'Max') {
        AppData.adminLoggedIn = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        showNotification('Admin logged in successfully', 'success');
        
        // Load all admin data
        loadMembers();
        loadAdminChampions();
        loadAdminMasters();
        loadEvents();
        loadVideoConfiguration();
    } else {
        showNotification('Invalid password', 'error');
    }
}

// Admin logout
function logoutAdmin() {
    AppData.adminLoggedIn = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    showNotification('Admin logged out successfully', 'info');
}

// Show admin tab
function showAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}Tab`).style.display = 'block';
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ==================== JOIN FORM ====================

// Handle join form submission
function handleJoinForm(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        age: document.getElementById('age').value,
        experience: document.getElementById('experience').value,
        goals: document.getElementById('goals').value.trim()
    };
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.age) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const member = registerMember(formData);
    
    showNotification(`Application submitted! Your Member ID is: ${member.id}`, 'success');
    
    // Reset form
    document.getElementById('joinForm').reset();
    
    // Scroll to membership section
    setTimeout(() => {
        document.getElementById('membership').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// ==================== INITIALIZATION ====================

// Initialize the application
function init() {
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup smooth scrolling
    setupSmoothScroll();
    
    // Setup scroll event for navigation
    window.addEventListener('scroll', updateActiveNav);
    
    // Render all videos from configuration
    renderAllVideos();
    
    // Load initial data
    loadChampions();
    loadMasters();
    
    // Setup join form
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', handleJoinForm);
    }
    
    // Setup admin password enter key
    const adminPassword = document.getElementById('adminPassword');
    if (adminPassword) {
        adminPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginAdmin();
            }
        });
    }
    
    // Setup member ID enter key
    const memberIdInput = document.getElementById('memberIdInput');
    if (memberIdInput) {
        memberIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginMember();
            }
        });
    }
    
    // Setup video modal
    setupVideoModal();
    
    console.log('Karate Academy initialized successfully!');
}

// ==================== GALLERY MODAL FUNCTIONS ====================

// Handle image selection from device gallery
function handleImageSelect(input, targetInputId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(targetInputId).value = e.target.result;
            
            // Show preview
            const previewId = targetInputId.replace('Image', 'ImagePreview');
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">`;
            }
            
            showNotification('Image selected successfully', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Handle video image selection (also clears file input after use)
function handleVideoImageSelect(input, section) {
    handleImageSelect(input, `${section}Image`);
    // Clear the file input so the same file can be selected again if needed
    input.value = '';
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);
