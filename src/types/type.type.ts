import { TBaseTimestamps } from "./base.type";

export type TType = {
    id: number;
    name: string;
    slug: string;
    entityType: string;
    description: string;
} & TBaseTimestamps;
