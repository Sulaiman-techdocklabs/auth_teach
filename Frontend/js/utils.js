export function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
export function formatTime(dateString) {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}
export function formatHours(hours) {
    if (!hours) return '0.00';
    return hours.toFixed(2);
}
export function getStatusBadge(status) {
    const statusMap = {
        'Full Day': 'full-day',
        'Half Day': 'half-day',
        'Absent': 'absent',
        'Pending': 'pending',
        'Approved': 'approved',
        'Rejected': 'rejected'
    };
    const className = statusMap[status] || '';
    return `<span class="status-badge ${className}">${status}</span>`;
}
export function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}
export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
export function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
