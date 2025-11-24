import React, { useState } from "react";
import Step1Project from "./Step1Project";
import Step2Input from "./Step2Input";
import InstallationIco from '../../../assets/icon/installation_device.png';
import ListScanIco from '../../../assets/icon/list.png';
import '../../../style/InstallationStyle.css';
import { BaseProps } from "../../../types/common";

const InstallationFormContainer: React.FC<BaseProps> = ({ user, onToast, onBack, onNavigate }) => {
    const [step, setStep] = useState<number>(1);
    const [projectCode, setProjectCode] = useState<string>('');

    const renderStepper = () => {
        return (
            <div className="custom-stepper">
                <div className={`step-item ${step > 1 ? 'completed' : 'active'}`}>
                    {step > 1 ? '✓' : '1'}
                </div>
                <div className="step-line"></div>
                <div className={`step-item ${step === 2 ? 'active' : ''}`}>
                    2
                </div>
            </div>
        );
    };

    const handleNextStep = () => {
        if (step === 1 && !projectCode) return onToast('Vui lòng nhập Mã Dự Án', 'error');
        setStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        if (step === 1) onBack();
        else setStep(prev => prev - 1);
    }

    return (
        <div className="installation-container">
            <main className="installation-card">
                <div className="card-title-row">
                    <div className="card-title-left">
                        <img src={InstallationIco} alt="" className="card-icon" />
                        <span className="card-title">Lắp Đặt</span>
                    </div>
                    <button className="btn-icon-action" onClick={() => onNavigate && onNavigate('SCAN_MENU')}>
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
                        <Step2Input 
                            projectCode={projectCode}
                            onBack={handleBackStep}
                            onToast={onToast}
                            user={user}
                        />
                    )}
                </div>
                {step === 1 && (
                    <div className="footer-actions" style={{justifyContent: 'center' }}>
                        <button className="btn-next-blue btn-green" onClick={handleNextStep}>
                            Tiếp Tục &rarr;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InstallationFormContainer;