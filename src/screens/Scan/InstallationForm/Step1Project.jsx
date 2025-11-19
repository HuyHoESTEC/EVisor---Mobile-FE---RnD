import React from "react";

const Step1Project = ({ list, isLoading, projectCode, setProjectCode, newProjectCode, setNewProjectCode }) => {
    return (
        <div className="step-content-card">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">1. Chọn Mã Dự Án</h2>
            <p className="text-gray-600 mb-6">Vui lòng chọn mã dự án hiện có hoặc nhập mã dự án mới nếu cần.</p>

            <label className="form-label">Mã Dự Án</label>
            {isLoading ? (<div className="loading-message">Đang tải danh sách...</div>) : (
                <select
                    className="select-field"
                    value={projectCode}
                    onChange={(e) => {
                        setProjectCode(e.target.value);
                        if (e.target.value !== 'NEW_CODE') setNewProjectCode('');
                    }}
                >
                    <option value="" disabled>--- Chọn Mã Dự Án ---</option>
                    {list.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
                </select>
            )}

            {projectCode === 'NEW_CODE' && (
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <label className="form-label block">Nhập Mã Dự Án Mới</label>
                    <input 
                        className="input-field"
                        type="text"
                        value={newProjectCode}
                        onChange={(e) => setNewProjectCode(e.target.value)}
                        placeholder="PROJ-ES-XYZ"
                    />
                </div>
            )}
        </div>
    );
};

export default Step1Project;