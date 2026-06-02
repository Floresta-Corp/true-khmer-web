import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

interface MyspaceBioCardProps {
  bio: string;
  skills: string[];
}

export default function MyspaceBioCard({ bio, skills }: MyspaceBioCardProps) {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Me</CardTitle>
          <p className="text-sm text-gray-600 ">{bio}</p>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-3" />

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-[#001D3D] font-medium text-xs px-3 py-1 rounded-full border"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No skills listed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
