import { apiRequestWithSession, ProtectedApiError } from "~/lib/server/api-client.server";
import type { CreateVolunteerCategoryInput, CreateVolunteerCategoryResponse, GetVolunteerCategoriesResponse } from "../types/category";

export async function createCategory(request: Request, body: CreateVolunteerCategoryInput) {
    try {
        const result = await apiRequestWithSession<CreateVolunteerCategoryResponse, CreateVolunteerCategoryInput>(
            request,
            `/volunteer/categories`,
            {
                method: "POST",
                body: body,
            },
        );
        return result;
    } catch (error) {
        if (error instanceof ProtectedApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function getVolunteerCategories(request: Request) {
    try {
        const result = await apiRequestWithSession<GetVolunteerCategoriesResponse>(request, `/volunteer/categories`, {
            method: "GET",
        });
        return result;
    } catch (error) {
        if (error instanceof ProtectedApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}