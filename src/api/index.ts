import axios, { AxiosError } from "axios";
import { LoginPayload, User, SubmitPayload, SubmitFormType, LoginResponse, AUTH_FAILURE_MESSAGE } from "../types/common";

const API_BASE: string = (import.meta as any).env.VITE_EVS_API_BASE;
const FORM_1_API: string = `${API_BASE}/WS/WarehouseImport/Scan/Form1`;
const FORM_2_API: string = `${API_BASE}/WS/WarehouseImport/Scan/Form2`;
const FORM_INSTALLATION_API:string = `${API_BASE}/WS/WarehouseInstallation/Scan/Form1`;
const LOGIN_API:string = `${API_BASE}/Login`;

export const loginUser = async ({ username, password }: LoginPayload): Promise<User> => {
    const LoginPayload: LoginPayload = { username, password };
    try {
        const response = await axios.post<LoginResponse>(LOGIN_API, LoginPayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.data.authentication === 'success' && response.data.status === 'success') {
            if (!response.data.user_id || !response.data.session_id || !response.data.expires_at) {
                throw new Error("Phản hồi máy chủ thiếu thông tin phiên làm việc.");
            }

            return {
                owner: response.data.user_id,
                token: response.data.session_id,
                expires_at: response.data.expires_at,
            } as User;
        } else if (response.data.authentication === 'failed') {
            const authError = new Error(`${AUTH_FAILURE_MESSAGE}`);
            return Promise.reject(authError);
        }
        const unexpectedMessage = response.data.message || "Đăng nhập thất bại do phản hồi không mong muốn!";
        return Promise.reject(new Error(unexpectedMessage));
    } catch (error) {
        let errorMessage: string = "Lỗi kết nối mạng hoặc máy chủ không phản hồi.";
        const axiosError = error as AxiosError;
        // Resolve error HTTP (Examp: 404, 500)
        if (axiosError.response) {
            const serverMessage = (axiosError.response.data as any)?.message;
            errorMessage = serverMessage || `Lỗi API (Status: ${axiosError.response.status})`;
        // Resolve request error (Examp: No connect internet)
        } else if (axiosError.request) {
            errorMessage = "Máy chủ không phản hồi. Vui lòng kiểm tra kết nối mạng.";
        }
        throw new Error(errorMessage);
    }
};

export const submitFormData = async ({ data, formType }: { data: SubmitPayload, formType: SubmitFormType }): Promise<any> => {
    let endpoint: string;

    if (formType === 1) {
        endpoint = FORM_1_API;
    } else if (formType === 2) {
        endpoint = FORM_2_API;
    } else if (formType === 'INSTALLATION') {
        endpoint = FORM_INSTALLATION_API;
    } else {
        throw new Error("Loại Form không hợp lệ.");
    }
    console.log(`---Gửi dữ liệu Form ${formType} đến Endpoint: ${endpoint}---`, data);
    try {
        const response = await axios.post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        let errorMessage: string = "Lỗi kết nối mạng hoặc Server không phản hồi.";
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            const serverMessage = (axiosError.response.data as any)?.message;
            errorMessage = serverMessage || `Lỗi API (Status: ${axiosError.response.status})`;
        } else if (axiosError.request) {
            errorMessage = "Server không phản hồi. Vui lòng kiểm tra kết nối mạng.";
        }
        throw new Error(errorMessage);
    }
};