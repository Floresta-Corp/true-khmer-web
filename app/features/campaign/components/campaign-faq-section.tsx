import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "True Khmer Campaigns",
    answer:
      "True Khmer present yearlong campaigns, aiming at creating essential dialogues around subjects that matter. A single theme, essential for our nation's healthy growth, will be selected every two months and put forth through the launching of a national campaign using True Khmer's channels and propagated and amplified by our partners and members.",
  },
  {
    question: "Campaign program",
    answer:
      "The True Khmer campaigns road map for this year is composed of 6 sessions each launched for a period of three to four weeks, approximately every 2 months. This allows constant communication without overcharging the narrative, respecting the urgency by keeping a gentle pressure on our audience, opening up new perspectives, and leading to a national understanding of the importance of the role the Cambodian people and private sector have to play in the growth of our economy and the development of our country.",
  },
  {
    question: "Participation",
    answer:
      "The efficiency of the True Khmer movement is in the hands of its partners and members, every participating company will receive the campaign guidelines in advance, and will be invited to launch its own campaign aligned with the common theme but adapted to the reality of its business. Our members are then invited to participate in the dialogue and propagate the message ensuring it reaches all of our brothers and sisters across the country.",
    highlight: "All Khmer united for a great Cambodia",
  },
];

export function CampaignFaqSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <img
          src="/images/campaign/Campaign.webp"
          alt="Cambodian dancer"
          className="mx-auto h-90 w-full object-contain sm:h-120 lg:h-150"
          loading="lazy"
        />

        <div>
          <p className="text-sm font-semibold text-[#2f6fe4]">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#333333] sm:text-[36px]">
            About the Campaign
          </h2>

          <Accordion
            type="single"
            collapsible
            defaultValue={faqs[0].question}
            className="mt-8"
          >
            {faqs.map(({ question, answer, highlight }) => (
              <AccordionItem
                key={question}
                value={question}
                className="border-[#e2e8f0]"
              >
                <AccordionTrigger className="py-5 text-lg font-semibold text-[#333333] hover:text-[#1c5dd4] hover:no-underline aria-expanded:text-[#1c5dd4] **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-current sm:text-xl">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="text-base leading-relaxed text-[#606060]">
                    {answer}
                    {highlight && (
                      <strong className="font-semibold text-[#1c5dd4]">
                        {" "}
                        {highlight}
                      </strong>
                    )}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
