export type LogEntry = {
    _id?: string;
    title: string;
    content: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
};
export type RagQuery = { query: string; top_k?: number };
export type RagResult = { text: string; score: number; source?: string };
