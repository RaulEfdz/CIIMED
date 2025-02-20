'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface ImageData {
  src: string;
  alt: string;
  caption: string;
}

const images: ImageData[] = [
  {
    src: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?ixlib=rb-4.0.3&auto=format&fit=crop&w=560&q=80',
    alt: 'Paesaggio montano',
    caption: 'Un suggestivo paesaggio montano con vette innevate e un lago cristallino.',
  },
  {
    src: 'https://images.unsplash.com/photo-1668906093328-99601a1aa584?ixlib=rb-4.0.3&auto=format&fit=crop&w=560&q=80',
    alt: 'Foresta pluviale',
    caption: 'L\'esuberante vegetazione di una foresta pluviale, un ecosistema ricco di biodiversità.',
  },
  {
    src: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?ixlib=rb-4.0.3&auto=format&fit=crop&w=560&q=80',
    alt: 'Spiaggia tropicale',
    caption: 'Una spiaggia tropicale da sogno, con sabbia bianca, acque turchesi e palme ondeggianti.',
  },
];

const GalleryInfra = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">Infrastruttura</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at velit maximus, molestie est a, tempor magna.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden rounded-sm shadow-md">
            <div className="relative w-full h-56">
              <Image src={image.src} alt={image.alt} fill className="object-cover" loading="lazy" />
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">{image.caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GalleryInfra;
