import { NewsCardProps } from "@/components/customs/Cards/NewsCard";
import { Events } from "./events";
import { News } from "./news";
import { novelties } from "./novelties";
import { categoriesTeam, team } from "./team";
import { EventCardProps } from "@/components/customs/Cards/EventCard";
import { NoveltyCardProps } from "@/components/customs/Cards/NoveltyCard";
import { TeamMember } from "@/components/customs/Features/Teams";

export interface typeDB {
    news:  NewsCardProps[],
    events:EventCardProps[],
    novelties: NoveltyCardProps[],
    team: TeamMember[],
    categoriesTeam: string[]
}

export const db: typeDB = {
    news:  News,
    events:Events,
    novelties: novelties,
    team: team,
    categoriesTeam: categoriesTeam
}