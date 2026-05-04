import {
  uploadDocumentApplication,
  ApplyApplication,
} from "~/services/volunteer/server";
import {
  UploadApplicationDocumentSchema,
  ApplyApplicationInputSchema,
  type ApplyApplicationInput,
} from "~/services/volunteer/types";
import type { Route as VolunteerDetailRoute } from "project-types/volunteer/routes/+types/volunteer.$id";
import {
  transformActionResponse,
  successActionResponse,
  errorActionResponse,
} from "~/lib/server/action-response.server";

export async function VolunteerDetailAction({
  request,
  params,
}: VolunteerDetailRoute.ActionArgs) {
  const id = params.id;
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  if (actionType === "apply-application") {
    let supportingDocumentKeys: string[] = [];
    const files = formData.getAll("files") as File[];
    try {
      if (files.length > 0) {
      }
      const input = UploadApplicationDocumentSchema.parse({
        opportunityId: id,
        files: files.map((file) => ({
          contentType: file.type,
          fileSize: file.size,
        })),
      });

      try {
        const result = await uploadDocumentApplication(request, input);
        const upload = result.data.uploads;

        const uploadResult = await Promise.all(
          files.map(async (file, index) => {
            const uploadInput = upload[index];

            const uploadCloudflaredResult = await fetch(
              `${upload[index].uploadUrl}`,
              {
                headers: uploadInput.requiredHeaders,
                method: uploadInput.method,
                body: file,
              },
            );

            if (!uploadCloudflaredResult.ok) {
              throw new Error("Failed to upload file");
            }

            supportingDocumentKeys.push(uploadInput.supportingDocumentKey);
            return uploadCloudflaredResult.ok;
          }),
        );
        if (uploadResult) {
          const dataStr = formData.get("data");
          if (!dataStr) throw new Error("Missing data field");
          const data: ApplyApplicationInput = JSON.parse(dataStr.toString());

          const applyInput = ApplyApplicationInputSchema.parse({
            ...data,
            supportingDocumentKeys,
          });

          try {
            const result = await ApplyApplication(request, applyInput);
            return transformActionResponse(result);
          } catch (applyError) {
            return transformActionResponse(applyError);
          }
        }
      } catch (error) {
        return transformActionResponse(error);
      }
    } catch (error) {
      return transformActionResponse(error);
    }
  }
  return errorActionResponse("Invalid action type");
}
