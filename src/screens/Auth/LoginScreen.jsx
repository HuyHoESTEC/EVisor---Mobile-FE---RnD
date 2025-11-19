import { useState } from "react"
import { loginUser } from "../../api";

const LoginScreen = ({ onLogin, onToast }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            onToast("Vui lòng điền Tên đăng nhập và Mật khẩu.", 'error');
            return;
        }
        setIsLoading(true);
        try {
            const userData = await loginUser({ username, password });
            onLogin(userData);
            onToast("Đăng nhập thành công!", 'success');
        } catch (error) {
            onToast(`Lỗi: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const loginClasses = `btn-primary btn-primary-blue ${isLoading ? 'btn-loading' : ''}`;

    return (
        <div className="app-container">
            <header className="app-heade">
                <h1 className="header-title">Đăng nhập hệ thống</h1>
            </header>
            <main className="app-main">
                <div className="step-card">
                    <label className="form-label">Tên đăng nhập</label>
                    <input 
                        className="input-field"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Input your username"
                        disabled={isLoading}
                    />
                    <label className="form-label">Mật khẩu</label>
                    <input 
                        className="input-field"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Input your password"
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