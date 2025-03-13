"use client";

import React from "react";
import AboutUsHero from "./AboutUsHero";
import { features, themeColors } from "./data";
import AboutUsMissionVision from "./AboutUsMissionVision";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-[#f2f2f2] via-white to-[#f2f2f2]" style={{ backgroundColor: themeColors.light }}>
      <AboutUsHero />
      <AboutUsMissionVision features={features} />
    </div>
  );
};

export default AboutUs;