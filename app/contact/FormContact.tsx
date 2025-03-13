"use client";

import React from "react";
import HireUs from "@/components/customs/feedBack/HireUs";
import { allianceContent } from "./data";

const FormContact = () => {
  return <HireUs content={allianceContent} />; // Usar datos importados
};

export default FormContact;