import React, { useRef, useState } from "react";
import { SubmitPayload, InstallationForm, BaseProps  } from "../../../types/common";
import { submitFormData } from "../../../api";

interface Step2InputInstallationProps extends BaseProps {
    projectCode: string;
}

const Step2Input: React.FC<Step2InputInstallationProps> = ({ projectCode, onBack, onToast }) => {
    // Form Data
    const [location, setLocation] = useState<string>('');
    const [cabinetNo, setCabinetNo] = useState<string>('');
    const [code, setCode] = useState<string>('');
    // Ref for Code field to resolve scan device
    const codeInputRef = useRef<HTMLInputElement>(null);
    // Status
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    // Resolve scan for Code field
    const handleScanComplete = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        if ((e as React.KeyboardEvent).key === 'Enter' || e.type === 'blur') {
            const target = e.target as HTMLInputElement;
            const scannedValue = target.value.trim();
            if (scannedValue) {
                setCode(scannedValue);
            }
            if ((e as React.KeyboardEvent).key === 'Enter') e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        // Validate
        if (!location || !cabinetNo || !code) {
            onToast("Vui lòng điền đầy đủ thông tin: Dãy, Tủ và Code", 'error');
            return;
        }
        
        setStatus('loading');
        try {
            // Create InstallationForm payload
            const formPayload: InstallationForm = {
                project_code: projectCode,
                location: cabinetNo,
                cabinet_no: location,
                code: code
            };
            // Create request_id and SubmitPayload
            const request_id = "evisor-" + Date.now();
            const submitData: SubmitPayload = {
                request_id: request_id,
                form: formPayload
            };

            await submitFormData({ data: submitData, formType: 'INSTALLATION' });

            setStatus('success');
            const successMessage = 'Lưu dữ liệu lắp đặt thành công';
            setMessage(successMessage);
            onToast(successMessage, 'success');
        } catch (error) {
            console.log(error);
            setStatus('error');
            const errorMessage = (error as Error).message || 'Lỗi: Dữ liệu có thể đã tồn tại hoặc lỗi mạng';
            setMessage(errorMessage);
            onToast(errorMessage, 'error');
        }
    };

    const resetForm = () => {
        setStatus('idle');
        // Reset code to write the next code, keep location and cabinat (usually installation same area)
        setCode('');
        // Focus again code field to continue scan
        setTimeout(() => {
            if (codeInputRef.current) codeInputRef.current.focus();
        }, 100);
    };

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '15px' }}>
                <label className="ist-label">Mã dự án:</label>
                <input className="ist-input-box" value={projectCode} readOnly />
            </div>
            <div style={{ flex: 1 }} className="form-animation">
                <label className="ist-label">Mã Dãy:</label>
                <input 
                    className="ist-input-box"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Nhập mã dãy..."
                />
                <label className="ist-label">Mã Tủ:</label>
                <input 
                    className="ist-input-box"
                    value={cabinetNo}
                    onChange={(e) => setCabinetNo(e.target.value)}
                    placeholder="Nhập mã tủ..."
                />
                <label className="ist-label">Mã Code:</label>
                <input 
                    ref={codeInputRef}
                    className="ist-input-box"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleScanComplete}
                    onBlur={handleScanComplete}
                    placeholder="Quét hoặc nhập Code thiết bị..."
                    style={{ backgroundColor: '#fff9c4', borderColor: '#fbc02d' }}
                />
            </div>
            <div className="footer-actions">
                <button className="btn-back-yellow" onClick={onBack}>
                    &larr; Quay lại
                </button>
                <button className="btn-submit-blue" onClick={handleSubmit} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang lưu...' : 'Lưu dữ liệu'}
                </button>
            </div>
            {status === 'success' && (
                <div className="result-overlay">
                    <div className="result-box">
                        <span className="result-icon" style={{ color: '#28a745' }}>✔</span>
                        <p className="result-text">{message}</p>
                    </div>
                    <button className="btn-back-yellow" onClick={resetForm}>Tiếp tục lắp đặt</button>
                </div>
            )}
            {status === 'error' && (
                <div className="result-overlay">
                    <div className="result-box">
                        <span className="result-icon" style={{ color: '#dc3545' }}>✖</span>
                        <p className="result-text">{message}</p>
                    </div>
                    <button className="btn-back-yellow" onClick={() => setStatus('idle')}>Thử lại &#8635;</button>
                </div>
            )}
        </div>
    );
};

export default Step2Input;