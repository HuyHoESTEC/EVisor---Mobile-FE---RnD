import React from "react";

const Step2Input = ({ formData, setFormData, onSubmit, finalProjectCode, isLoading }) => {
    const submitClasses = `btn-primary btn-submit-green ${isLoading ? 'btn-loading' : ''}`;

    return (
        <div className="step-content-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">2. Nhập thông tin lắp đặt & Gửi</h2>
            <div className="info-display-grid mb-6">
                <div>
                    <label className="info-label">Dự án</label>
                    <input className="info-value-field" value={finalProjectCode} readOnly />
                </div>
            </div>

            <div className="form-group space-y-4">
                <label className="form-label block">Dãy</label>
                <input 
                    className="input-field"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData('location', e.target.value)}
                    placeholder="Example: Dãy x"
                />

                <label className="form-label block">Số hiệu tủ</label>
                <input 
                    className="input-field"
                    type="text"
                    value={formData.cabinet_no}
                    onChange={(e) => setFormData('cabinet_no', e.target.value)}
                    placeholder="Example: C01-R03"
                />

                <label className="form-label block">Mã Code</label>
                <input 
                    className="input-field"
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData('code', e.target.value)}
                    placeholder="Nhập Mã Code Thiết Bị"
                />
            </div>

            <button className={submitClasses} onClick={onSubmit} disabled={isLoading}>
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : null}
                {isLoading ? 'ĐANG LƯU DỮ LIỆU...' : 'HOÀN TẤT  & GỬI DỮ LIỆU'}
            </button>
        </div>
    );
};

export default Step2Input;