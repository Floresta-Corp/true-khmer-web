import { BoardMember, ExecutiveMember } from "./teamMembers";
import { ambassadors, boardMembers, executiveMembers } from "../lib/members";

export function TeamSection() {
  return (
    <div className="bg-base-100 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="text-md mb-3 font-semibold text-[#1c97d4] uppercase">
          Our Team
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-[#243d95] sm:text-5xl">
          The minds behind the initiative
        </h2>
        <p className="mt-6 text-lg text-gray-500">
          The True Khmer initiative is led by a board of dedicated and strong
          Khmer leaders who share the belief that "Khmer is enough" and that our
          future is in our hands. Our board is augmented by a committed and
          experienced executive team that wheels behind the scenes to drive the
          change envisioned by our community.
        </p>

        {/* Board Members Section */}
        <div className="mt-20">
          <h3 className="mb-12 text-2xl font-semibold text-[#243d95] lg:text-4xl">
            Board Members
          </h3>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {boardMembers.map((member) => (
              <BoardMember
                key={member.name}
                name={member.name}
                imageUrl={member.imageUrl}
              />
            ))}
          </div>
        </div>

        {/* Ambassador Section */}
        <div className="mx-auto mt-20 w-full max-w-6xl">
          <h3 className="mb-12 text-center text-2xl font-semibold text-[#243d95] lg:text-4xl">
            Ambassadors Board
          </h3>

          <div className="flex w-full flex-col items-center gap-y-12 sm:flex-row sm:items-start sm:justify-between">
            {ambassadors.map((member) => (
              <BoardMember
                key={member.name}
                name={member.name}
                imageUrl={member.imageUrl}
                imagePosition={member.imagePosition}
                imageTransform={member.imageTransform}
              />
            ))}
          </div>
        </div>

        {/* Executive Board Members Section */}
        <div className="mt-20 lg:mt-32">
          <h3 className="mb-12 text-2xl font-semibold text-[#243d95] lg:text-4xl">
            Executive Board Members
          </h3>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-4 lg:mx-0 lg:max-w-none">
            {executiveMembers.map((member) => (
              <ExecutiveMember
                key={member.name}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
