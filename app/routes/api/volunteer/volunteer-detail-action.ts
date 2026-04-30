import { ApplyApplication } from "~/services/volunteer/server";
import { ApplyApplicationInputSchema } from "~/services/volunteer/types";
import type { Route as VolunteerDetailRoute } from "project-types/volunteer/routes/+types/volunteer.$id"

export async function VolunteerDetailAction({ request }: VolunteerDetailRoute.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    if (actionType === "apply-application") {
        const files = formData.getAll("files");
        const data = formData.get('data')
        if (files.length > 0) {

        }

        // const input = ApplyApplicationInputSchema.parse(
        //     JSON.parse(data),
        // );
        // return await ApplyApplication(request, input);
    }
    return { error: "Invalid action type" }
}