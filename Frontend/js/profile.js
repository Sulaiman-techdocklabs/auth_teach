import { authAPI } from './api.js';
import { showToast, checkAuth, handleLogout } from './utils.js';
if (!checkAuth()) {
    window.location.href = 'index.html';
}
const userNameEl = document.getElementById('userName');
const profileNameEl = document.getElementById('profileName');
const profileFullNameEl = document.getElementById('profileFullName');
const profileUsernameEl = document.getElementById('profileUsername');
const profileEmailEl = document.getElementById('profileEmail');
const profileVerifiedEl = document.getElementById('profileVerified');
const profileProviderEl = document.getElementById('profileProvider');
const profileJoinedEl = document.getElementById('profileJoined');
const profileStatusEl = document.getElementById('profileStatus');
const logoutBtn = document.getElementById('logoutBtn');
async function loadProfile() {
    try {
        const data = await authAPI.getMe();
        if (data.success && data.data) {
            const user = data.data;
            userNameEl.textContent = user.name || 'User';
            profileNameEl.textContent = user.name || 'User';
            profileFullNameEl.textContent = user.name || '-';
            profileUsernameEl.textContent = user.username || '-';
            profileEmailEl.textContent = user.email || '-';
            if (user.isVerified) {
                profileVerifiedEl.textContent = '✅ Verified';
                profileStatusEl.textContent = 'Verified';
                profileStatusEl.className = 'badge verified';
            } else {
                profileVerifiedEl.textContent = '❌ Not Verified';
                profileStatusEl.textContent = 'Not Verified';
                profileStatusEl.className = 'badge unverified';
            }
            const providerMap = {
                'local': 'Local Account',
                'google': 'Google Account'
            };
            profileProviderEl.textContent = providerMap[user.authProvider] || user.authProvider || '-';
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                profileJoinedEl.textContent = date.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
            } else {
                profileJoinedEl.textContent = '-';
            }
        }
    } catch (error) {
        showToast('Failed to load profile data', 'error');
        console.error('Profile error:', error);
    }
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
loadProfile();
