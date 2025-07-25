import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

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
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm">
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
          <span className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-sm text-sm" style={{ backgroundColor: teamColors.secondary }}>
            {category}
          </span>
        )}
      </div>
      
      <CardContent className="p-6 bg-[#F2F2F2] dark:bg-neutral-900">
        <h3 className="text-2xl font-bold mb-2 line-clamp-2" style={{ color: teamColors.primary }}>{title}</h3>
        
        <div className="space-y-2 text-sm text-gray-700 dark:text-neutral-300 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
            <span>{location}</span>
          </div>
          {speaker && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Ponente:</span>
              <span>{speaker}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 dark:text-neutral-300 line-clamp-2 mb-4">{description}</p>
        
        <div className="mt-4">
          <a 
            href={link} 
            className="inline-flex items-center justify-center w-full px-4 py-2 font-medium hover:underline"
            style={{ color: teamColors.secondary }}
          >
            Ver detalles del evento →
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
