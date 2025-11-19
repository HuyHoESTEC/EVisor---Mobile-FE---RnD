import React from "react";
import MenuCard from "../../components/Shared/MenuCard";

const HomeScreen = ({ user, onLogout, onNavigate }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="header-title">Menu Chính</h1>
            </header>
            <main className="app-main">
                <p className="user-info">Chào mừng, **{user.owner}**</p>
                <div className="menu-grid">
                    <MenuCard 
                        icon="🔍"
                        title="Scan/Nhập liệu"
                        onClick={() => onNavigate('SCAN_MENU')}
                    />
                    <MenuCard 
                        icon="ℹ️"
                        title="Thông tin"
                        onClick={() => onNavigate('INFO')}
                    />
                </div>
            </main>
            <button className="btn-secondary" onClick={onLogout}>
                Đăng xuất
            </button>
        </div>
    );
};

export default HomeScreen;