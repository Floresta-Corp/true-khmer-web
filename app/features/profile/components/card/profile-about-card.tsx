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
    <Card className="rounded-3xl shadow-none p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-lg mb-3 pb-3 border-b font-bold">About</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-6 font-semibold">
          {about}
        </p>
      </div>
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 pb-3 border-b">Skills</h2>
          <div className="flex flex-wrap gap-2 items-center">
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
