import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { getUser } from "~/lib/server/session.server";
import { motion } from "motion/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "True Khmer" },
    {
      name: "description",
      content: "Welcome to True Khmer - Your Khmer Community Platform",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <motion.section
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            Khmer Community Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, grow, and make an impact with the Khmer community
            worldwide. Join thousands of members building a stronger tomorrow
            together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={user ? "/myspace" : "/register"}>
              <Button size="lg" className="min-w-40">
                {user ? "Go to My Space" : "Get Started"}
              </Button>
            </Link>
            <Link to="/forum">
              <Button variant="outline" size="lg" className="min-w-40">
                Visit Forum
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">5,000+</CardTitle>
              <CardDescription>Active Members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Growing community of Khmer professionals and leaders
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">500+</CardTitle>
              <CardDescription>Events Hosted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Community events and gatherings worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">10,000+</CardTitle>
              <CardDescription>Impact Points</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Collective contributions to community growth
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Community Leaders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i, index) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card className="p-4 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-base">Community Leader</CardTitle>
                  <CardDescription>Senior Member</CardDescription>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to Join the Community?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Create your profile, connect with others, and start making an impact
            today.
          </p>
          <div className="pt-4">
            <Link to={user ? "/myspace" : "/register"}>
              <Button size="lg">{user ? "Go to My Space" : "Join Now"}</Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
