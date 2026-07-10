import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { BadgeCheck, Heart, ListChecks, Mail, Trophy } from "lucide-react";

export function meta() {
  return [
    { title: "Registration Success - Welcome to True Khmer" },
    {
      name: "description",
      content: "You have successfully submitted your application!",
    },
  ];
}

type RegistrationType = "member" | "partner";

export default function RegistrationSuccess() {
  const [animationStep, setAnimationStep] = useState(0);
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as RegistrationType) || "member";
  const isPartner = type === "partner";
  const kind = isPartner ? "partnership" : "membership";

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationStep(1), 300);
    const t2 = setTimeout(() => setAnimationStep(2), 700);
    const t3 = setTimeout(() => setAnimationStep(3), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-slate-950">
      {/* Decorative blurred glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-20 size-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-16 bottom-20 size-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-5xl text-center">
          {/* Main icon */}
          <div
            className={`mb-8 transform transition-all duration-700 ${
              animationStep >= 1
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-95 opacity-0"
            }`}
          >
            <div className="relative inline-block">
              <div className="absolute inset-4 animate-ping rounded-full bg-blue-500/20" />
              <div className="relative rounded-full bg-gradient-to-br from-[#243d95] to-blue-600 p-7 shadow-2xl">
                <BadgeCheck size={80} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div
            className={`mb-8 transform transition-all duration-700 ${
              animationStep >= 2
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-blue-600 to-[#243d95] bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              {isPartner
                ? "Partnership Application Submitted!"
                : "Membership Application Submitted!"}
            </h1>

            <div className="mx-auto max-w-2xl space-y-4">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Your{" "}
                <span className="font-semibold text-blue-600 uppercase">
                  {kind}
                </span>{" "}
                application for{" "}
                <span className="font-semibold text-blue-600 uppercase">
                  True Khmer
                </span>{" "}
                has been successfully submitted and is now under review.
              </p>
              <div className="rounded-lg border border-blue-600/40 bg-blue-600/10 p-4 text-sm">
                <p className="mb-2 flex items-center justify-center gap-2 font-medium text-slate-800 dark:text-slate-100">
                  <ListChecks size={20} />
                  What happens next?
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Our team will carefully review your {kind} application and
                  contact you within 2-3 business days with confirmation and the
                  next steps.
                </p>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div
            className={`mb-10 transform transition-all duration-700 ${
              animationStep >= 3
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              <SuccessCard
                icon={<Mail size={32} className="text-white" />}
                gradient="from-blue-500 to-blue-600"
                title="Check Your Email"
                description="A confirmation email has been sent with your application details and next steps."
              />
              <SuccessCard
                icon={<Trophy size={32} className="text-white" />}
                gradient="from-amber-500 to-orange-500"
                title="Under Review"
                description="Our team is reviewing your application. You'll hear from us soon!"
              />
              <SuccessCard
                icon={<Heart size={32} className="text-white" />}
                gradient="from-purple-500 to-purple-600"
                title="Pending Approval"
                description="Once approved, you'll gain access to our exclusive community."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessCard({
  icon,
  gradient,
  title,
  description,
}: {
  icon: React.ReactNode;
  gradient: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
      <div
        className={`mx-auto mb-4 w-fit rounded-full bg-gradient-to-br ${gradient} p-4 transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
