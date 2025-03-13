"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { achievements } from "./data";

const AboutUsHero: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-0 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className="rounded-sm shadow-sm p-6 flex items-center gap-4 bg-[#f2f2f2]"
          >
            <div className="p-3 rounded-sm bg-[#F4633A]">
              {React.createElement(achievement.icon, { className: "w-6 h-6 text-white" })}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {achievement.value}
              </div>
              <div className="text-sm font-medium text-gray-700">
                {achievement.description}
              </div>
            </div>
          </Card>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutUsHero;