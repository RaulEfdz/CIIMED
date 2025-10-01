import { novelties } from "./novelties";
import { categoriesTeam, team } from "./team";
import { NoveltyCardProps } from "@/components/customs/Cards/NoveltyCard";
import { TeamMember } from "@/components/customs/Features/Teams";

export interface typeDB {
    novelties: NoveltyCardProps[],
    team: TeamMember[],
    categoriesTeam: string[]
}

export const db: typeDB = {
    novelties: novelties,
    team: team,
    categoriesTeam: categoriesTeam
}