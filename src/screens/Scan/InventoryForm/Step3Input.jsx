import React, { useRef } from "react";

const Form1Fields = ({ formData, setFormData }) => {
    <div className="form-group space-y-4">
        <label className="form-label block">Mã Code</label>
        <input className="input-field" type="text" value={formData.code} onChange={(e) => setFormData('code', e.target.value)} />
    </div>
};

const Form2Fields = ({ formData, setFormData, onToast }) => {
    const seriInputRef = useRef(null);
    // Resolve input from scan device
    const handleScanComplete = (e) => {
        // Only resolve when click enter (scan device usually send Enter) or when focus eye
        if (e.key === 'Enter' || e.type === 'blur') {
            const scannedValue = e.target.value.trim();
            if (scannedValue && scannedValue.length > 5) {
                onToast(`Mã Seri đã được quét: ${scannedValue}`, 'success');
            }
            // Prevent form submit if Enter
            if (e.key === 'Enter') e.preventDefault();
        }
    };

    return (
        <div className="form-group space-y-4">
            <label className="form-label block">Part Number</label>
            <input className="input-field" type="text" value={formData.partNumber} onChange={(e) => setFormData('partNumber', e.target.value)} placeholder="Nhập Part Number" />

            <label className="form-label block font-bold text-gray-700">Seri Number</label>
            <input 
                ref={seriInputRef}
                className="input-field bg-yellow-50 border-yellow-300"
                type="text"
                value={formData.seriNumber}
                onChange={(e) => setFormData('seriNumber', e.target.value)}
                onKeyDown={handleScanComplete}
                onBlur={handleScanComplete}
                placeholder="Di chuyển máy quét qua đây..."
            />
        </div>
    );
};

const Step3Input = ({ formType, setFormType, formData, setFormData, onSubmit, finalProjectCode, po, isLoading, onToast }) => {
    const submitClasses = `btn-primary btn-submit-green ${isLoading ? 'btn-loading' : ''}`;

    return (
        <div className="step-content-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">3. Nhập Dữ Liệu & Gửi</h2>
            <div className="info-display-grid mb-6">
                <div>
                    <label className="info-label">Dự Án</label>
                    <input className="info-value-field" value={finalProjectCode} readOnly />
                </div>
                <div>
                    <label className="info-label">PO</label>
                    <input className="infor-value-field" value={po} readOnly />
                </div>
            </div>

            <span className="form-label forn-bold">Chọn kiểu Form Nhập Kho</span>
            <div className="form-select-group mb-6 flex space-x-2">
                <button
                    className={`flex-1 p-3 rounded-xl border-2 transition-colors ${formType === 1 ? 'bg-blue-100 border-blue-600 text-blue-800 font-semibold' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                    onClick={() => { setFormType(1); setFormData('partNumber', ''); setFormData('seriNumber', ''); }}
                >
                    <span className="text-2xl block mb-1">📝</span> Form 1 (Code)
                </button>
                <button
                    className={`flex-1 p-3 rounded-xl border-2 transition-colors ${formType === 2 ? 'bg-blue-100 border-blue-600 text-blue-800 font-semibold' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                    onClick={() => { setFormType(2); setFormData('code', '') }}
                >
                    <span className="text-2xl block mb-1">⚙️</span> Form 2(Part, Seri)
                </button>
            </div>

            {formType === 1 && <Form1Fields formData={formData} setFormData={setFormData} />}
            {formType === 2 && <Form2Fields formData={formData} setFormData={setFormData} onToast={onToast} />}

            {formType && (
                <button className={submitClasses} onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : null}
                    {isLoading ? 'ĐANG LƯU DỮ LIỆU...' : 'GỬI DỮ LIỆU NHẬP KHO'}
                </button>
            )}
        </div>
    );
};

export default Step3Input;