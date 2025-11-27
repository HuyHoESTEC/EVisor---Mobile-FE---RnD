import React from "react";
import '../../style/ScanMenu.css';
import ScanIco from '../../assets/icon/scan.png';
import MenuIco from '../../assets/icon/menu.png';
import EnteredWarehouseIco from '../../assets/icon/entered_warehouse.png';
import ExportWarehouseIco from '../../assets/icon/export_warehouse.png';
import InstallationDeviceIco from '../../assets/icon/installation_device.png';
import GotoIco from '../../assets/icon/goto.png';
import { ScreenType } from "../../types/common";

interface ScanMenuProps {
    onNavigate: (screen: ScreenType) => void;
}

const ScanMenu: React.FC<ScanMenuProps> = ({ onNavigate }) => {
    const renderCard = (image: string, title: string, actionKey: ScreenType) => (
        <button className="scan-card" onClick={() => onNavigate(actionKey)}>
            <img src={image} alt={title} className="scan-card-img" />
            <span className="scan-card-text">{title}</span>
            <div className="scan-card-arrow">
                <img src={GotoIco} alt="Go" className="go-back-img" />
            </div>
        </button>
    );

    return (
        <div className="scan-container">
            <header className="scan-header">
                <div className="scan-header-left">
                    <img src={ScanIco} alt="Scan" className="scan-header-icon" />
                    <h1 className="scan-title">Scan / Nhập Liệu</h1>
                </div>
                <button className="scan-menu-btn" onClick={() => onNavigate('HOME')}>
                    <img src={MenuIco} alt="Menu" className="scan-menu-icon" />
                </button>
            </header>
            <main className="scan-list">
                {renderCard(EnteredWarehouseIco, "Nhập Kho", 'INVENTORY_FORM')}
                {renderCard(ExportWarehouseIco, "Xuất Kho", 'EXPORT_FORM')}
                {renderCard(InstallationDeviceIco, "Lắp Đặt", 'INSTALLATION_FORM')}
            </main>
        </div>
    );
};

export default ScanMenu;