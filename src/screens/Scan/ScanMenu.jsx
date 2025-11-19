import React from "react";
import MenuCard from "../../components/Shared/MenuCard";

const ScanMenu = ({ onNavigate }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="header-title">Chọn Loại Hoạt Động</h1>
            </header>
            <main className="app-main">
                <div className="menu-grid">
                    <MenuCard 
                        icon="📦"
                        title="Nhập Kho"
                        onClick={() => onNavigate('INVENTORY_FORM')}
                    />
                    <MenuCard 
                        icon="🛠️"
                        title="Lắp Đặt"
                        onClick={() => onNavigate('INSTALLATION_FORM')}
                    />
                </div>
            </main>
            <button className="btn-secondary" onClick={() => onNavigate('HOME')}>
                &larr; Quay lại menu Chính
            </button>
        </div>
    );
};

export default ScanMenu;