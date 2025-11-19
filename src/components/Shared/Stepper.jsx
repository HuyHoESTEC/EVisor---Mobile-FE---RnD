import React from "react";

/**
 * Component progress bar follow step
 * @param {object} props
 * @param {number} props.currentStep - Current step (start from 1)
 * @param {number} props.totalSteps - Summary step
 */
const Stepper = ({ currentStep,  totalSteps }) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex justify-between items-center w-full my-4 px-4 sm:px-0">
            {steps.map((stepNum) => (
                <React.Fragment key={stepNum}>
                    {/*Đường nối giữa các bước */}
                    {stepNum > 1 && (
                        <div className={`flex-1 h-1 transition-colors duration-500 ${stepNum <= currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    )}
                    {/* Vòng tròn bước */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-500 font-bold text-sm
                        ${stepNum === currentStep ? 'bg-blue-600 shadow-md transform scale-110' : 
                          stepNum < currentStep ? 'bg-green-500' : 
                          'bg-gray-400'
                        }`}>
                            {stepNum < currentStep ? (
                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                stepNum
                            )}
                        </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;