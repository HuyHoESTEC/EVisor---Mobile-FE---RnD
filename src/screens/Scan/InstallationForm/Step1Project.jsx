import React from "react";

const Step1Project = ({ projectCode, setProjectCode }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c2c6a' }}>Nhập Mã Dự Án</h3>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label className="inv-label">Mã dự án:</label>
                <input 
                    className="inv-input-box"
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    placeholder="Nhập mã dự án..."
                    autoComplete="off"
                />
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                    * Vui lòng nhập chính xác mã dự án mới hoặc mã hiện có
                </p>
            </div>
            <div style={{ marginBottom: '10px', textAlign: "left"}}>
                <label className="inv-label" style={{ fontSize: '0.9rem', color: '#666' }}>Dữ liệu nhập:</label>
                <div className="inv-input-box" style={{ backgroundColor: '#f0f0f0', color: '#888' }}>
                    {projectCode || "..."}
                </div>
            </div>
        </div>
    );
};

export default Step1Project;