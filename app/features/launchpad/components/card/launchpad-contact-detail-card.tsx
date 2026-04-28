import { Mail, UserCheck } from "lucide-react";
import SectionInputCard from "~/components/section-input-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import UserProfileContactTab from "../user-profile-contact-tab";
import DifferentContactTab from "../different-contact-tab";
import { Button } from "~/components/ui/button";

export default function LaunchpadContactDetailCard() {
  return (
    <Tabs defaultValue="user-profile" asChild className="w-full transition-all">
      <SectionInputCard
        header={{
          title: "Contact Details",
          icon: <Mail size={24} className="text-blue-500" />,
          required: true,
          action: (
            <TabsList className="border border-[#F1F5F9] bg-[#F8FAFC] font-bold p-[4.3px] rounded-lg gap-1">
              <TabsTrigger
                value={"user-profile"}
                className="data-[state=active]:text-blue-500 px-3.75 py-2 rounded-lg"
              >
                <UserCheck />
                User Profile
              </TabsTrigger>
              <TabsTrigger
                value={"different-contact"}
                className="data-[state=active]:text-blue-500 px-3.75 py-2 rounded-lg"
              >
                Different Contact
              </TabsTrigger>
            </TabsList>
          ),
        }}
      >
        <TabsContent value="user-profile">
          <UserProfileContactTab />
        </TabsContent>
        {/* <TabsContent value={"different-contact"}>
          <DifferentContactTab />
        </TabsContent> */}
      </SectionInputCard>
    </Tabs>
  );
}
