import { authAPI, attendanceAPI, leaveAPI } from './api.js';
import { showToast, formatDate, formatTime, formatHours, getStatusBadge, checkAuth, handleLogout } from './utils.js';
if (!checkAuth()) {
    window.location.href = 'index.html';
}
const userNameEl = document.getElementById('userName');
const presentDaysEl = document.getElementById('presentDays');
const halfDaysEl = document.getElementById('halfDays');
const absentDaysEl = document.getElementById('absentDays');
const totalLeavesEl = document.getElementById('totalLeaves');
const todayStatusEl = document.getElementById('todayStatus');
const todayPunchInEl = document.getElementById('todayPunchIn');
const todayPunchOutEl = document.getElementById('todayPunchOut');
const todayTotalHoursEl = document.getElementById('todayTotalHours');
const recentActivityEl = document.getElementById('recentActivity');
const logoutBtn = document.getElementById('logoutBtn');
async function loadDashboard() {
    try {
        const userData = await authAPI.getMe();
        if (userData.success && userData.data) {
            userNameEl.textContent = userData.data.name || 'User';
        }
        const attendanceData = await attendanceAPI.getHistory();
        if (attendanceData.success && attendanceData.data) {
            updateStats(attendanceData.data);
            updateTodayAttendance(attendanceData.data);
            updateRecentActivity(attendanceData.data);
        }
        const leaveData = await leaveAPI.getHistory();
        if (leaveData.success && leaveData.data) {
            totalLeavesEl.textContent = leaveData.data.length || 0;
        }
    } catch (error) {
        showToast('Failed to load dashboard data', 'error');
        console.error('Dashboard error:', error);
    }
}
function updateStats(attendanceRecords) {
    let present = 0, half = 0, absent = 0;
    attendanceRecords.forEach(record => {
        if (record.status === 'Full Day') present++;
        else if (record.status === 'Half Day') half++;
        else absent++;
    });
    presentDaysEl.textContent = present;
    halfDaysEl.textContent = half;
    absentDaysEl.textContent = absent;
}
function updateTodayAttendance(records) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = records.find(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
    });
    if (todayRecord) {
        const status = todayRecord.status || 'Absent';
        todayStatusEl.innerHTML = `
            <i class="fas ${status === 'Full Day' ? 'fa-check-circle' : status === 'Half Day' ? 'fa-clock' : 'fa-times-circle'}"></i>
            <span>${status}</span>
        `;
        todayStatusEl.className = 'status-indicator';
        if (todayRecord.punchIn) todayStatusEl.classList.add('punched-in');
        todayPunchInEl.textContent = formatTime(todayRecord.punchIn);
        todayPunchOutEl.textContent = formatTime(todayRecord.punchOut);
        todayTotalHoursEl.textContent = formatHours(todayRecord.totalHours);
    } else {
        todayStatusEl.innerHTML = `
            <i class="fas fa-hourglass-half"></i>
            <span>Not Punched In</span>
        `;
        todayPunchInEl.textContent = '--:--';
        todayPunchOutEl.textContent = '--:--';
        todayTotalHoursEl.textContent = '0.00';
    }
}
function updateRecentActivity(records) {
    const recent = records.slice(0, 5);
    if (recent.length === 0) {
        recentActivityEl.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    let html = '';
    recent.forEach(record => {
        const status = record.status || 'Absent';
        const statusBadge = getStatusBadge(status);
        html += `
            <div class="activity-item">
                <div class="activity-date">${formatDate(record.date)}</div>
                <div class="activity-details">
                    <span>Punch In: ${formatTime(record.punchIn)}</span>
                    <span>Punch Out: ${formatTime(record.punchOut)}</span>
                    <span>Hours: ${formatHours(record.totalHours)}</span>
                </div>
                <div class="activity-status">${statusBadge}</div>
            </div>
        `;
    });
    recentActivityEl.innerHTML = html;
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await authAPI.logout();
            handleLogout();
        } catch (error) {
            handleLogout();
        }
    });
}
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}
loadDashboard();
setInterval(loadDashboard, 60000);
