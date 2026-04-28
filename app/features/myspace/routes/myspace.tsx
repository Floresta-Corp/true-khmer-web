import { Link } from "react-router";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
// Sidebar removed: page should not render the MySpaceSideBar
import { Button } from "~/components/ui/button";
import { MoreVertical } from "lucide-react";

export default function MySpacePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 space-y-6">
          <motion.div
            className="flex items-start justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Space</h1>
              <p className="text-sm text-muted-foreground">
                Visualize your growth and community contributions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={"/edit-profile"}>
                <Button variant="secondary" className="h-9">
                  Edit profile
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Figma Profile Header Card Implementation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="bg-white flex gap-8 items-start overflow-clip p-8 relative rounded-xl">
              {/* Avatar with border and shadow */}
              <div className="flex flex-col items-start shrink-0">
                <div className="bg-white border-8 border-[#f5f7f9] flex flex-col items-start justify-center overflow-clip p-2 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] size-40">
                  <img
                    src="http://localhost:3845/assets/e0d1a8db5a2330b9ca78f2b988f21aed4bdd7bac.png"
                    alt="Moran Hadad"
                    className="absolute bg-clip-padding border-0 border-transparent inset-0 max-w-none object-cover pointer-events-none size-full"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 24,
                    }}
                  />
                </div>
              </div>
              {/* Profile Info */}
              <div className="flex flex-1 flex-col gap-4 items-start min-w-0">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-start w-full">
                    <div className="flex flex-1 flex-col gap-2 justify-center min-w-0">
                      <p className="font-bold text-[26px] leading-9.75 text-[#2c2f31] whitespace-nowrap">
                        Moran Hadad
                      </p>
                      <p className="font-medium text-[18px] leading-6.75 text-[#65758b] whitespace-nowrap">
                        Senior Product Designer
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start max-w-xl w-full">
                    <p className="font-medium text-[14px] leading-5.25 text-[#595c5e]">
                      Dedicated to ecological restoration and sustainable urban
                      development across Southeast Asia.
                    </p>
                  </div>
                </div>
                {/* Social Buttons */}
                <div className="flex items-end w-full">
                  <div className="flex gap-2 items-center">
                    {/* LinkedIn Button */}
                    <a
                      href="#"
                      className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <img
                        src="http://localhost:3845/assets/876e3cf6bb022b335a12648c5a9dcd118d5e5ff3.svg"
                        alt="LinkedIn"
                        className="size-4"
                      />
                    </a>
                    {/* Facebook Button */}
                    <a
                      href="#"
                      className="bg-[#f1f5f9] rounded-full flex items-center justify-center size-8 hover:bg-[#e9f0ff] transition-colors"
                      aria-label="Facebook"
                    >
                      <img
                        src="http://localhost:3845/assets/ce7af6c278d080b514abe053b62c266456043de6.svg"
                        alt="Facebook"
                        className="size-4"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Impact Points
                </CardDescription>
                <img
                  src="http://localhost:3845/assets/70bc6784b1bab91452ac25b603fb5f14bf4738c0.svg"
                  alt=""
                  className="h-4.25 w-4.25 shrink-0"
                />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
                10
              </CardTitle>
            </Card>

            <Card className="flex h-full flex-col items-start justify-between rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Current Tier
                </CardDescription>
                <img
                  src="http://localhost:3845/assets/c17863c1f78b17afb9f9b03fbed4517dfd6806f2.svg"
                  alt=""
                  className="h-5.25 w-4 shrink-0"
                />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
                Bronze
              </CardTitle>
              <div className="mt-6 flex w-full flex-col gap-2">
                <div className="h-2 w-full rounded-full bg-[#f1f5f9]" />
                <p className="text-[10px] leading-3.75 text-[#94a3b8]">
                  Next tier: Silver (100 pts)
                </p>
              </div>
            </Card>

            <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-4">
                <CardDescription className="text-base font-medium text-[#595c5e]">
                  Current Rank
                </CardDescription>
                <img
                  src="http://localhost:3845/assets/b50b2a4750c595b34b78b6d6f0079c0034b31e04.svg"
                  alt=""
                  className="h-5 w-5 shrink-0"
                />
              </div>
              <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#0f172a]">
                #128
              </CardTitle>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <Card>
              <div className="relative overflow-clip rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
                <div className="pb-4">
                  <CardTitle className="text-[20px] font-bold leading-7 text-[#2c2f31]">
                    Achievements
                  </CardTitle>
                </div>

                <div className="relative flex min-h-45 flex-col items-center justify-center py-2 text-center">
                  <img
                    src="http://localhost:3845/assets/9fd463df1094d9fde1def3ac5bca7846a4183db4.svg"
                    alt=""
                    className="mb-2 h-8 w-6 shrink-0"
                  />
                  <p className="text-base text-[#64748b]">No medals yet</p>
                  <Link
                    to="#"
                    className="pt-4 text-sm font-semibold text-[#2563eb]"
                  >
                    Browse achievements
                  </Link>
                </div>

                <img
                  src="http://localhost:3845/assets/fcb0a02a248920b5399e23297a1696250e088318.svg"
                  alt=""
                  className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 shrink-0 opacity-10"
                />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <Card className="relative overflow-clip rounded-xl bg-white p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex w-full items-center justify-between pb-8">
                <CardTitle className="text-[20px] font-bold leading-7 text-[#2c2f31]">
                  Points Earned Over Time
                </CardTitle>
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f8fafc]">
                    <img
                      src="http://localhost:3845/assets/5787f0c18721ff4a5dea95192b8804d2a9d951bb.svg"
                      alt=""
                      className="h-[11.667px] w-[10.5px] shrink-0"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-0.5 py-0.5">
                <div className="flex h-64 flex-col items-center justify-center">
                  <div className="flex h-30 flex-col items-center justify-center pb-6">
                    <div className="flex h-24 items-end gap-3">
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 19.19 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 38.39 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 28.8 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 57.59 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0]"
                        style={{ height: 43.19 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0] opacity-40"
                        style={{ height: 24 }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[#e2e8f0] opacity-20"
                        style={{ height: 14.39 }}
                      />
                    </div>
                  </div>

                  <p className="pb-4 text-[16px] leading-6 text-[#64748b]">
                    Your impact will appear here
                  </p>

                  <Link
                    to="#"
                    className="inline-flex items-center justify-center rounded-full bg-[#eff6ff] px-6 py-2 text-[14px] font-semibold leading-5 text-[#2563eb]"
                  >
                    Participate in events
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <Card className="overflow-clip rounded-xl bg-white p-8 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
              <div className="pb-8">
                <CardTitle className="text-[20px] font-semibold leading-7 text-[#111c2d]">
                  Recent Activity
                </CardTitle>
              </div>

              <div className="rounded-2xl border border-[#f8fafc] px-px py-12.25">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex h-20 w-16 items-start justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f9]">
                      <img
                        src="http://localhost:3845/assets/65c6f78db0c919da9fd702f7e1b152ec0edec4c3.svg"
                        alt=""
                        className="h-[22.5px] w-[22.5px] shrink-0"
                      />
                    </div>
                  </div>

                  <p className="text-[16px] leading-6 text-[#64748b]">
                    No activity yet
                  </p>

                  <p className="max-w-[320px] pt-1 text-center text-[14px] leading-5 text-[#94a3b8]">
                    Start interacting with the community to see your history here.
                  </p>

                  <Link
                    to="/forum"
                    className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold leading-5 text-[#2563eb]"
                  >
                    Visit community forum
                    <img
                      src="http://localhost:3845/assets/e44ca6eb4f611530aed41b802432436e5eb81267.svg"
                      alt=""
                      className="h-2 w-2 shrink-0"
                    />
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <aside className="lg:col-span-3">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <Card className="p-4 bg-linear-to-br from-blue-500 to-indigo-500 text-white">
                <h3 className="font-semibold text-lg">Grow together</h3>
                <p className="text-sm mt-2">
                  Inspire others by sharing this verified profile of community
                  achievement and social leadership.
                </p>
                <div className="mt-4">
                  <Button className="w-full bg-white text-blue-600">
                    Share profile
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top 10 Ranking</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/romdoul.svg" alt="" />
                          <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">Sarah Jenkins</div>
                          <div className="text-xs text-muted-foreground">
                            12.5k points
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">1</div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  );
}
