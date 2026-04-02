export interface Category {
    id: string;
    name: string;
}

export interface GetCategoriesListResponse {
    ok: boolean;
    categories: Category[];
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    displayOrder: number;
    status: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    archivedAt: null;
    questionCount: number;
}

export type CategoriesPicker = {
    id: string;
    name: string;
    count?: number;
};