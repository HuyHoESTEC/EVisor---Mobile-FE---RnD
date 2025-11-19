import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjectCodeList, submitFormData } from "../../../api";
import Step1Project from "./Step1Project";
import Step2Input from "./Step2Input";
import Stepper from "../../../components/Shared/Stepper";

const TOTAL_STEPS = 2;
const InstallationFormContainer = ({ user, onToast, onBack }) => {
    const [step, setStep] = useState(1);
    const [projectList, setProjectList] = useState([]);
    const [isListLoading, setIsListLoading] = useState(true);
    const [projectCode, setProjectCode] = useState('');
    const [newProjectCode, setNewProjectCode] = useState('');
    const [formData, setFormDataState] = useState({
        location: '', cabinet_no: '', code: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const finaleProjectCode = useMemo(() => projectCode === 'NEW_CODE' ? newProjectCode.trim() : projectCode, [projectCode, newProjectCode]);
    const setFormData = useCallback((key, value) => setFormDataState(prev => ({ ...prev, [key]: value })), []);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            setIsListLoading(true);
            try {
                const projects = await fetchProjectCodeList();
                setProjectList(projects);
            } catch (error) {
                onToast(`Lỗi khi tải dữ liệu dữ án: ${error.message}`, 'error');
            } finally {
                setIsListLoading(false);
            }
        };
        loadData();
    }, [onToast]);

    // Handlers
    const handleNextStep = () => {
        if (isListLoading) { onToast("Dữ liệu đang được tải.", 'error'); return; }
        if (step === 1 && (!finaleProjectCode || (projectCode === 'NEW_CODE' && !newProjectCode.trim()))) {
            onToast("Vui lòng chọn hoặc nhập Mã Dự Án.", 'error');
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        if (step === 1) { onBack(); return; }
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        const { location, cabinet_no, code } = formData;
        if (!location || !cabinet_no || !code) {
            onToast("Vui lòng điền đầy đủ thông tin mã dãy, mã tủ và mã code.", 'error');
            return;
        }

        // Prepare installation payload
        const REQUEST_ID = `evisor-${Date.now()}`;
        const OWNER = user.owner;
        const finalPayload = {
            request_id: REQUEST_ID,
            owner: OWNER,
            form: {
                projectCode: finaleProjectCode,
                location: location,
                cabinet_no: cabinet_no,
                code: code
            }
        };

        try {
            setIsLoading(true);
            await submitFormData({ data: finalPayload, formType: 'INSTALL' });
            onToast("Lưu dữ liệu lắp đặt thành công!", 'success');
            // Reset form to the next fill
            setFormDataState({ location: '', cabinet_no: '', code: '' });
            setStep(2); // Keep the step 2 to continue fill data
        } catch (error) {
            onToast(`Lỗi: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        if (step === 1) {
            return <Step1Project 
                list={projectList}
                isLoading={isListLoading}
                projectCode={projectCode}
                setProjectCode={setProjectCode}
                newProjectCode={newProjectCode}
                setNewProjectCode={setNewProjectCode}
            />;
        }
        if (step === 2) {
            return <Step2Input 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                finalProjectCode={finaleProjectCode}
                isLoading={isLoading}
            />;
        }
        return null;
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="header-title">Lắp Đặt ({step/{TOTAL_STEPS}})</h1>
                <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
            </header>
            <main className="app-main">
                {renderStepContent()}
            </main>
            <footer>
                <button className="btn-secondary" onClick={handleBackStep} disabled={isLoading}>
                    &larr; {step === 1 ? 'Hủy bỏ' : 'Quay lại'}
                </button>
                {step < TOTAL_STEPS && (
                    <button className="btn-primary btn-primary-blue" onClick={handleNextStep} disabled={isListLoading || isLoading}>
                        Tiếp tục &rarr;
                    </button>
                )}
            </footer>
        </div>
    );
};

export default InstallationFormContainer;