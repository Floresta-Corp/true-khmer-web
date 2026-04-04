export interface GetTrendingTagsResponse {
    ok: boolean;
    tags: Tag[];
}

export interface Tag {
    id: string;
    name: string;
    count: number;
}
