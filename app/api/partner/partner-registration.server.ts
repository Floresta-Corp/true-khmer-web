import { apiRequestPublic } from "~/lib/server/api-client.server";
import type {
  PartnerRegistrationRequest,
  PartnerRegistrationResponse,
} from "~/types/api-client";

// POST /v1/partner/registration — public partner registration submission.
export async function submitPartnerRegistration(
  request: Request,
  payload: PartnerRegistrationRequest,
) {
  return apiRequestPublic<
    PartnerRegistrationResponse,
    PartnerRegistrationRequest
  >(request, "/partner/registration", {
    method: "POST",
    body: payload,
  });
}
