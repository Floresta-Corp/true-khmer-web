import {  uploadDocumentApplication } from "~/services/volunteer/server";
import {  UploadApplicationDocumentSchema  } from "~/services/volunteer/types";
import type { Route as VolunteerDetailRoute } from "project-types/volunteer/routes/+types/volunteer.$id"

export async function VolunteerDetailAction({ request, params }: VolunteerDetailRoute.ActionArgs) {
    const id = params.id;
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    if (actionType === "apply-application") {
        const files = formData.getAll("files") as File[];
        const data = formData.get('data')
        console.log(data)
        if (files.length > 0) {
            const input  = UploadApplicationDocumentSchema.parse({
                opportunityId: id,
                files: files.map(file => ({
                    contentType: file.type,
                    fileSize: file.size
                }))
            })
            // const result = await uploadDocumentApplication(request, input)

        }

        // const input = ApplyApplicationInputSchema.parse(
        //     JSON.parse(data),
        // );
        // return await ApplyApplication(request, input);
    }
    return { error: "Invalid action type" }
}