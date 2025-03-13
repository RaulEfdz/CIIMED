import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SocialLink } from "./data";

export interface SocialMediaSectionProps {
  links: SocialLink[];
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  links,
}) => {
  return (
    <Card className="mb-10 shadow-md">
      <CardContent>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Redes Sociales</h2>
        <ul className="flex space-x-4">
          {links.map((link) => (
            <li key={link.platform}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                {link.platform}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

SocialMediaSection.displayName = "SocialMediaSection";