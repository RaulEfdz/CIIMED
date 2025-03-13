import React from "react";
import { PartnershipCardData } from "./data";

const PartnershipCard = ({
  icon,
  title,
  description,
  category,
}: PartnershipCardData) => (
  <article className="flex flex-col p-6 bg-[#F2F2F2] rounded-sm shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 flex items-center gap-4">
      <div className="p-3 bg-[#285C4D] rounded-sm">{icon}</div>
      <h3 className="text-xl font-semibold text-[#212322]">{title}</h3>
    </div>
    <p className="text-[#212322] mb-4">{description}</p>
    <span className="mt-auto inline-block px-3 py-1 bg-opacity-20 bg-[#285C4D] text-text-[#212322] text-sm rounded-full">
      {category}
    </span>
  </article>
);

export default PartnershipCard;