import { authAPI, setToken } from './api.js';
import { showToast, togglePasswordVisibility } from './utils.js';
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotForm = document.getElementById('forgotForm');
const resetForm = document.getElementById('resetForm');
const otpSendForm = document.getElementById('otpSendForm');
const otpVerifyForm = document.getElementById('otpVerifyForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        try {
            const data = await authAPI.login({ identifiers: identifier, password });
            setToken(data.data.token);
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        try {
            const data = await authAPI.signup({ name, email, password, username });
            setToken(data.data.token);
            showToast('Account created! Please verify your email.', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
if (otpSendForm) {
    otpSendForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('otpEmail').value;
        try {
            await authAPI.sendLoginOTP({ identifiers: email });
            showToast('OTP sent to your email!', 'success');
            otpSendForm.style.display = 'none';
            otpVerifyForm.style.display = 'flex';
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
if (otpVerifyForm) {
    otpVerifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('otpEmail').value;
        const otp = document.getElementById('otpCode').value;
        try {
            const data = await authAPI.verifyLoginOTP({ email, otp });
            setToken(data.data.token);
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        try {
            await authAPI.forgotPassword({ email });
            showToast('OTP sent to your email!', 'success');
            forgotForm.style.display = 'none';
            resetForm.style.display = 'flex';
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;
        const otp = document.getElementById('resetOTP').value;
        const newPassword = document.getElementById('newPassword').value;
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            showToast('Password reset successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}
window.showSignup = () => {
    document.querySelectorAll('.auth-card').forEach(card => card.style.display = 'none');
    document.getElementById('signupCard').style.display = 'block';
};
window.showLogin = () => {
    document.querySelectorAll('.auth-card').forEach(card => card.style.display = 'none');
    document.querySelector('.auth-card').style.display = 'block';
};
window.showForgotPassword = () => {
    document.querySelectorAll('.auth-card').forEach(card => card.style.display = 'none');
    document.getElementById('forgotCard').style.display = 'block';
};
window.togglePasswordVisibility = togglePasswordVisibility;
if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}
