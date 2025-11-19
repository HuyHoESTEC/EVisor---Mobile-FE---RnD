import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPOList, fetchProjectCodeList, submitFormData } from "../../../api";
import Step1Project from "./Step1Project";
import Step2PO from "./Step2PO";
import Step3Input from "./Step3Input";
import Stepper from "../../../components/Shared/Stepper";

const TOTAL_STEPS = 3;
const InventoryFormContainer = ({ user, onToast, onBack }) => {
    const [step, setStep] = useState(1);
    const [projectList, setProjectList] = useState([]);
    const [poList, setPOList] = useState([]);
    const [isListLoading, setIsListLoading] = useState(true);
    const [projectCode, setProjectCode] = useState('');
    const [newProjectCode, setNewProjectCode] = useState('');
    const [po, setPO] = useState('');
    const [formType, setFormType] = useState(null);
    const [formData, setFormDataState] = useState({ po: '', code: '', partNumber: '' });
    const [isLoading, setIsLoading] = useState(false);

    const finalProjectCode = useMemo(() => projectCode === 'NEW_CODE' ? newProjectCode.trim() : projectCode, [projectCode, newProjectCode]);
    const setFormData = useCallback((key, value) => setFormDataState(prev => ({ ...prev, [key]: value })), []);

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            setIsListLoading(true);
            try {
                const projects = await fetchProjectCodeList();
                const po = await fetchPOList();
                setProjectList(projects);
                setPOList(po);
            } catch (err) {
                onToast(`Lỗi khi tải dữ liệu: ${err.message}`, 'error');
            } finally {
                setIsListLoading(false);
            }
        };
        loadData();
    }, [onToast]);

    // Handlers
    const handleNextStep = () => {
        if (isListLoading) {onToast("Dữ liệu đang được tải.", 'error'); return;}
        if (step === 1 && (!finalProjectCode || (projectCode === 'NEW_CODE' && !newProjectCode.trim()))) {
            onToast("Vui lòng chọn hoặc nhập Mã Dự Án.", 'error'); return;
        }
        if (step === 2 && !po) {
            onToast("Vui lòng chọn mã PO.", 'error'); return;
        }
        setStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        if (step === 1) { onBack(); return; }
        if (step === 3) setFormType(null); // Reset form type when back
        setStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!formType) { onToast("Vui lòng chọn kiểu Form.", 'error'); return; }
        const  { po, code, partNumber, seriNumber } = formData;

        if (formType === 1 && (!code)) { onToast("Vui lòng điền Mã Code", 'error'); return; }
        if (formType === 2 && (!partNumber || !seriNumber)) { onToast("Vui lòng điền đẩy đủ Part Number và Seri Number.", 'error'); return; }
        // Prepare payload
        const REQUEST_ID = `evisor-${Date.now()}`;
        const OWNER = user.owner;
        let formSpecificData;

        if (formType === 1) {
            formSpecificData = { project_code: finalProjectCode, po: po, code: code };
        } else if (formType === 2) {
            formSpecificData = { projectCode: finalProjectCode, po: po, part_number: partNumber, seri_no: seriNumber };
        }

        const finalPayload = { request_id: REQUEST_ID, owner: OWNER, form: formSpecificData };
        try {
            setIsLoading(true);
            await submitFormData({ data: finalPayload, formType: formType });
            onToast("Lưu dữ liệu thành công!", 'success');
            // Reset to step 1 or 3
            setFormDataState({ po: '', code: '', partNumber: '', seriNumber: '' });
            setFormType(null);
            setStep(3);
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
            return <Step2PO 
                list={poList}
                isLoading={isListLoading}
                po={po}
                setPO={setPO}
            />;
        }
        if (step === 3) {
            return <Step3Input 
                formType={formType}
                setFormType={setFormType}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                finalProjectCode={finalProjectCode}
                po={po}
                isLoading={isLoading}
                onToast={onToast}
            />;
        }
        return null;
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="header-title">Nhập Kho ({step}/{TOTAL_STEPS})</h1>
                <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
            </header>
            <main className="app-main">
                {renderStepContent()}
            </main>
            <footer>
                {step > 0 && (
                    <button className="btn-secondary" onClick={handleBackStep} disabled={isLoading}>
                        &larr; {step === 1 ? 'Hủy bỏ' : 'Quay lại'}
                    </button>
                )}
                {step < TOTAL_STEPS && (
                    <button className="btn-primary btn-primary-blue" onClick={handleNextStep} disabled={isListLoading || isLoading}>
                        Tiếp tục &rarr;
                    </button>
                )}
            </footer>
        </div>
    );
};

export default InventoryFormContainer;