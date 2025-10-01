import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Target, 
  BookOpen, 
  Award,
  TrendingUp,
  ExternalLink,
  Building,
  Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectStatus, getProgressColor, formatBudget, getProjectDuration } from '@/hooks/useResearchProjects';

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export interface ResearchProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  status: string;
  category?: string;
  researchLine?: string;
  area?: string;
  priority: number;
  tags?: string[];
  currentProgress: number;
  principalInvestigator?: string;
  coInvestigators?: string[];
  budget?: number;
  currency?: string;
  fundingSource?: string;
  startDate?: string;
  endDate?: string;
  estimatedDuration?: string;
  publications?: number;
  citations?: number;
  featured: boolean;
  link?: string;
  slug: string;
  objectives?: string[];
  expectedResults?: string;
  methodology?: string;
  institutionalPartners?: string[];
  internationalPartners?: string[];
  studentParticipants?: number;
  createdAt?: string;
  updatedAt?: string;
  compact?: boolean; // Versión compacta del card
}

const ResearchProjectCard: React.FC<ResearchProjectCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  status,
  category,
  researchLine,
  priority,
  tags,
  currentProgress,
  principalInvestigator,
  coInvestigators,
  budget,
  currency,
  fundingSource,
  startDate,
  endDate,
  estimatedDuration,
  publications,
  citations,
  featured,
  link,
  objectives,
  expectedResults,
  institutionalPartners,
  internationalPartners,
  studentParticipants,
  compact = false
}) => {
  const [imageError, setImageError] = useState(false);
  const showImage = imageUrl && !imageError;
  
  const statusInfo = getProjectStatus(status);
  const progressColor = getProgressColor(currentProgress);
  const duration = getProjectDuration(startDate, endDate);

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm">
        {showImage && (
          <div className="relative h-32">
            <Image
              className="w-full h-full absolute inset-0 object-cover"
              alt={imageAlt || title}
              src={imageUrl!}
              fill
              onError={() => setImageError(true)}
            />
            {featured && (
              <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-sm text-xs font-bold">
                DESTACADO
              </span>
            )}
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-sm text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {priority > 7 && (
              <span className="text-red-500 text-xs font-bold">ALTA PRIORIDAD</span>
            )}
          </div>
          
          <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: teamColors.primary }}>
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso</span>
              <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${progressColor}`}
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {principalInvestigator || 'Sin investigador'}
            </span>
            {link && (
              <Link 
                href={link}
                className="text-xs flex items-center gap-1 hover:underline"
                style={{ color: teamColors.secondary }}
              >
                Ver más <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700 rounded-sm">
      {showImage && (
        <div className="relative h-48">
          <Image
            className="w-full h-full absolute inset-0 object-cover transform hover:scale-105 transition-transform duration-300"
            alt={imageAlt || title}
            src={imageUrl!}
            fill
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {featured && (
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
                DESTACADO
              </span>
            )}
            <span className={`px-3 py-1 rounded-sm text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          
          {priority > 7 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
              ALTA PRIORIDAD
            </span>
          )}
        </div>
      )}
      
      {!showImage && (featured || priority > 7) && (
        <div className="relative h-12 flex items-center justify-between px-4 pt-2">
          {featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
              DESTACADO
            </span>
          )}
          {priority > 7 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-sm text-sm font-bold">
              ALTA PRIORIDAD
            </span>
          )}
        </div>
      )}

      <CardContent className="p-6 bg-[#F2F2F2] dark:bg-neutral-900">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-sm text-xs font-medium">
                  {category}
                </span>
              )}
              {researchLine && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-sm text-xs font-medium">
                  {researchLine}
                </span>
              )}
            </div>
            {!showImage && (
              <span className={`px-2 py-1 rounded-sm text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: teamColors.primary }}>
            {title}
          </h3>
          
          <p className="text-gray-700 dark:text-neutral-300 line-clamp-3 mb-4">{description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Progreso
            </span>
            <span className="font-medium">{currentProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${progressColor} transition-all duration-300`}
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
          
          {/* Investigador Principal */}
          {principalInvestigator && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Investigador Principal</p>
                <p className="font-medium text-gray-900">{principalInvestigator}</p>
              </div>
            </div>
          )}

          {/* Duración */}
          {(startDate || estimatedDuration) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Duración</p>
                <p className="font-medium text-gray-900">{estimatedDuration || duration}</p>
              </div>
            </div>
          )}

          {/* Presupuesto */}
          {budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Presupuesto</p>
                <p className="font-medium text-gray-900">{formatBudget(budget, currency)}</p>
              </div>
            </div>
          )}

          {/* Publicaciones */}
          {publications !== undefined && publications > 0 && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Publicaciones</p>
                <p className="font-medium text-gray-900">{publications}</p>
              </div>
            </div>
          )}

        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-sm text-xs"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-300 text-gray-600 rounded-sm text-xs">
                  +{tags.length - 4} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Colaboraciones */}
        {(institutionalPartners?.length || internationalPartners?.length || studentParticipants) && (
          <div className="mb-4 text-sm">
            <p className="text-gray-500 mb-2">Colaboraciones:</p>
            <div className="flex flex-wrap gap-3">
              {institutionalPartners && institutionalPartners.length > 0 && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{institutionalPartners.length} institucional{institutionalPartners.length !== 1 ? 'es' : ''}</span>
                </div>
              )}
              {internationalPartners && internationalPartners.length > 0 && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{internationalPartners.length} internacional{internationalPartners.length !== 1 ? 'es' : ''}</span>
                </div>
              )}
              {studentParticipants && studentParticipants > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{studentParticipants} estudiante{studentParticipants !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Objetivos Preview */}
        {objectives && objectives.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-500">Objetivos principales:</p>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="line-clamp-1">{objective}</span>
                </li>
              ))}
              {objectives.length > 2 && (
                <li className="text-gray-500 text-xs">
                  +{objectives.length - 2} objetivo{objectives.length - 2 !== 1 ? 's' : ''} más
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {startDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Inicio: {new Date(startDate).toLocaleDateString('es-ES')}</span>
              </div>
            )}
            {citations !== undefined && citations > 0 && (
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span>{citations} citas</span>
              </div>
            )}
          </div>
          
          {link && (
            <Link 
              href={link}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium hover:underline transition-colors duration-300"
              style={{ color: teamColors.secondary }}
            >
              Ver proyecto completo
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchProjectCard;