import React from "react";
import '../../style/MenuCard.css';

interface MenuCardProps {
    icon: string;
    title: string;
    onClick: () => void;
    disabled?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, onClick, disabled })  => {
    return (
        <button
            className="menu-card"                                           
            onClick={onClick}
            disabled={disabled}
        >
            <span className="menu-card__icon">
                <img src={icon} alt={title} className="menu-card__icon-img" />
            </span>
            <h3 className="menu-card__title">{title}</h3>
        </button>
    );
};

export default MenuCard;