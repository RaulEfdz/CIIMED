import React from 'react';

export interface NoveltyCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
}

const NoveltyCard: React.FC<NoveltyCardProps> = ({ title, description, category, date }) => {
  return (
    <div className="bg-white shadow-md rounded-none
     p-4 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span className="font-semibold">{category}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default NoveltyCard;
