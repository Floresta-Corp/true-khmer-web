import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Globe,
  Info,
  Mail,
  MapPin,
  Shield,
  Target,
  Users,
  Zap,
} from "lucide-react";
import type { VolunteerPost } from "~/lib/post";
import { Button } from "~/components/ui/button";
import EmptyPost from "../components/EmptyPost";
import VolunteerApplicationDialog from "../components/dialog/VolunteerApplicationDialog";
import BackToVolunteerButton from "../components/BackToVolunteerButton";

const coverImage =
  "https://www.figma.com/api/mcp/asset/b7008d38-7e7e-480c-9520-1c39a524a5f5";

const responsibilities = [
  "Assist professional archeologists in documenting site conditions",
  "Catalog fragile carvings and annotate preservation priorities",
  "Photograph key artifacts and log findings in the field report",
  "Support local teams with safe site-mapping coordination",
];

const requirements = [
  "Physical fitness for walking in tropical environments",
  "Comfort working outdoors for extended periods",
  "Basic note-taking and reporting discipline",
  "Respect for cultural heritage and local customs",
];

const benefits = [
  "Hands-on mentorship from conservation experts",
  "Field certification for heritage preservation support",
  "Networking with researchers and local cultural teams",
  "Direct contribution to Cambodia's digital heritage archive",
];

interface VolunteerDetailPageProps {
  opportunityId?: string;
  volunteer?: VolunteerPost;
}

export function VolunteerDetailPage({ volunteer }: VolunteerDetailPageProps) {
  if (!volunteer) {
    return <EmptyPost />;
  }

  const roles =
    volunteer?.availableRoles?.length > 0
      ? volunteer.availableRoles
      : [
          {
            id: 1,
            title: "Temple Restoration Support",
            commitment: "Full week",
            spotLeft: 3,
            responsibilities,
            requirements,
          },
        ];

  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        <BackToVolunteerButton />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex min-w-0 flex-col gap-4 md:gap-8">
            <article className="overflow-hidden rounded-t-3xl border border-[#e1e7ef]">
              <div className="relative h-70 px-5.25 pb-5.25 pt-50.5">
                <img
                  src={coverImage}
                  alt="Temple restoration volunteers"
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

                <div className="relative flex items-end gap-3">
                  <div className="size-14 rounded-2xl border border-[#f3f4f6] bg-white shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[3.5px] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.12px] text-[#2f6fe4]">
                        Heritage
                      </span>
                      <span className="rounded-[3.5px] bg-white px-2 py-0.5 text-[10px] font-semibold tracking-[0.12px] text-[#fb3748]">
                        {volunteer?.status ?? "Urgent"}
                      </span>
                    </div>
                    <h1 className="truncate text-[26px] font-semibold leading-8 tracking-[0.24px] text-white">
                      {volunteer?.title ?? "Temple Restoration Support"}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 rounded-b-[14px] border-t border-[#e1e7ef] bg-white p-8">
                <div className="grid gap-6 border-b border-[#f9fafb] pb-5.5 pt-5.25 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
                      <MapPin className="size-[10.5px]" /> Location
                    </p>
                    <p className="text-sm font-semibold text-[#4a5565]">
                      {volunteer?.location ?? "Siem Reap"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
                      <Clock3 className="size-[10.5px]" /> Commitment
                    </p>
                    <p className="text-sm font-semibold text-[#4a5565]">
                      {volunteer?.commitment ?? "Full week"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
                      <Calendar className="size-[10.5px]" /> Duration
                    </p>
                    <p className="text-sm font-semibold text-[#4a5565]">
                      {volunteer?.duration ?? "1 week"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
                      <Users className="size-[10.5px]" /> Applicants
                    </p>
                    <p className="text-sm font-semibold text-[#4a5565]">
                      {volunteer?.applicants ?? 7}/
                      {volunteer?.totalApplicants ?? 10}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
                    Project Overview
                  </h2>
                  <p className="text-[15px] font-medium leading-[24.375px] tracking-[-0.23px] text-[#4a5565]">
                    {volunteer?.overview ??
                      "Join the Khmer Heritage Trust in a critical mission to preserve our nation's architectural history. We are looking for dedicated volunteers to help document and protect delicate 10th-century carvings at lesser-known temple sites in the Siem Reap region. Your work will directly contribute to the digital archives used by global scholars and local preservationists."}
                  </p>
                </div>

                <div className="space-y-5">
                  <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
                    <Users className="size-[17.5px] text-[#2563eb]" />
                    Available Roles ({roles.length})
                  </h2>

                  <div className="space-y-5">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="overflow-hidden rounded-[14px] border border-[#e1e7ef]"
                      >
                        <div className="flex items-center justify-between px-5.25 py-6">
                          <div className="flex items-center gap-3.5">
                            <div className="flex size-5.25 items-center justify-center rounded-full border-2 border-[#2f6fe4] bg-[#2f6fe4]">
                              <div className="size-1.75 rounded-full bg-white" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-[#0a0a0a]">
                                {role.title}
                              </h3>
                              <p className="mt-1 flex items-center gap-2 text-[11px] font-bold text-[#99a1af]">
                                {role.commitment}
                                <span className="size-[3.5px] rounded-full bg-[#d1d5dc]" />
                                <span className="text-[#009966]">
                                  {role.spotLeft} spots left
                                </span>
                              </p>
                            </div>
                          </div>
                          <ChevronDown className="size-[17.5px] text-[#2f6fe4]" />
                        </div>

                        <div className="border-t border-black/10 px-5.25 pt-7.25">
                          <div className="grid gap-5 lg:grid-cols-2">
                            <div className="space-y-3.5">
                              <h4 className="flex items-center gap-2 text-sm font-bold text-[#030213]">
                                <Target className="size-3.5 text-[#2f6fe4]" />
                                Responsibilities
                              </h4>
                              <ul className="space-y-3.5">
                                {role.responsibilities.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
                                  >
                                    <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3.5">
                              <h4 className="flex items-center gap-2 text-sm font-bold text-[#030213]">
                                <Zap className="size-3.5 text-[#fe9a00]" />
                                Requirements
                              </h4>
                              <ul className="space-y-3.5">
                                {role.requirements.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
                                  >
                                    <span className="mt-0.5 flex size-[17.5px] shrink-0 items-center justify-center rounded-full bg-[#fffbeb]">
                                      <Circle className="size-[5.25px] fill-[#fe9a00] text-[#fe9a00]" />
                                    </span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="my-7.25 flex justify-end border-t border-[#f3f4f6] pt-7.25">
                            <VolunteerApplicationDialog
                              role={role}
                              trigger={
                                <Button className="h-10 bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
                                  Apply for this Role
                                </Button>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
                <Award className="size-[17.5px] text-[#2f6fe4]" />
                Volunteer Benefits
              </h2>
              <ul className="mt-5 space-y-3.5">
                {(volunteer?.benefits?.length
                  ? volunteer.benefits
                  : benefits
                ).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm font-medium leading-[22.75px] text-[#4a5565]"
                  >
                    <CheckCircle2 className="mt-0.5 size-[17.5px] shrink-0 text-[#009966]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.44px] text-[#030213]">
                <Target className="size-[17.5px] text-[#2f6fe4]" />
                Project Impact
              </h2>
              <p className="mt-5 text-[15px] font-medium leading-[24.375px] tracking-[-0.23px] text-[#4a5565]">
                {volunteer?.projectImpact ??
                  "Lorem ipsum dolor sit amet consectetur. Pretium nulla tellus volutpat augue vulputate amet. Id facilisis elit aliquam mattis. Pellentesque tristique eget mauris tempus egestas sapien libero. In tincidunt duis volutpat pellentesque mauris ac lacus nisi a. Gravida nulla risus massa viverra praesent. Elit malesuada condimentum neque in amet eget. Tincidunt diam nulla lectus."}
              </p>
            </article>

            <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="size-12.25 rounded-2xl border border-[#f3f4f6] bg-[#f9fafb]" />
                  <div>
                    <p className="flex items-center gap-1.5 text-lg font-semibold text-[#030213]">
                      {volunteer?.createdBy.profile.name ?? "User Profile Name"}
                      <Shield className="size-3.5 text-[#2f6fe4]" />
                    </p>
                    <p className="text-[13px] font-medium uppercase tracking-[1.22px] text-[#6a7282]">
                      {volunteer?.createdBy.profile.status ?? "Premium Partner"}
                    </p>
                  </div>
                </div>
                <Button className="h-9 bg-[#2f6fe4] px-4 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
                  View Profile
                </Button>
              </div>

              <div className="mt-[22px] grid gap-[21px] border-t border-[#f9fafb] pt-[22px] text-[13px] font-medium text-[#4a5565] sm:grid-cols-3">
                <p className="flex items-center gap-2.5">
                  <Globe className="size-3.5" />
                  {volunteer?.createdBy.details.website ?? "khmerheritage.org"}
                </p>
                <p className="flex items-center gap-2.5">
                  <Users className="size-3.5" />
                  {volunteer?.createdBy.details.opportunitiesCount ??
                    "10+"}{" "}
                  Opportunities
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin className="size-3.5" />
                  {volunteer?.createdBy.details.location ?? "Phnom Penh"}
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-[#6a7282]">
                  <span className="mr-2 inline-flex items-center gap-1 text-[#030213]">
                    <Info className="size-3.5" /> Have questions?
                  </span>
                  Contact the organizer directly for more details about this
                  role.
                </p>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border-[#d9e2ef] bg-white px-3 text-[12px] font-medium text-[#2f6fe4]"
                >
                  <Mail className="size-3.5" />
                  Contact Organizer
                  <ChevronDown className="size-3" />
                </Button>
              </div>
            </article>
          </section>

          <aside className="h-fit rounded-[14px] border border-[#e1e7ef] bg-white p-8 xl:sticky xl:top-24">
            <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
              Application Summary
            </h2>

            <div className="mt-6 space-y-[14px] border-b border-[#f9fafb] pb-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#99a1af]">Applicants</span>
                <span className="font-semibold text-[#4a5565]">
                  {(volunteer?.totalApplicants ?? 10) -
                    (volunteer?.applicants ?? 7)}{" "}
                  spots open
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#99a1af]">Deadline</span>
                <span className="font-semibold text-[#4a5565]">
                  {volunteer?.deadline ?? "Dec 15, 2026"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#99a1af]">Commitment</span>
                <span className="font-semibold text-[#4a5565]">
                  {volunteer?.commitment ?? "Full week"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#99a1af]">Duration</span>
                <span className="font-semibold text-[#4a5565]">
                  {volunteer?.duration ?? "1 week"}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3.5">
              <VolunteerApplicationDialog role={roles[0]} />
              <Button
                variant="outline"
                className="h-10 w-full text-sm font-medium"
              >
                Save for Later
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-3.5 py-3 text-[11px] font-medium leading-[17px] text-[#6a7282]">
              <p className="flex items-start gap-2">
                <Info className="mt-0.5 size-3.5 shrink-0 text-[#9eacc0]" />
                Our team will review your application and contact you for a
                brief interview.
              </p>
            </div>

            <p className="mt-4 text-[11px] font-medium text-[#99a1af]">
              Opportunity ID: {volunteer.id ?? "1"}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
