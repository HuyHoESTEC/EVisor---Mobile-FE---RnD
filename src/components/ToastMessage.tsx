import React, { useEffect } from "react"
import '../style/ToastMessage.css';
import { ToastType } from "../types/common";

interface ToastMessageProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ message, type, onClose }) => {
    // Auto close Toast after 3.5 seconds
    useEffect(() => {
        if (!message) return; // Don't run timer if do not message
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const typeClasses = type === 'success'
        ? 'toast-success'
        : 'toast-error';
    
    const icon = type === 'success' ? (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );

    return (
        <div className={`toast-base ${typeClasses}`} role='alert'>
            {icon}
            <div className="flex-grow">
                <span className="font-medium text-sm">{message}</span>
            </div>
            <button
                onClick={onClose}
                className="toast-close-button"
                arial-label="Đóng"
            >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};