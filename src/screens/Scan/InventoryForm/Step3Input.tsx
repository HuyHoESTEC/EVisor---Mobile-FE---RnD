import React, { useRef, useState } from "react";
import '../../../style/Step3Input.css';
import { submitFormData } from "../../../api";
import { BaseProps } from "../../../types/common";

interface Step3InputProps extends BaseProps {
    projectCode: string;
    po: string;
}

const Step3Input: React.FC<Step3InputProps> = ({ projectCode, po, onBack, user, onToast }) => {
    // 1. Form Code, 2. Form Part/Seri
    const [formType, setFormType] = useState<number>(2);
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
                onToast(`Mã Seri đã được quét: ${scannedValue}`, 'success');
            }
            if ((e as React.KeyboardEvent).key === 'Enter') {
                e.preventDefault();
            }
        }
    }

    const handleSubmit = async () => {
        setStatus('loading');
        try {
            const payload = {
                projectCode,
                po,
                type: formType === 1 ? 'CODE' : 'PART_SERI',
                data: formType === 1 ? { code } : { partNumber, seriNumber },
                owner: user?.owner
            };
            await submitFormData({ data: payload, formType });
            // Resolve success
            setStatus('success');
            setMessage('Gửi dữ liệu thành công');
        } catch (error) {
            console.log(error);
            setStatus('error');
            setMessage('Dữ liệu đã tồn tại trong hệ thống');
        }
    };

    const resetForm = () => {
        setStatus('idle');
        setSeriNumber('');
    }

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
            {/* --- Overlay Success/Error --- */}
            {status === 'success' && (
                <div className="result-overlay">
                    <div className="result-box">
                        <span className="result-icon" style={{ color: '#28a745' }}>✔</span>
                        <p className="result-text">{message}</p>
                    </div>
                    <button className="btn-back-yellow" onClick={resetForm}>Tiếp tục nhập</button>
                </div>
            )}
            {status === 'error' && (
                <div className="result-overlay">
                    <div className="result-box error">
                        <span className="result-icon" style={{color: '#dc3545'}}>✖</span> {/* Red Cross */}
                        <p className="result-text">{message}</p>
                    </div>
                    <button className="btn-back-yellow" onClick={() => setStatus('idle')}>Thử lại &#8635;</button>
                </div>
            )}
        </div>
    );
};

export default Step3Input;