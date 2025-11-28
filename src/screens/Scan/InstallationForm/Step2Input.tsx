import React, { useRef, useState } from "react";
import { SubmitPayload, InstallationForm, BaseProps  } from "../../../types/common";
import { submitFormData } from "../../../api";
import { readQRCodeFromFile } from "../../../utils/qrDecoder";
import '../../../style/Step2Input.css';
import ScanDeviceIco from '../../../assets/icon/qr.png';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleScanButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Functon solve after user take a photo/choose file
    const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onToast("Đang xử lý hình ảnh...", 'info');
        try {
            const scannedValue = await readQRCodeFromFile(file);
            // Check result and update state
            if (scannedValue && scannedValue.length > 5) {
                setCode(scannedValue);
                onToast(`Quét mã code thành công: ${scannedValue}`, 'success');
            } else {
                onToast("Giá trị quét không hợp lệ hoặc quá ngắn", 'error');
            }
        } catch (error) {
            console.error("Lỗi giải mã QR:", error);
            const errorMessage = (error as Error).message || "Lỗi giải mã QR/Barcode không xác định.";
            onToast(errorMessage, 'error');
        } finally {
            e.target.value = '';
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

            const res = await submitFormData({ data: submitData, formType: 'INSTALLATION' });
            if (res.status === 'success') {
                setStatus('success');
                const successMessage = 'Lưu dữ liệu lắp đặt thành công';
                setMessage(successMessage);
                onToast(successMessage, 'success');
            } else if (res.status === 'error') {
                setStatus('error');
                const errorMessage = res.message || 'Gửi dữ liệu lắp đặt thiết bị thất bại';
                setMessage(errorMessage);
                onToast(errorMessage, 'error');
            } else {
                setStatus('error');
                const unknownMessage = res.message || 'Phản hồi không rõ ràng từ máy chủ';
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
        // Reset code to write the next code, keep location and cabinat (usually installation same area)
        setCode('');
        // Focus again code field to continue scan
        setTimeout(() => {
            if (codeInputRef.current) codeInputRef.current.focus();
        }, 100);
    };

    return (
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
             <input 
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageCapture}
                style={{ display: 'none' }}
            />
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
                <div className="input-group-with-button">
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
                    <button
                        className="btn-scan-qr"
                        onClick={handleScanButtonClick}
                        type="button"
                        disabled={status === 'loading'}
                    >
                        <img className="scan-icon" src={ScanDeviceIco} />
                    </button>
                </div>
            </div>
            <div className="footer-actions">
                <button className="btn-back-yellow" onClick={onBack}>
                    &larr; Quay lại
                </button>
                <button className="btn-submit-blue" onClick={handleSubmit} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Đang lưu...' : 'Gửi'} &#10146;
                </button>
            </div>
        </div>
    );
};

export default Step2Input;