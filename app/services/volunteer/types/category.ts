export interface CreateVolunteerCategoryResponse {
    ok: boolean;
    category: VolunteerCategory;
}

export interface GetVolunteerCategoriesResponse {
    ok: boolean
    categories: VolunteerCategory[];
}

export interface VolunteerCategory {
    id: string;
    slug?: string;
    name?: string;
    description?: string;
    iconKey?: string;
    displayOrder?: number;
    status?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
    archivedAt?: string;
}

export interface CreateVolunteerCategoryInput {
    name: string;
    slug: string;
    description: string | null;
    iconKey: string | null;
    status: VolunteerCategoryStatus;
}

enum VolunteerCategoryStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    HIDDEN = "HIDDEN",
}
