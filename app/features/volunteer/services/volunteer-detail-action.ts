import {
  uploadDocumentApplication,
  ApplyApplication,
  ApplyBatchApplication,
  SaveVolunteerOpportunity,
  UnsaveVolunteerOpportunity,
  SubmitVolunteerReport,
} from "~/api/volunteer";
import {
  UploadApplicationDocumentSchema,
  ApplyApplicationInputSchema,
  BatchApplyApplicationInputSchema,
  type UploadApplicationDocumentInput,
  type SubmitVolunteerReportInput,
} from "~/features/volunteer/types";
import type { Route as VolunteerDetailRoute } from "project-types/volunteer/route/+types/volunteer.$id";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import {
  transformActionResponse,
  errorActionResponse,
} from "~/lib/server/action-response.server";

export async function VolunteerDetailAction({
  request,
  params,
}: VolunteerDetailRoute.ActionArgs) {
  const id = params.id;
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "save-opportunity") {
    try {
      const result = await SaveVolunteerOpportunity(request, id);
      return transformActionResponse(
        result?.data ?? { ok: false, message: "Unexpected response format" },
      );
    } catch (error) {
      return transformActionResponse(error);
    }
  }

  if (actionType === "unsave-opportunity") {
    try {
      const result = await UnsaveVolunteerOpportunity(request, id);
      return transformActionResponse(
        result?.data ?? { ok: false, message: "Unexpected response format" },
      );
    } catch (error) {
      return transformActionResponse(error);
    }
  }

  if (actionType === "report-opportunity") {
    const opportunityId =
      String(formData.get("opportunityId") ?? "").trim() || id;
    const typeId = String(formData.get("typeId") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!opportunityId) {
      return errorActionResponse("Opportunity ID is required for reporting.");
    }

    if (!typeId) {
      return errorActionResponse("Please select a reason for reporting.");
    }

    const input: SubmitVolunteerReportInput = {
      opportunityId,
      typeId,
      description: description || undefined,
    };

    try {
      const result = await SubmitVolunteerReport(request, input);
      return transformActionResponse(result.data);
    } catch (error) {
      if (error instanceof Response) throw error;
      if (error instanceof AuthSessionExpiredError) {
        return errorActionResponse(
          "Your session expired. Please log in again.",
        );
      }
      return transformActionResponse(error);
    }
  }

  if (actionType === "apply-application") {
    const rawFiles = formData.getAll("files") as unknown[];
    const files = rawFiles.filter(
      (f): f is File => f instanceof File && (f as File).size > 0,
    );

    let supportingDocuments: { name: string; key: string }[] = [];

    if (files.length > 0) {
      const input: UploadApplicationDocumentInput = {
        opportunityId: id,
        files: files.map((file) => ({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        })),
      };

      try {
        const validatedInput = UploadApplicationDocumentSchema.parse(input);
        try {
          const result = await uploadDocumentApplication(
            request,
            validatedInput,
          );
          const upload = result.data.uploads;

          supportingDocuments = await Promise.all(
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

              return {
                name: uploadInput.supportingDocument.name,
                key: uploadInput.supportingDocument.key,
              };
            }),
          );
        } catch (error) {
          return transformActionResponse(error);
        }
      } catch (error) {
        return transformActionResponse(error);
      }
    }

    const dataStr = formData.get("data");
    if (!dataStr) return errorActionResponse("Missing data field");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(dataStr.toString());
    } catch {
      return errorActionResponse("Invalid JSON in data field");
    }

    try {
      const applyInput = ApplyApplicationInputSchema.parse({
        ...data,
        supportingDocuments,
      });

      try {
        const result = await ApplyApplication(request, applyInput);
        if (result === null) {
          return errorActionResponse("Failed to submit application");
        }
        return transformActionResponse(result);
      } catch (applyError) {
        return transformActionResponse(applyError);
      }
    } catch (error) {
      return transformActionResponse(error);
    }
  }
  // New batch apply action
  if (actionType === "apply-batch-application") {
    const rawFiles = formData.getAll("files") as unknown[];
    const files = rawFiles.filter(
      (f): f is File => f instanceof File && (f as File).size > 0,
    );

    let supportingDocuments: { name: string; key: string }[] = [];

    if (files.length > 0) {
      const input: UploadApplicationDocumentInput = {
        opportunityId: id,
        files: files.map((file) => ({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        })),
      };

      try {
        const validatedInput = UploadApplicationDocumentSchema.parse(input);
        try {
          const result = await uploadDocumentApplication(
            request,
            validatedInput,
          );
          const upload = result.data.uploads;

          supportingDocuments = await Promise.all(
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

              return {
                name: uploadInput.supportingDocument.name,
                key: uploadInput.supportingDocument.key,
              };
            }),
          );
        } catch (error) {
          return transformActionResponse(error);
        }
      } catch (error) {
        return transformActionResponse(error);
      }
    }

    const dataStr = formData.get("data");
    if (!dataStr) return errorActionResponse("Missing data field");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(dataStr.toString());
    } catch {
      return errorActionResponse("Invalid JSON in data field");
    }

    try {
      const applyInput = BatchApplyApplicationInputSchema.parse({
        ...data,
        supportingDocuments,
      });
      try {
        const result = await ApplyBatchApplication(request, applyInput);
        if (result === null) {
          return errorActionResponse("Failed to submit batch application");
        }
        return transformActionResponse(result);
      } catch (applyError) {
        return transformActionResponse(applyError);
      }
    } catch (error) {
      return transformActionResponse(error);
    }
  }
  return errorActionResponse("Invalid action type");
}
