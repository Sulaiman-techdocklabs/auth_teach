const API_URL = 'http://localhost:5000/api';
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};
export const getToken = () => {
    return localStorage.getItem('token');
};
export const isAuthenticated = () => {
    return !!getToken();
};
export const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        ...options,
        headers
    };
    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'API request failed');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
export const authAPI = {
    signup: (data) => apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    login: (data) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    sendLoginOTP: (data) => apiRequest('/auth/login-otp/send', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    verifyLoginOTP: (data) => apiRequest('/auth/login-otp/verify', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    forgotPassword: (data) => apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    resetPassword: (data) => apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getMe: () => apiRequest('/auth/me'),
    logout: () => apiRequest('/auth/logout', {
        method: 'POST'
    })
};
export const attendanceAPI = {
    getHistory: () => apiRequest('/attendance'),
    punchIn: () => apiRequest('/attendance/punch-in', {
        method: 'POST'
    }),
    punchOut: () => apiRequest('/attendance/punch-out', {
        method: 'POST'
    })
};
export const leaveAPI = {
    getHistory: () => apiRequest('/leaves'),
    apply: (data) => apiRequest('/leaves', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
