import { TBaseTimestamps } from "./base.type";

export type TType = {
    id: string;
    name: string;
    slug: string;
    entityType: string;
    description: string;
} & TBaseTimestamps;
