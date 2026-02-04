// Data Storage (LocalStorage mein save hoga)
let courses = JSON.parse(localStorage.getItem('courses')) || [
    {
        id: 1,
        title: "Stock Market Fundamentals",
        category: "Stock Market",
        description: "Learn the basics of stock market trading",
        price: 1999,
        originalPrice: 3999,
        duration: "12 Hours",
        level: "Beginner",
        thumbnail: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&q=80",
        password: "STOCK101",
        status: "published",
        videos: [
            { id: 1, title: "Introduction", url: "#", duration: "10:00", description: "Course intro" }
        ],
        students: 45
    }
];

let students = JSON.parse(localStorage.getItem('students')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    upiId: "yourupi@upi",
    merchantName: "TradeMaster Academy",
    siteTitle: "TradeMaster Pro",
    contactEmail: "support@trademaster.com",
    contactPhone: "+91 98765 43210"
};

// Current editing course
let currentEditingId = null;
let currentCourseId = null;

// Admin Login
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPass').value;
    
    if (username === 'admin' && password === 'admin123') {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        loadDashboard();
    } else {
        alert('Invalid credentials! Try admin/admin123');
    }
}

// Logout
function logout() {
    location.reload();
}

// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    // Remove active from nav
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(section + 'Section').classList.remove('hidden');
    event.target.classList.add('active');
    
    // Update title
    const titles = {
        'courses': 'Manage Courses',
        'videos': 'Manage Videos',
        'payments': 'Payment Settings',
        'students': 'Student Management',
        'settings': 'Website Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    // Load section data
    if (section === 'courses') renderCourses();
    if (section === 'videos') initVideosSection();
    if (section === 'payments') loadPaymentSettings();
    if (section === 'students') renderStudents();
    if (section === 'settings') loadSettings();
}

// Load Dashboard Stats
function loadDashboard() {
    updateStats();
    renderCourses();
}

function updateStats() {
    const totalCourses = courses.length;
    const totalVideos = courses.reduce((sum, c) => sum + (c.videos ? c.videos.length : 0), 0);
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0);
    const totalStudents = students.length;
    
    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('totalVideos').textContent = totalVideos;
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString();
    document.getElementById('totalStudents').textContent = totalStudents;
}

// COURSES MANAGEMENT
function renderCourses() {
    const tbody = document.getElementById('coursesTableBody');
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="course-info">
                    <img src="${course.thumbnail}" alt="${course.title}" onerror="this.src='https://via.placeholder.com/50x35'">
                    <div>
                        <h4>${course.title}</h4>
                        <span>${course.category} • ${course.level}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="price-tag">₹${course.price}</span>
                <span class="original-price">₹${course.originalPrice}</span>
            </td>
            <td>${course.videos ? course.videos.length : 0} videos</td>
            <td>${course.students || 0} students</td>
            <td>
                <span class="status-badge ${course.status === 'published' ? 'status-published' : 'status-draft'}">
                    ${course.status === 'published' ? 'Published' : 'Draft'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editCourse(${course.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCourse(${course.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openCourseModal() {
    currentEditingId = null;
    document.getElementById('courseModalTitle').textContent = 'Add New Course';
    document.getElementById('courseForm').reset();
    document.getElementById('courseModal').classList.add('active');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.remove('active');
}

function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    currentEditingId = id;
    document.getElementById('courseModalTitle').textContent = 'Edit Course';
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseTitle').value = course.title;
    document.getElementById('courseCategory').value = course.category;
    document.getElementById('courseDesc').value = course.description;
    document.getElementById('coursePrice').value = course.price;
    document.getElementById('courseOriginalPrice').value = course.originalPrice;
    document.getElementById('courseDuration').value = course.duration;
    document.getElementById('courseLevel').value = course.level;
    document.getElementById('courseThumbnail').value = course.thumbnail;
    document.getElementById('coursePassword').value = course.password;
    
    document.getElementById('courseModal').classList.add('active');
}

function saveCourse(e) {
    e.preventDefault();
    
    const courseData = {
        id: currentEditingId || Date.now(),
        title: document.getElementById('courseTitle').value,
        category: document.getElementById('courseCategory').value,
        description: document.getElementById('courseDesc').value,
        price: parseInt(document.getElementById('coursePrice').value),
        originalPrice: parseInt(document.getElementById('courseOriginalPrice').value),
        duration: document.getElementById('courseDuration').value,
        level: document.getElementById('courseLevel').value,
        thumbnail: document.getElementById('courseThumbnail').value || 'https://via.placeholder.com/400x300',
        password: document.getElementById('coursePassword').value,
        status: 'published',
        videos: currentEditingId ? (courses.find(c => c.id === currentEditingId)?.videos || []) : [],
        students: currentEditingId ? (courses.find(c => c.id === currentEditingId)?.students || 0) : 0
    };
    
    if (currentEditingId) {
        const index = courses.findIndex(c => c.id === currentEditingId);
        courses[index] = courseData;
    } else {
        courses.push(courseData);
    }
    
    localStorage.setItem('courses', JSON.stringify(courses));
    closeCourseModal();
    renderCourses();
    updateStats();
    alert('Course saved successfully!');
}

function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();
    updateStats();
}

// VIDEOS MANAGEMENT
function initVideosSection() {
    const select = document.getElementById('courseSelect');
    select.innerHTML = '<option value="">Select Course</option>';
    courses.forEach(course => {
        select.innerHTML += `<option value="${course.id}">${course.title}</option>`;
    });
}

function loadVideos() {
    const courseId = parseInt(document.getElementById('courseSelect').value);
    currentCourseId = courseId;
    const container = document.getElementById('videosGrid');
    
    if (!courseId) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Select a course to view videos</p>';
        return;
    }
    
    const course = courses.find(c => c.id === courseId);
    const videos = course.videos || [];
    
    container.innerHTML = '';
    videos.forEach((video, index) => {
        container.innerHTML += `
            <div class="video-card">
                <div class="video-thumbnail">
                    <i class="fas fa-play-circle"></i>
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                    <div class="video-meta">
                        <span>Video ${index + 1}</span>
                        <button class="btn-icon btn-delete" onclick="deleteVideo(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No videos added yet</p>';
    }
}

function openVideoModal() {
    if (!currentCourseId) {
        alert('Please select a course first');
        return;
    }
    document.getElementById('videoModal').classList.add('active');
}

function closeVideoModal() {
    document.getElementById('videoModal').classList.remove('active');
}

function saveVideo(e) {
    e.preventDefault();
    
    const course = courses.find(c => c.id === currentCourseId);
    if (!course.videos) course.videos = [];
    
    const videoData = {
        id: Date.now(),
        title: document.getElementById('videoTitle').value,
        url: document.getElementById('videoUrl').value,
        description: document.getElementById('videoDesc').value,
        duration: document.getElementById('videoDuration').value
    };
    
    course.videos.push(videoData);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    closeVideoModal();
    loadVideos();
    updateStats();
    document.getElementById('videoForm').reset();
    alert('Video added successfully!');
}

function deleteVideo(index) {
    if (!confirm('Delete this video?')) return;
    const course = courses.find(c => c.id === currentCourseId);
    course.videos.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    loadVideos();
    updateStats();
}

// PAYMENT SETTINGS
function loadPaymentSettings() {
    document.getElementById('upiId').value = settings.upiId;
    document.getElementById('merchantName').value = settings.merchantName;
    
    // Load transactions
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">No transactions yet</td></tr>';
        return;
    }
    
    transactions.forEach(t => {
        tbody.innerHTML += `
            <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.studentName}</td>
                <td>${t.courseName}</td>
                <td>₹${t.amount}</td>
                <td>
                    <span class="status-badge ${t.status === 'completed' ? 'status-published' : 'status-draft'}">
                        ${t.status}
                    </span>
                </td>
            </tr>
        `;
    });
}

function saveUpiSettings() {
    settings.upiId = document.getElementById('upiId').value;
    settings.merchantName = document.getElementById('merchantName').value;
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('UPI settings saved!');
}

function saveBankSettings() {
    settings.accountNumber = document.getElementById('accountNumber').value;
    settings.ifscCode = document.getElementById('ifscCode').value;
    settings.accountHolder = document.getElementById('accountHolder').value;
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Bank details saved!');
}

// STUDENTS MANAGEMENT
function renderStudents() {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">No students enrolled yet</td></tr>';
        return;
    }
    
    students.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.courses ? s.courses.length : 0} courses</td>
                <td>${new Date(s.joinDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn-icon btn-edit" onclick="viewStudent(${s.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function viewStudent(id) {
    const student = students.find(s => s.id === id);
    alert(`Student: ${student.name}\nEmail: ${student.email}\nCourses: ${student.courses ? student.courses.join(', ') : 'None'}`);
}

// WEBSITE SETTINGS
function loadSettings() {
    document.getElementById('siteTitle').value = settings.siteTitle;
    document.getElementById('contactEmail').value = settings.contactEmail;
    document.getElementById('contactPhone').value = settings.contactPhone;
}

function saveSiteSettings() {
    settings.siteTitle = document.getElementById('siteTitle').value;
    settings.contactEmail = document.getElementById('contactEmail').value;
    settings.contactPhone = document.getElementById('contactPhone').value;
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved!');
}

// View Website
function viewWebsite() {
    window.open('index.html', '_blank');
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
