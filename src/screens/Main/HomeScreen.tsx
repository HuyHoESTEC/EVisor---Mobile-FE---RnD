import React from "react";
import MenuCard from "../../components/Shared/MenuCard";
import ScanIcon from '../../assets/icon/scan.png';
import InformationIcon from '../../assets/icon/information.png';
import SettingIcon from '../../assets/icon/settings.png';
import DashboardIcon from '../../assets/icon/dashboard.png';
import WorkIcon from '../../assets/icon/work.png';
import WarehouseIcon from '../../assets/icon/warehouse.png';
import EstecLogo from '../../assets/logos/estec-logo.svg';
import LogoutIcon from '../../assets/icon/logout.png';
import UserIcon from '../../assets/icon/user.png';
import '../../style/HomeScreen.css';
import { ScreenType, User } from "../../types/common";

interface HomeScreenProps {
    user: User;
    onLogout: () => void;
    onNavigate: (screen: ScreenType) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onLogout, onNavigate }) => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="home-container">
            <div className="home-header">
                <div className="user-info">
                    <img src={UserIcon} className="user-info-logo" />
                    <b className="user-info-name">{user.owner}</b>
                </div>
                <img src={EstecLogo} className="home-header-logo" />
                <button className="btn-logout" onClick={onLogout}>
                    <img src={LogoutIcon} className="btn-logout-img" />
                </button>
            </div>
            <div className="home-menu">
                <div className="home-menu-grid">
                    <MenuCard 
                        icon={ScanIcon}
                        title="Scan / Nhập liệu"
                        onClick={() => onNavigate('SCAN_MENU')}
                        disabled={false}
                    />
                    <MenuCard 
                        icon={InformationIcon}
                        title="Information"
                        onClick={() => onNavigate('INFORMATION')}
                        disabled={true}
                    />
                    <MenuCard 
                        icon={SettingIcon}
                        title="Settings"
                        onClick={() => onNavigate('SETTINGS')}
                        disabled={true}
                    />
                    <MenuCard 
                        icon={DashboardIcon}
                        title="Dashboard"
                        onClick={() => onNavigate('DASHBOARD')}
                        disabled={true}
                    />
                    <MenuCard 
                        icon={WorkIcon}
                        title="Work"
                        onClick={() => onNavigate('WORK_MANAGEMENT')}
                        disabled={true}
                    />
                    <MenuCard 
                        icon={WarehouseIcon}
                        title="Warehouse"
                        onClick={() => onNavigate('WAREHOUSE_MANAGEMENT')}
                        disabled={true}
                    />
                </div>
            </div>
            <div className="footer">
                Sản phẩm của ESTEC Automation & Digitalization - Research and Development Department ©{currentYear}
            </div>
        </div>
    );
};

export default HomeScreen;