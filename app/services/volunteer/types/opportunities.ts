import * as z from "zod";
import { PaginationSchema } from "~/services/types";


export const ContactSchema = z.object({
    "email": z.string(),
    "telegramUsername": z.null(),
    "phone": z.null(),
    "websiteUrl": z.null(),
});
export type Contact = z.infer<typeof ContactSchema>;

export const RoleSchema = z.object({
    "id": z.string(),
    "title": z.string(),
    "commitmentLabel": z.string(),
    "capacity": z.number(),
    "responsibilities": z.array(z.string()),
    "requirements": z.array(z.string()),
    "displayOrder": z.number(),
});
export type Role = z.infer<typeof RoleSchema>;

export const OpportunitySchema = z.object({
    "id": z.string(),
    "categoryId": z.string(),
    "locationId": z.string(),
    "title": z.string(),
    "overview": z.string(),
    "communityImpact": z.null(),
    "durationLabel": z.string(),
    "commitmentLabel": z.string(),
    "applicationDeadline": z.string(),
    "coverImageKey": z.string(),
    "coverImageUrl": z.null(),
    "benefits": z.array(z.string()),
    "contact": ContactSchema,
    "status": z.string(),
    "publishedAt": z.null(),
    "createdBy": z.string(),
    "createdAt": z.string(),
    "updatedAt": z.string(),
    "roles": z.array(RoleSchema),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

export const GetVolunteerOpportunitiesResponseSchema = z.object({
    "ok": z.boolean(),
    "opportunities": z.array(OpportunitySchema),
    "pagination": PaginationSchema,
});
export type GetVolunteerOpportunitiesResponse = z.infer<typeof GetVolunteerOpportunitiesResponseSchema>;

export const GetVolunteerOpportunityByIdResponseSchema = z.object({
    "ok": z.boolean(),
    "opportunity": OpportunitySchema,
});
export type GetVolunteerOpportunityByIdResponse = z.infer<typeof GetVolunteerOpportunityByIdResponseSchema>;

export const PostVolunteerInputSchema = z.object({
    "categoryId": z.string(),
    "locationId": z.string(),
    "title": z.string(),
    "overview": z.string(),
    "communityImpact": z.null(),
    "durationLabel": z.string(),
    "commitmentLabel": z.string(),
    "applicationDeadline": z.string(),
    "benefits": z.array(z.string()),
    "contact": ContactSchema,
    "roles": z.array(RoleSchema),
    "coverImageKey": z.string(),
});
export type PostVolunteerInput = z.infer<typeof PostVolunteerInputSchema>;

export const VolunteerOpportunityFilterSchema = z.object({
    cursor: z.string().nullish(),
    locationId: z.string().nullish(),
    categoryId: z.string().nullish(),
    limit: z.number().nullish(),
    search: z.string().nullish(),
})

export type VolunteerOpportunityFilter = z.infer<typeof VolunteerOpportunityFilterSchema>;


export const ContactInputSchema = z.object({
    "email": z.string(),
    "telegramUsername": z.null(),
    "phone": z.null(),
    "websiteUrl": z.null(),
});
export type ContactInput = z.infer<typeof ContactInputSchema>;

export const RoleInputSchema = z.object({
    "title": z.string(),
    "commitmentLabel": z.string(),
    "capacity": z.number(),
    "responsibilities": z.array(z.string()),
    "requirements": z.array(z.string()),
});
export type RoleInput = z.infer<typeof RoleInputSchema>;

export const VolunteerOpportunityInputSchema = z.object({
    "categoryId": z.string(),
    "locationId": z.string(),
    "title": z.string(),
    "overview": z.string(),
    "communityImpact": z.null(),
    "durationLabel": z.string(),
    "commitmentLabel": z.string(),
    "applicationDeadline": z.string(),
    "benefits": z.array(z.string()),
    "contact": ContactInputSchema,
    "roles": z.array(RoleInputSchema),
    "coverImageKey": z.string(),
});
export type VolunteerOpportunityInput = z.infer<typeof VolunteerOpportunityInputSchema>;
