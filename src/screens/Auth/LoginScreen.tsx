import React, { ChangeEvent, useState } from "react"
import { loginUser } from "../../api";
import '../../style/LoginScreen.css';
import { ToastType, User } from "../../types/common";

interface LoginScreenProps {
    onLogin: (user: User) => void;
    onToast: (message: string, type: ToastType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onToast }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!username || !password) {
            onToast("Vui lòng điền Tên đăng nhập và Mật khẩu.", 'error');
            return;
        }
        setIsLoading(true);
        try {
            const userData: User = await loginUser({ username, password });
            onLogin(userData);
            onToast("Đăng nhập thành công!", 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
            onToast(`Lỗi: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handeUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const loginClasses = `btn-primary btn-primary-blue ${isLoading ? 'btn-loading' : ''}`;

    return (
        <div className="login-container">
            <header className="app-header">
                <h1 className="header-title">Đăng nhập hệ thống</h1>
            </header>
            <main className="app-main">
                <div className="step-card">
                    <label className="form-label">Tên đăng nhập</label>
                    <input 
                        className="input-field"
                        type="text"
                        value={username}
                        onChange={handeUsernameChange}
                        placeholder="Tên đăng nhập"
                        disabled={isLoading}
                    />
                    <label className="form-label">Mật khẩu</label>
                    <input 
                        className="input-field"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Mật khẩu"
                        disabled={isLoading}
                    />
                    <button
                        className={loginClasses}
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'ĐANG XỬ LÝ...' : "ĐĂNG NHẬP"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LoginScreen;