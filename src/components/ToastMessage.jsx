import React, { useEffect } from "react"

/**
 * Component to display Toast notification
 * @param {object} props - Props of component
 * @param {string} props.message - Notification content
 * @param {string} props.type - Notification type ('success' or 'error')
 * @param {function} props.onClose - Function close notification
 */
export const ToastMessage = ({ message, type, onClose }) => {
    // Auto close Toast after 3.5 seconds
    useEffect(() => {
        if (!message) return; // Don't run timer if do not message
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const baseClass = 'fixed bottom-4 right-4 p-4 rounded-xl shadow-lg transition-opacity duration-300 z-50 flex items-center space-x-3 max-w-sm';
    const typeClasses = type === 'success'
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white';
    
    const icon = type === 'success' ? (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ) : (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );

    return (
        <div className={`${baseClass} ${typeClasses}`} role='alert'>
            {icon}
            <div className="flex-grow">
                <span className="font-medium text-sm">{message}</span>
            </div>
            <button
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50"
                arial-label="Đóng"
            >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};