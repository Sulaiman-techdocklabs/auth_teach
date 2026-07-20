// Toast notification
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

// Format date
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Format time
export function formatTime(dateString) {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Format hours
export function formatHours(hours) {
    if (!hours) return '0.00';
    return hours.toFixed(2);
}

// Get status badge HTML
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

// Check if user is authenticated
export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Handle logout
export function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}