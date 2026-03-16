import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function EmptyPost() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 md:px-12 lg:px-28">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        <Link
          to="/volunteer"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#9eacc0] hover:text-[#7b8aa1]"
        >
          <ChevronLeft className="size-4.5" />
          Back to volunteers
        </Link>

        <section className="rounded-[14px] border border-[#e1e7ef] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#030213]">
            Post not found
          </h1>
          <p className="mt-3 text-sm text-[#6a7282]">
            We could not find a volunteer post.
          </p>
          <div className="mt-6">
            <Button asChild className="bg-[#2f6fe4] hover:bg-[#245fca]">
              <Link to="/volunteer">Browse opportunities</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
