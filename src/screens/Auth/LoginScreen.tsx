import React, { ChangeEvent, useState } from "react"
import '../../style/LoginScreen.css';
import { ToastType, User, AUTH_FAILURE_MESSAGE } from "../../types/common";
import { loginUser } from "../../api";
import EstecLogo from '../../assets/logos/estec-logo.svg';

interface LoginScreenProps {
    onLogin: (user: User) => void;
    onToast: (message: string, type: ToastType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onToast }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // State show error management inline
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');

    const handleLogin = async () => {
        // Reset error before validate
        setUsernameError('');
        setPasswordError('');
        setGeneralError('');

        let isValid = true;

        if (!username) {
            setUsernameError('Tên đăng nhập không được để trống!');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Mật khẩu không được để trống!');
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        setIsLoading(true);
        try {
            const userData: User = await loginUser({ username, password });
            onLogin(userData);
            onToast("Đăng nhập thành công!", 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";

            if (errorMessage.includes(AUTH_FAILURE_MESSAGE)) {
                setGeneralError(errorMessage);
            } else {
                onToast(`${errorMessage}`, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            handleLogin();
        } 
    };

    const handeUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setUsernameError(''); // Delete error when user start typing...
        setGeneralError('');
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(''); // Delete error when user start typing...
        setGeneralError('');
    };

    const loginClasses = `btn-primary login-button ${isLoading ? 'btn-loading' : ''}`;

    return (
        <div className="login-container">
            <div className="login-form-card">
                <div className="logo-section">
                    <img src={EstecLogo} alt="ESTEC Logo" className="estec-logo" />
                    <h2 className="login-title">Đăng Nhập</h2>
                </div>
                <div className="divider-line"></div>
                <label className="form-label">Tên đăng nhập:</label>
                <input 
                    className={`input-field input-field-grey ${usernameError || generalError ? 'input-error' : ''}`}
                    type="text"
                    value={username}
                    onChange={handeUsernameChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Nhập tên đăng nhập...'
                    disabled={isLoading}
                />
                {(usernameError || generalError) && (
                    <p className="error-text-inline">{generalError || usernameError}</p>
                )}
                <label className="form-label">Mật Khẩu:</label>
                <input 
                    className={`input-field input-field-grey ${passwordError || generalError ? 'input-error' : ''}`}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="*****"
                    disabled={isLoading}
                />
                {passwordError && (
                    <p className="error-text-inline">{passwordError}</p>
                )}
                <button
                    className={loginClasses}
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;