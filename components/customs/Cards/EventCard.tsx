import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';

export interface EventCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imgW: number;
  imgH: number;
  link: string;
  date: string;
  time: string;
  location: string;
  speaker?: string;
  category?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  imgW,
  imgH,
  link,
  date,
  time,
  location,
  speaker,
  category
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col rounded-none">
      <div className="relative h-48">
        <CldImage
          className="w-full h-full absolute inset-0 object-cover transform hover:scale-105 transition-transform duration-300"
          alt={imageAlt}
          src={imageUrl}
          width={imgW}
          height={imgH}
          crop={{
            type: "auto",
            source: true,
          }}
        />
        {category && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-none text-sm">
            {category}
          </span>
        )}
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          {speaker && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Ponente:</span>
              <span>{speaker}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 line-clamp-2 mb-4 flex-1">{description}</p>
        
        <div className="mt-auto">
          <a 
            href={link}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 rounded-none text-white  hover:bg-blue-700 transition-colors duration-300"
          >
            Ver detalles del evento
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;