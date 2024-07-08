import React, {useState} from 'react';
import FirstStep from "../FirstStep/FirstStep";

const CreateColocation = () => {
  const [currentStep, setCurrentStep] = useState(1)
  
  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <FirstStep/>
        )
      case 2:
        return (
          <></>
        )
      default:
        return null
    }
  }
  
  return (
    displayStep(currentStep)
  );
};

export default CreateColocation;