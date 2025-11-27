import React, { useRef, useState } from "react";
import '../../../style/Step3Input.css';
import { BaseProps, InventoryCodeForm, InventoryPartNoForm, SubmitPayload, SubmitFormType } from "../../../types/common";
import { submitFormData } from "../../../api";

interface Step3InputProps extends BaseProps {
    projectCode: string;
    po: string;
}

const Step3Input: React.FC<Step3InputProps> = ({ projectCode, po, onBack, user, onToast }) => {
    // 1. Form Code, 2. Form Part/Seri
    const [formType, setFormType] = useState<number>(1);
    // Form Data
    const [code, setCode] = useState<string>('');
    const [partNumber, setPartNumber] = useState<string>('');
    const [seriNumber, setSeriNumber] = useState<string>('');
    // Submission Status: 'idle' | 'loading' | 'success' | 'error'
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const seriInputRef = useRef<HTMLInputElement>(null);

    const handleScanComplete = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        if ((e as React.KeyboardEvent).key === 'Enter' || e.type === 'blur') {
            const target = e.target as HTMLInputElement;
            const scannedValue = target.value.trim();
            if (scannedValue && scannedValue.length > 5) {
                setSeriNumber(scannedValue);
            }
            if ((e as React.KeyboardEvent).key === 'Enter') {
                e.preventDefault();
            }
        }
    }

    const handleSubmit = async () => {
        // Validate
        if (formType === 1) {
            if (!code) {
                onToast("Vui lòng nhập Mã Code.", 'error');
                return;
            }
        } else if (formType === 2) {
            if (!partNumber || !seriNumber) {
                onToast("Vui lòng nhập đầy đủ Part Number và Seri Number.", 'error');
                return;
            }
        } else {
            onToast("Loại Form không hợp lệ.", 'error');
            return;
        }
        setStatus('loading');
        try {
            let formPayload: InventoryCodeForm | InventoryPartNoForm;
            // Construct Form Payload (follow InventoryCodeForm or InventoryPartNoForm)
            if (formType === 1) {
                formPayload = {
                    project_code: projectCode,
                    po: po,
                    code: code
                } as InventoryCodeForm;
            } else {
                formPayload = {
                    project_code: projectCode,
                    po: po,
                    part_no: partNumber,
                    seri_no: seriNumber
                } as InventoryPartNoForm;
            }
            // Construct SubmitPayload
            const request_id = "evisor-" + Date.now();
            const submitData: SubmitPayload = {
                request_id: request_id,
                form: formPayload
            };
            // Call API
            const response = await submitFormData({ data: submitData, formType: formType as SubmitFormType });
            // Resolve success
            if (response.status === 'success') {
                setStatus('success');
                const successMessage = response.message || 'Gửi dữ liệu thành công';
                setMessage(successMessage);
                onToast(successMessage, 'success');
            } else if (response.status === 'error') {
                setStatus('error');
                const errorMessage = response.message || 'Gửi dữ liệu thất bại';
                setMessage(errorMessage);
                onToast(errorMessage, 'error');
            } else {
                setStatus('error');
                const unknownMessage = response.message || 'Phản hồi không rõ ràng từ máy chủ';
                setMessage(unknownMessage);
                onToast(unknownMessage, 'error');
            }
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
        setSeriNumber('');
        setCode('');
        setTimeout(() => {
            if (seriInputRef.current && formType === 2) seriInputRef.current.focus();
        }, 100);
    };

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '15px' }}>
                <label className="inv-label">Mã dự án:</label>
                <input className="inv-input-box" value={projectCode} readOnly />
                <label className="inv-label">Mã PO:</label>
                <input className="inv-input-box" value={po} readOnly />
            </div>
            <div className="toggle-switch-container">
                <button
                    className={`toggle-btn left ${formType === 1 ? 'active' : ''}`}
                    onClick={() => setFormType(1)}
                >
                    CODE
                </button>
                <button
                    className={`toggle-btn right ${formType === 2 ? 'active' : ''}`}
                    onClick={() => setFormType(2)}
                >
                    PART NUMBER, SERI NUMBER
                </button>
            </div>
            <div style={{ flex: 1 }}>
                {formType === 1 ? (
                    <div>
                        <label className="inv-label">Mã Code:</label>
                        <input 
                            className="inv-input-box"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Nhập mã Code hàng hóa..."
                        />
                    </div>
                ) : (
                    <div>
                        <label className="inv-label">Part Number:</label>
                        <input 
                            className="inv-input-box"
                            value={partNumber}
                            onChange={(e) => setPartNumber(e.target.value)}
                            placeholder="Nhập Part Number..."
                        />
                        <label className="inv-label">Seri Number:</label>
                        <input 
                            ref={seriInputRef}
                            className="inv-input-box"
                            value={seriNumber}
                            onChange={(e) => setSeriNumber(e.target.value)}
                            onKeyDown={handleScanComplete}
                            onBlur={handleScanComplete}
                            placeholder="Quét hoặc nhập Seri Number..."
                            style={{ backgroundColor: '#fff9c4', borderColor: '#fbc02d' }}
                        />
                    </div>
                )}
            </div>
            <div className="footer-actions">
                <button className="btn-back-yellow" onClick={onBack}>
                    &larr; Quay lại
                </button>
                <button className="btn-submit-blue" onClick={handleSubmit} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang gửi...' : 'Gửi'} &#10146;
                </button>
            </div>
        </div>
    );
};

export default Step3Input;