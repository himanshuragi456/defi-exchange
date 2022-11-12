import React, { InputHTMLAttributes } from "react";

type ButtonProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const NormalButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="rounded-md bg-blue-e6 text-primary font-semibold px-2 xs:px-4 py-2 text-xs md:text-base min-w-max"
      onClick={onClick}>
      {label}
    </button>
  );
};

export default NormalButton;
