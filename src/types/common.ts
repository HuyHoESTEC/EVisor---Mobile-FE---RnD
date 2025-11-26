export interface User {
    owner: string;
    token: string;
    expires_at: string;
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
// Data type for list (Project, PO)
export interface SelectOption {
    label: string;
    value: string;
}
// Payload for loginUser function
export interface LoginPayload {
    username: string;
    password: string;
}
// Type for formType parameter in submitFormData
export type SubmitFormType = 1 | 2 | 'INSTALLATION';
// Payload for Inventory Code Form (Form 1)
export interface InventoryCodeForm {
    project_code: string;
    po: string;
    code: string;
}
// Payload for Inventory PartNumber/SeriNum Form (Form 2)
export interface InventoryPartNoForm {
    project_code: string;
    po: string;
    part_no: string;
    seri_no: string;
}
// Payload for Installation Form ('INSTALLATION' form)
export interface InstallationForm {
    project_code: string;
    location: string;
    cabinet_no: string;
    code: string;
}
// Union for all form constructor
export type AllFormTypes = InventoryCodeForm | InventoryPartNoForm | InstallationForm;
// Payload complete constructor send to API
export interface SubmitPayload {
    request_id: string;
    form: AllFormTypes;
} 

export interface LoginResponse {
    status: string;
    authentication: string;
    user_id?: string; // Use to owner
    full_name: string;
    message: string;
    session_id?: string; // Use to token
    expires_at?: string; // Use to calculator expire time
}

export const AUTH_FAILURE_MESSAGE = "Tên đăng nhập hoặc mật khẩu không đúng!";