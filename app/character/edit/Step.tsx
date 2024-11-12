import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface StepProps {
  stepNumber: number;
  title: string;
  content: React.ReactNode;
  isFilled: boolean;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
}

const Step: React.FC<StepProps> = ({
  stepNumber,
  title,
  content,
  isFilled,
  activeStep,
  setActiveStep,
}) => {
  const isActive = activeStep === stepNumber;

  return (
    <div
      className={`mb-4 border rounded-lg overflow-hidden ${
        isFilled ? "border-green-500" : ""
      }`}
    >
      <button
        className={`w-full p-4 text-left font-semibold ${
          isFilled ? "bg-green-100" : ""
        } focus:outline-none flex justify-between items-center`}
        onClick={() => setActiveStep(isActive ? null : stepNumber)}
      >
        <span>{title}</span>
        {isActive ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {isActive && <div className="p-4 bg-white">{content}</div>}
    </div>
  );
};

export default Step;
