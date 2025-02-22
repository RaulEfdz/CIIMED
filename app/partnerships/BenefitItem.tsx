import React from "react";

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem = ({ title, description }: BenefitItemProps) => (
  <div className="p-6 bg-[#F2F2F2] rounded-sm shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-[#285C4D] rounded-sm mb-4 flex items-center justify-center">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-[#212322] mb-2">{title}</h3>
    <p className="text-[#212322]">{description}</p>
  </div>
);

export default BenefitItem;
