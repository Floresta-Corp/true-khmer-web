import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

interface MyspaceBioCardProps {
  bio: string;
  skills: string[];
}

export default function MyspaceBioCard({ bio, skills }: MyspaceBioCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
      <CardHeader className="space-y-4 p-6  border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900">
          About
        </CardTitle>
        <Separator />
        {/* space-y-4 handles the gap between paragraphs nicely */}
        <div className="max-w-3xl text-sm leading-6 text-slate-700 space-y-4">
          {bio}
        </div>
      </CardHeader>

      <CardContent className="">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Skills</h3>
        <Separator />
        {skills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-slate-100 bg-slate-50/50 px-4 py-2 text-xs font-medium text-slate-800"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No skills listed.</p>
        )}
      </CardContent>
    </Card>
  );
}
