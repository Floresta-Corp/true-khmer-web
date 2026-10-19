const messages = [
  "The message is clear, our youth is exceptional and well equipped to play its role in our nation's future. Modern, creative, and smart, young Cambodians are eager to learn and are quick to the task once they receive the trust of their peers.",
  "Let's celebrate our capacity and the extraordinary opportunity we are presented with, building a nation, and shaping it in the image of its people. Cambodia is to be proactive, dynamic, and innovative, incentivizing action, and not shying away from difficulties.",
];

export function CampaignMessageSection() {
  return (
    <section className="bg-[#f8fafc] py-20 lg:py-24">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#2f6fe4]">Our Message</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#333333] sm:text-[36px]">
            Our Message & Objective
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {messages.map((message, index) => (
            <div key={message} className="flex items-start gap-6">
              <span className="text-7xl leading-none font-extrabold text-[#1c5dd4]/15 sm:text-8xl">
                {index + 1}
              </span>
              <p className="pt-2 text-base leading-relaxed text-[#606060]">
                {message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
