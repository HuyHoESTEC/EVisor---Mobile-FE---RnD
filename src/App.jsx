import { useCallback, useEffect, useMemo, useState } from 'react'
import './style.css' // Gọi file CSS đã tạo

const FORM_1_API = import.meta.env.REACT_APP_API_ENDPOINT_FORM_1;
const FORM_2_API = import.meta.env.REACT_APP_API_ENDPOINT_FORM_2;
// Fetch project code data
const fetchProjectCodeList = async () => {
  return [
    { label: 'Dự án Alpha (PROJ-ALPHA)', value: 'PROJ-ALPHA' },
    { label: 'Dự án Beta (PROJ-BETA)', value: 'PROJ-BETA' },
    { label: 'Dự án Gamma (PROJ-GAMMA)', value: 'PROJ-GAMMA' },
    { label: 'Tạo mã mới', value: 'NEW_CODE' }
  ];
};
// Fetch brand data
const fetchBrandList = async () => {
  return [
    { label: 'Samsung', value: 'SAMSUNG' },
    { label: 'Sony', value: 'SONY' },
    { label: 'LG', value: 'LG' },
    { label: 'Panasonic', value: 'PANASONIC' }
  ];
};

const submitFormData = async (payload) => {
  console.log(`--- Gửi dữ liệu đến Endpoint: ${FORM_1_API} ---`, payload);
  try {
    const response = await fetch(FORM_1_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Lỗi API (Status: ${response.status} ${response.statusText}).`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Ignore if cannot parse JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
    throw new Error(`Lỗi kết nối mạng: ${error.message}`);
  }
};

const activeScanner = () => {
  return `SERI-${Math.floor(Math.random() * 9000) + 1000}`;
};

const ToastMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
        onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  
  if (!message) return null;

  return (
    <div className={`toast-base ${type === 'success' ? 'toast-success' : 'toast-error'}`} role='alert'>
      <div className='toast-content'>
        <span className='toast-message'>{message}</span>
        <button
          onClick={onClose}
          className='toast-close-btn'
          aria-label='Đóng'
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// -- Child component: Form type 1 --
const Form1 = ({ formData, setFormData }) => (
  <div className='form-group-space'>
    <label className='form-label'>PO</label>
    <input
      className='input-field'
      type='text'
      value={formData.po}
      onChange={(e) => setFormData('po', e.target.value)}
      placeholder='Nhập PO'
    />

    <label className='form-label'>Mã Code</label>
    <input 
      className='input-field'
      type='text'
      value={formData.code}
      onChange={(e) => setFormData('code', e.target.value)}
      placeholder='Nhập Mã Code'
    />
  </div>
);

// -- Child component: Form type 2 --
const Form2 = ({ formData, setFormData, onToast }) => {
  const handleScan = () => {
    const scannedValue = activeScanner();
    setFormData('seriNumber', scannedValue);
    onToast(`Quét thành công: ${scannedValue}`, 'success');
  };

  return (
    <div className='form-group-space'>
      <label className='form-label'>PO</label>
      <input 
        className='input-field'
        type='text'
        value={formData.po}
        onChange={(e) => setFormData('po', e.target.value)}
        placeholder='Nhập PO'
      />

      <label className='form-label'>Part Number</label>
      <input 
        className='input-field'
        type='text'
        value={formData.partNumber}
        onChange={(e) => setFormData('partNumber', e.target.value)}
        placeholder='Nhập Part Number'
      />

      <label className='form-label'>Seri Number</label>
      <div className='scanner-input-group'>
        <input 
          className='scanner-input input-field'
          type='text'
          value={formData.seriNumber}
          onChange={(e) => setFormData('seriNumber', e.target.value)}
          placeholder='Nhập Seri Number hoặc Quét'
        />
        <button
          className='scan-button'
          onClick={handleScan}
        >
          <svg className="w-5 h-5 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.218A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.218A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Quét
        </button>
      </div>
    </div>
  )
}

function App() {
  const [projectList, setProjectList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [step, setStep] = useState(1);
  const [projectCode, setProjectCode] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [brand, setBrand] = useState('');
  const [formType, setFormType] = useState(null);
  const [formData, setFormDataState] = useState({
    po: '',
    code: '',
    partNumber: '',
    seriNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const finalProjectCode = useMemo(() => {
    return projectCode === 'NEW_CODE' ? newProjectCode.trim() : projectCode;
  }, [projectCode, newProjectCode]);

  const setFormData = useCallback((key, value) => {
    setFormDataState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsListLoading(true);
      setListError(null);
      try {
        const projects = await fetchProjectCodeList();
        const brands = await fetchBrandList();
        setProjectList(projects);
        setBrandList(brands);
      } catch (err) {
        setListError(`Không thể tải dữ liệu: ${err.message}. Vui lòng thử lại.`);
        handleToast(`Lỗi khi tải dữ liệu: ${err.message}`, 'error');
      } finally {
        setIsListLoading(false);
      }
    };
    loadData();
  }, [handleToast]);

  const handleNextStep = () => {
    if (isListLoading) {
      handleToast("Dữ liệu đang được tải, vui lòng chờ.", 'error');
      return;
    }
    
    if (step === 1) {
      const code = finalProjectCode;
      if (!code || (projectCode === 'NEW_CODE' && !newProjectCode.trim())) {
        handleToast("Vui lòng chọn hoặc nhập Mã Dự Án.", 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!brand) {
        handleToast("Vui lòng chọn Hãng.", 'error');
        return;
      }
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      if (step === 3) {
        setFormType(null);
        setFormDataState({ po: '', code: '', partNumber: '', seriNumber: '' });
      }
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!finalProjectCode || !brand || !formType) {
      handleToast("Chưa hoàn thành các bước cơ bản.", 'error');
      return;
    }

    const payload = {
      projectCode: finalProjectCode,
      brand: brand,
      formType: formType,
      ...(formType === 1 ? { po: formData.po, code: formData.code } : {}),
      ...(formType === 2 ? { po: formData.po, partNumber: formData.partNumber, seriNumber: formData.seriNumber } : {})
    };

    if (formType === 1 && (!formData.po || !formData.code)) {
      handleToast("Vui lòng điền đầy đủ PO và Mã Code", 'error');
      return;
    }
    if (formType === 2 && (!formData.po || !formData.partNumber || !formData.seriNumber)) {
      handleToast("Vui lòng điền đầy đủ PO, Part Number và Seri Number.", 'error');
      return;
    }

    try {
      setIsLoading(true);
      await submitFormData(payload);
      handleToast("Lưu dữ liệu thành công! Chuẩn bị nhập đợt mới.", 'success');
      setFormDataState({ po: '', code: '', partNumber: '', seriNumber: '' });
      setFormType(null);
    } catch (error) {
      handleToast(`Lỗi: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitle = useMemo(() => {
    if (step === 1) return 'Bước 1: Mã dự án';
    if (step === 2) return 'Bước 2: Chọn Hãng';
    if (step === 3) return `Bước 3: Nhập liệu (Dạng ${formType || '...'})`;
    return 'Mobile Form App';
  }, [step, formType]);

  const renderStepContent = () => {
    if (step === 1 || step === 2) {
      const brandSelectionVisible = step >= 2;

      const isDisabled = !finalProjectCode || (step === 2 && !brand) || isListLoading || listError;
      const buttonClasses = `btn-primary btn-primary-blue ${isDisabled ? 'btn-disabled' : ''}`;

      return (
        <div className='step-card'>
          {/* Part 1: Select project code */}
          <label className='step-title'>Chọn Mã Dự Án</label>
          {isListLoading ? (
            <div className='loading-message'>Đang tải danh sách dự án...</div>
          ) : listError ? (
            <div className='error-message'>Lỗi tải: {listError}</div>
          ) : (
            <select
              className='select-field'
              value={projectCode}
              onChange={(e) => {
                setProjectCode(e.target.value);
                if (e.target.value !== 'NEW_CODE') setNewProjectCode('');
              }}
            >
              <option value="" disabled>--- Chọn Mã Dự Án ---</option>
              {projectList.map(item => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          )}

          {projectCode === 'NEW_CODE' && (
            <div className='new-code-input-group'>
              <label className='new-code-label'>Nhập Mã Dự Án</label>
              <input 
                className='input-field new-code-input'
                type='text'
                value={newProjectCode}
                onChange={(e) => setNewProjectCode(e.target.value)}
                placeholder='PROJ-NEW-XYZ'
              />
            </div>
          )}

          {/* Part 2: Select Brand */}
          {brandSelectionVisible && (
            <div className='brand-selection'>
              <label className='step-title'>Chọn Hãng</label>
              {isListLoading ? (
                <div className='loading-message'>Đang tải danh sách hãng...</div>
              ) : listError ? (
                <div className='error-message'>Lỗi tải: {listError}</div>
              ) : (
                <select
                  className='select-field brand-select-field'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="" disabled>--- Chọn Hãng ---</option>
                  {brandList.map(item => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <button
            className={buttonClasses}
            onClick={handleNextStep}
            disabled={isDisabled}
          >
            {isListLoading ? 'ĐANG TẢI DỮ LIỆU...' : (step === 2 ? 'Tiếp tục nhập liệu' : 'Tiếp tục')}
          </button>
        </div>
      );
    }

    if (step === 3) {
      const submitClasses = `btn-submit btn-submit-green ${isLoading ? 'btn-loading' : ''}`;
      return (
        <div className='step-card'>
          <div className='info-display-grid'>
            <div>
              <label className='info-label'>Mã Dự Án</label>
              <input 
                className='info-value-field'
                value={finalProjectCode}
                readOnly
              />
            </div>
            <div>
              <label className='info-label'>Hãng</label>
              <input 
                className='info-value-field'
                value={brand}
                readOnly
              />
            </div>
          </div>

          <span className='step-title'>Chọn loại Form</span>
          <div className='form-select-group'>
            <button
              className={`form-select-btn ${formType === 1 ? 'form-select-btn-active' : 'form-select-btn-inactive'}`}
              onClick={() => {
                setFormType(1);
                setFormDataState(prev => ({ ...prev, partNumber: '', seriNumber: '' }));
              }}
            >
              Form Loại 1 (PO, Code)
            </button>
            <button
              className={`form-select-btn ${formType === 2 ? 'form-select-btn-active' : 'form-select-btn-inactive form-select-btn-inactive-2'}`}
              onClick={() => {
                setFormType(2);
                setFormDataState(prev => ({ ...prev, code: '' }));
              }}
            >
              Form Loại 2 (PO, Part, Seri)
            </button>
          </div>
          {/* Render child form */}
          {formType === 1 && <Form1 formData={formData} setFormData={setFormData} />}
          {formType === 2 && <Form2 formData={formData} setFormData={setFormData} onToast={handleToast} />}

          {formType && (
            <button
              className={submitClasses}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'ĐANG LƯU DỮ LIỆU...' : 'LƯU DỮ LIỆU'}
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className='app-container'>
      <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <header className='app-header'>
        <h1 className='header-title'>{stepTitle}</h1>
      </header>
      
      <main className='app-main'>
        {renderStepContent()}
      </main>

      {step > 1 && (
        <button
          className='btn-secondary'
          onClick={handleBackStep}
        >
          &larr; Quay lại Bước {step > 1 ? step - 1 : 1}
        </button>
      )}
    </div>
  );
};

export default App;