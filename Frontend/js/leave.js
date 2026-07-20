import { authAPI, leaveAPI } from './api.js';
import { showToast, formatDate, getStatusBadge, checkAuth, handleLogout } from './utils.js';

if (!checkAuth()) {
    window.location.href = 'index.html';
}

const userNameEl = document.getElementById('userName');
const leaveForm = document.getElementById('leaveForm');
const leaveTableBody = document.getElementById('leaveTableBody');
const logoutBtn = document.getElementById('logoutBtn');

async function loadLeaves() {
    try {
        const userData = await authAPI.getMe();
        if (userData.success && userData.data) {
            userNameEl.textContent = userData.data.name || 'User';
        }
        const data = await leaveAPI.getHistory();
        if (data.success && data.data) {
            renderLeaveHistory(data.data);
        }
    } catch (error) {
        showToast('Failed to load leave data', 'error');
        console.error('Leave error:', error);
    }
}

function renderLeaveHistory(records) {
    if (!records || records.length === 0) {
        leaveTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="no-data">No leave records found</td>
            </tr>
        `;
        return;
    }
    let html = '';
    records.forEach(record => {
        const statusBadge = getStatusBadge(record.status || 'Pending');
        html += `
            <tr>
                <td>${formatDate(record.leaveDate)}</td>
                <td>${record.leaveType}</td>
                <td>${record.reason || '-'}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    leaveTableBody.innerHTML = html;
}

if (leaveForm) {
    leaveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const leaveType = document.getElementById('leaveType').value;
        const leaveDate = document.getElementById('leaveDate').value;
        const reason = document.getElementById('leaveReason').value;
        if (!leaveType || !leaveDate || !reason) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        try {
            const submitBtn = leaveForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Applying...';
            await leaveAPI.apply({ leaveType, leaveDate, reason });
            showToast('Leave applied successfully!', 'success');
            leaveForm.reset();
            await loadLeaves();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Apply for Leave';
        } catch (error) {
            showToast(error.message, 'error');
            const submitBtn = leaveForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Apply for Leave';
        }
    });
}

// FIXED: Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
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

const leaveDateInput = document.getElementById('leaveDate');
if (leaveDateInput) {
    const today = new Date().toISOString().split('T')[0];
    leaveDateInput.setAttribute('min', today);
}

loadLeaves();