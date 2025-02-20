'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  logo: string;
  message: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Nicole Grazioso',
    position: 'Director Payments & Risk',
    company: 'HubSpot',
    logo: '/logo.png',
    message:
      "I'm absolutely floored by the level of care and attention to detail the team at HS have put into this theme and for one can guarantee that I will be a return customer."
  },
  {
    id: 2,
    name: 'Josh Tyson',
    position: 'Product Manager',
    company: 'Capsule',
    logo: '/logo.png',
    message:
      'With Preline, we’re able to easily track our performance in full detail. It’s become an essential tool for us to grow and engage with our audience.'
  },
  {
    id: 3,
    name: 'Luisa',
    position: 'Senior Director of Operations',
    company: 'Fitbit',
    logo: '/logo.png',
    message:
      'In September, I will be using this theme for 2 years. I went through multiple updates and changes and I’m very glad to see the consistency and effort made by the team.'
  }
];

const Testimonials: FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-6">
            <div className="flex-auto">
              <Image
                src={testimonial.logo}
                alt={`${testimonial.company} logo`}
                width={120}
                height={40}
                className="w-20 h-auto sm:w-24 text-gray-700"
              />
              <p className="mt-3 sm:mt-6 text-base text-gray-800 md:text-xl italic">
                “{testimonial.message}”
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500">
                {testimonial.position} | {testimonial.company}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
