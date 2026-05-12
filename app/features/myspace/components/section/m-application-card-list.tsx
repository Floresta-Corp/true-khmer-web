import { useLoaderData } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import type { loader } from "../../routes/my-applications";

export default function MyApplicationCardList() {
  const { myApplication } = useLoaderData<typeof loader>();
  return (
    <Card className="w-full bg-white rounded-2xl overflow-hidden">
      <CardContent className="flex items-start bg-blue-400 h-full p-6 gap-6">
        <img className="bg-gray-200 h-40 w-62.5 rounded-lg" />
        <div className="flex-1 bg-red-500">test</div>
        <div></div>
      </CardContent>
    </Card>
  );
}
