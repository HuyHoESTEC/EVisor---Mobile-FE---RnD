import React from "react";

const Step2PO = ({ list, isLoading, po, setPO }) => {
    return (
        <div className="step-content-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">2. Nhập PO</h2>
            <p className="text-gray-600 mb-6">Chọn mã PO của thiết bị bạn đang nhập kho</p>

            <label className="form-label">Mã PO</label>
            {isLoading ? (<div className="loading-message">Đang tải danh sách...</div>) : (
                <select
                    className="select-field"
                    value={po}
                    onChange={(e) => setPO(e.target.value)}
                >
                    <option value="" disabled>--- Chọn PO ---</option>
                    {list.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
            )}
        </div>
    );
};

export default Step2PO;