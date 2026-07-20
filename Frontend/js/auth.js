import { authAPI, setToken } from './api.js';
import { showToast } from './utils.js';

// Navigation functions
function showSignup() {
    document.querySelectorAll('.auth-card').forEach(card => {
        card.style.display = 'none';
    });
    const signupCard = document.getElementById('signupCard');
    if (signupCard) {
        signupCard.style.display = 'block';
    }
}

function showLogin() {
    document.querySelectorAll('.auth-card').forEach(card => {
        card.style.display = 'none';
    });
    const loginCard = document.getElementById('loginCard');
    if (loginCard) {
        loginCard.style.display = 'block';
    }
}

function showForgotPassword() {
    document.querySelectorAll('.auth-card').forEach(card => {
        card.style.display = 'none';
    });
    const forgotCard = document.getElementById('forgotCard');
    if (forgotCard) {
        forgotCard.style.display = 'block';
    }
}

// Make functions globally accessible for onclick
window.showSignup = showSignup;
window.showLogin = showLogin;
window.showForgotPassword = showForgotPassword;

// Toggle password visibility - make globally accessible
window.togglePassword = function(inputId, button) {
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
};

// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
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

    // Signup Form
    const signupForm = document.getElementById('signupForm');
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

    // OTP Send Form
    const otpSendForm = document.getElementById('otpSendForm');
    const otpVerifyForm = document.getElementById('otpVerifyForm');
    
    if (otpSendForm) {
        otpSendForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('otpEmail').value;

            try {
                await authAPI.sendLoginOTP({ identifiers: email });
                showToast('OTP sent to your email!', 'success');
                otpSendForm.style.display = 'none';
                if (otpVerifyForm) {
                    otpVerifyForm.style.display = 'flex';
                }
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // OTP Verify Form
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

    // Forgot Password Form
    const forgotForm = document.getElementById('forgotForm');
    const resetForm = document.getElementById('resetForm');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;

            try {
                await authAPI.forgotPassword({ email });
                showToast('OTP sent to your email!', 'success');
                forgotForm.style.display = 'none';
                if (resetForm) {
                    resetForm.style.display = 'flex';
                }
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Reset Password Form
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
});