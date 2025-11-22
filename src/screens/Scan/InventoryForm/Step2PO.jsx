import React from "react";

const Step2PO = ({ projectCode, po, setPO }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            {/* Hiển thị lại Project đã nhập ở step 1 để đối chiếu */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                 <label className="inv-label">Mã dự án:</label>
                 <input className="inv-input-box" value={projectCode} readOnly style={{backgroundColor: '#e9ecef'}} />
            </div>

            <h3 style={{ marginBottom: '20px', color: '#2c2c6a' }}>Nhập Mã PO</h3>
            
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label className="inv-label">Mã PO:</label>
                
                {/* Input nhập liệu thuần túy */}
                <input 
                    className="inv-input-box" 
                    type="text"
                    value={po}
                    onChange={(e) => setPO(e.target.value)}
                    placeholder="Nhập mã PO..."
                    autoComplete="off"
                />
            </div>

             {/* Hiển thị kết quả (Review) */}
             <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                 <label className="inv-label" style={{fontSize: '0.9rem', color: '#666'}}>Dữ liệu nhập:</label>
                 <div className="inv-input-box" style={{backgroundColor: '#f0f0f0', color: '#888'}}>
                    {po || "..."}
                 </div>
             </div>
        </div>
    );
};

export default Step2PO;