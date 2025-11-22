import React, { useState } from "react";
import Step1Project from "./Step1Project";
import Step2PO from "./Step2PO";
import Step3Input from "./Step3Input";
import InventoryIco from '../../../assets/icon/entered_warehouse.png';
import ListScanIco from '../../../assets/icon/list.png';
import '../../../style/InventoryStyle.css';

const InventoryFormContainer = ({ user, onToast, onBack }) => {
    const [step, setStep] = useState(1);
    const [projectCode, setProjectCode] = useState('');
    const [po, setPO] = useState('');

    const renderStepper = () => {
        return (
            <div className="custom-stepper">
                {/* Step 1 */}
                <div className={`step-item ${step > 1 ? 'completed' : 'active'}`}>
                    {step > 1 ? '✓' : '1'}
                </div>
                <div className="step-line"></div>
                {/* Step 2 */}
                <div className={`step-item ${step > 2 ? 'completed' : (step === 2 ? 'active' : '')}`}>
                    {step > 2 ? '✓' : '2'}
                </div>
                <div className="step-line"></div>
                {/* Step 3 */}
                <div className={`step-item ${step === 3 ? 'active' : ''}`}>
                    3
                </div>
            </div>
        )
    }

    // Handlers
    const handleNextStep = () => {
        if (step === 1 && !projectCode) return onToast('Vui lòng nhập Dự án', 'error');
        if (step === 2 && !po) return onToast('Vui lòng nhập PO', 'error');
        setStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        if (step === 1) onBack(); 
        else setStep(prev => prev - 1);
    };

    const handleBackToStep1 = () => {
        setStep(1);
    };

    return (
        <div className="inventory-container">
            <main className="inventory-card">
                <div className="card-title-row">
                    <div className="card-title-left">
                        <img src={InventoryIco} alt="" className="card-icon" />
                        <span className="card-title">Nhập Kho</span>
                    </div>
                    <button className="btn-icon-action" onClick={() => onBack('SCAN_MENU')}>
                        <img src={ListScanIco} alt="Menu" />
                    </button>
                </div>
                {renderStepper()}
                <div style={{ flex: 1 }}>
                    {step === 1 && (
                        <Step1Project 
                            projectCode={projectCode}
                            setProjectCode={setProjectCode}
                        />
                    )}
                    {step === 2 && (
                        <Step2PO 
                            projectCode={projectCode}
                            po={po}
                            setPO={setPO}
                        />
                    )}
                    {step === 3 && (
                        <Step3Input 
                            projectCode={projectCode}
                            po={po}
                            onBack={handleBackStep}
                            onToast={onToast}
                            user={user}
                        />
                    )}
                </div>
                {/* Step 1: Chỉ hiện nút Tiếp tục */}
                {step === 1 && (
                    <div className="footer-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn-next-blue btn-green" onClick={handleNextStep}>
                            Tiếp Tục &rarr;
                        </button>
                    </div>
                )}

                {/* Step 2: Hiện nút Quay lại (Vàng) và Tiếp tục */}
                {step === 2 && (
                    <div className="footer-actions" style={{ justifyContent: 'space-between' }}>
                        <button 
                            className="btn-back-yellow" 
                            onClick={handleBackToStep1}
                        >
                            &larr; Quay lại
                        </button>

                        <button 
                            className="btn-next-blue btn-green" 
                            onClick={handleNextStep}
                        >
                            Tiếp Tục &rarr;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InventoryFormContainer;