import axios from "axios";

const API_BASE = import.meta.env.EVS_API_BASE;
// const LOGIN_API = `${API_BASE}/Login`;
const FORM_1_API = `${API_BASE}/WS/WarehouseImport/Scan/Form1`;
const FORM_2_API = `${API_BASE}WS/WarehouseImport/Scan/Form2`;
const FORM_INSTALL_API = `${API_BASE}/WS/WarehouseInstallation/Scan/Form1`;

// 1. Login API
export const loginUser = async ({ username, password }) => {
    const loginPayload = { username, password };
    console.log("Payload đăng nhập:", loginPayload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // const response = await axios.post(LOGIN_API, loginPayload);

    if (username === 'tester' && password === '12345678') {
        return {
            owner: username,
            token: 'mock-jwt-token',
        };
    } else {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
};
// 2. Fetch Data
export const fetchProjectCodeList = async () => {
    return [
        { label: 'Dự án Alpha (PROJ-ALPHA)', value: 'PROJ-ALPHA' },
        { label: 'Dự án Beta (PROJ-BETA)', value: 'PROJ-BETA' },
        { label: 'Dự án Gamma (PROJ-GAMMA)', value: 'PROJ-GAMMA' },
        { label: 'Tạo mã mới', value: 'NEW_CODE' }
    ];
};

export const fetchPOList = async () => {
    return [
        { label: 'Samsung', value: 'SAMSUNG' },
        { label: 'Sony', value: 'SONY' },
        { label: 'LG', value: 'LG' },
        { label: 'Panasonic', value: 'PANASONIC' }
    ];
};
// 3. Submit Form Data
export const submitFormData = async ({ data, formType }) => {
    let endpoint;
    if (formType === 1) {
        endpoint = FORM_1_API;
    } else if (formType === 2) {
        endpoint = FORM_2_API;
    } else if (formType === 'INSTALL') {
        endpoint = FORM_INSTALL_API;
    } else {
        throw new Error("Loại Form không hợp lệ.");
    }
    console.log(`---Gửi dữ liệu Form ${formType} đến Endpoint: ${endpoint}---`, data);
    try {
        // Doing POST request with Axios
        const response = await axios.post(endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        // Resolve error
        let errorMessage = "Lỗi kết nối mạng hoặc server không phản hồi.";
        if (error.message) {
            errorMessage = error.response.data?.message || `Lỗi API (Status: ${error.response.status})`;
        }
        throw new Error(errorMessage);
    }
};