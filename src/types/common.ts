export interface User {
    owner: string;
}
// Define props for navigation/notification function
export interface BaseProps {
    user?: User;
    onToast: (message: string, type: 'success' | 'error' | 'info') => void;
    onBack: () => void;
    onNavigate?: (screen: string) => void;
}
// Interface for Project (Use at step 1)
export interface ProjectItem {
    value: string;
    label: string;
}

export type ToastType = 'success' | 'error' | 'info';

export type ScreenType = 
    | 'LOGIN'
    | 'HOME'
    | 'SCAN_MENU'
    | 'INVENTORY_FORM'
    | 'INSTALLATION_FORM'
    | 'SETTINGS'
    | 'INFORMATION'
    | 'DASHBOARD'
    | 'WORK_MANAGEMENT'
    | 'WAREHOUSE_MANAGEMENT'
    | 'INFO';

