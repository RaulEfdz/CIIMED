import Image from "next/image";

export interface TeamMemberCardProps {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
  personalWebsite: string;
  bio?: string;
  className?: string;
}

const teamColors = {
  primary: "#285C4D",
  secondary: "#F4633A",
  dark: "#212322",
  light: "#f2f2f2"
};

export default function TeamMemberCard({ name, role, imageUrl, linkedinUrl, personalWebsite, bio, className = "" }: TeamMemberCardProps) {
  return (
    <div className={`flex flex-col dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-sm p-6 shadow-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Image
          src={imageUrl}
          alt={`Imagen de ${name}`}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div className="mt-4 sm:mt-0">
          <h3 className="font-medium" style={{ color: teamColors.dark }}>{name}</h3>
          <p className="text-xs uppercase text-gray-500 dark:text-neutral-400">{role}</p>
        </div>
      </div>
      {bio && (
        <p className="mt-4" style={{ color: teamColors.dark }}>{bio}</p>
      )}
      <div className="mt-4 flex gap-4">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: teamColors.secondary }}
        >
          LinkedIn
        </a>
        <a
          href={personalWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ color: teamColors.secondary }}
        >
          Website
        </a>
      </div>
    </div>
  );
}
