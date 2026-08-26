import SkillBadgeComponent from "~/components/skill-badge";
import { Card } from "~/components/ui/card";
import type { ProfileSkill } from "~/features/profile/types";

interface ProfileAboutCardProps {
  about?: string;
  skills?: Array<string | ProfileSkill>;
}

export default function ProfileAboutCard({
  about,
  skills,
}: ProfileAboutCardProps) {
  return (
    <Card className="space-y-6 rounded-3xl p-6 shadow-none sm:p-8">
      <div>
        <h2 className="mb-3 border-b pb-3 text-lg font-bold">About</h2>
        <p className="text-sm leading-6 font-semibold text-slate-600 dark:text-slate-400">
          {about}
        </p>
      </div>
      {skills && skills.length > 0 && (
        <div>
          <h2 className="mb-3 border-b pb-3 text-lg font-bold">Skills</h2>
          <div className="flex flex-wrap items-center gap-2">
            {skills?.map((skill, index) => {
              const name = typeof skill === "string" ? skill : skill.name;
              const key =
                typeof skill === "string" ? `${name}-${index}` : skill.id;
              return <SkillBadgeComponent key={key} skill={name} />;
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
