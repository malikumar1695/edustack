export type Role = {
    id: string;
    name: string;
    permissions: { id: string; name: string }[];
};