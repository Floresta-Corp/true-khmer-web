interface SkillBadgeComponentProps {
  skill: string;
}

export default function SkillBadgeComponent({
  skill,
}: SkillBadgeComponentProps) {
  return (
    <span className="rounded-full border border-slate-100 bg-slate-50/50 px-4 py-2 text-xs font-medium text-slate-800">
      {skill}
    </span>
  );
}
