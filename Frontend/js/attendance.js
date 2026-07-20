import { authAPI, attendanceAPI } from './api.js';
import { showToast, formatDate, formatTime, formatHours, getStatusBadge, checkAuth, handleLogout } from './utils.js';
if (!checkAuth()) {
    window.location.href = 'index.html';
}
const userNameEl = document.getElementById('userName');
const todayStatusEl = document.getElementById('todayStatus');
const todayPunchInEl = document.getElementById('todayPunchIn');
const todayPunchOutEl = document.getElementById('todayPunchOut');
const todayTotalHoursEl = document.getElementById('todayTotalHours');
const punchInBtn = document.getElementById('punchInBtn');
const punchOutBtn = document.getElementById('punchOutBtn');
const attendanceTableBody = document.getElementById('attendanceTableBody');
const logoutBtn = document.getElementById('logoutBtn');
async function loadAttendance() {
    try {
        const userData = await authAPI.getMe();
        if (userData.success && userData.data) {
            userNameEl.textContent = userData.data.name || 'User';
        }
        const data = await attendanceAPI.getHistory();
        if (data.success && data.data) {
            updateTodayAttendance(data.data);
            renderAttendanceHistory(data.data);
        }
    } catch (error) {
        showToast('Failed to load attendance data', 'error');
        console.error('Attendance error:', error);
    }
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
        if (todayRecord.punchOut) todayStatusEl.classList.add('punched-out');
        todayPunchInEl.textContent = formatTime(todayRecord.punchIn);
        todayPunchOutEl.textContent = formatTime(todayRecord.punchOut);
        todayTotalHoursEl.textContent = formatHours(todayRecord.totalHours);
        punchInBtn.disabled = true;
        punchOutBtn.disabled = !todayRecord.punchIn || !!todayRecord.punchOut;
    } else {
        todayStatusEl.innerHTML = `
            <i class="fas fa-hourglass-half"></i>
            <span>Not Punched In</span>
        `;
        todayStatusEl.className = 'status-indicator';
        todayPunchInEl.textContent = '--:--';
        todayPunchOutEl.textContent = '--:--';
        todayTotalHoursEl.textContent = '0.00';
        punchInBtn.disabled = false;
        punchOutBtn.disabled = true;
    }
}
function renderAttendanceHistory(records) {
    if (!records || records.length === 0) {
        attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No attendance records found</td>
            </tr>
        `;
        return;
    }
    let html = '';
    records.forEach(record => {
        const statusBadge = getStatusBadge(record.status || 'Absent');
        html += `
            <tr>
                <td>${formatDate(record.date)}</td>
                <td>${formatTime(record.punchIn)}</td>
                <td>${formatTime(record.punchOut)}</td>
                <td>${formatHours(record.totalHours)}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    attendanceTableBody.innerHTML = html;
}
if (punchInBtn) {
    punchInBtn.addEventListener('click', async () => {
        try {
            punchInBtn.disabled = true;
            punchInBtn.textContent = 'Processing...';
            const data = await attendanceAPI.punchIn();
            showToast('Punch In successful!', 'success');
            await loadAttendance();
            punchInBtn.textContent = '<i class="fas fa-fingerprint"></i> Punch In';
        } catch (error) {
            showToast(error.message, 'error');
            punchInBtn.disabled = false;
            punchInBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Punch In';
        }
    });
}
if (punchOutBtn) {
    punchOutBtn.addEventListener('click', async () => {
        try {
            punchOutBtn.disabled = true;
            punchOutBtn.textContent = 'Processing...';
            const data = await attendanceAPI.punchOut();
            showToast('Punch Out successful!', 'success');
            await loadAttendance();
            punchOutBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Punch Out';
        } catch (error) {
            showToast(error.message, 'error');
            punchOutBtn.disabled = false;
            punchOutBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Punch Out';
        }
    });
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
loadAttendance();
setInterval(loadAttendance, 30000);
