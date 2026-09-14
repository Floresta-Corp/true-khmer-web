import type { LegalDocument } from "../types";
import { LEGAL } from "./legal-info";

/**
 * The terms of service.
 *
 * Structured around what the Platform actually offers — forum, events,
 * volunteering, Launchpad, courses, editorial content and partner packages —
 * because the clauses that matter in practice are the ones about who is
 * responsible when two members transact with each other through it. True Khmer
 * is the venue, not a party to those arrangements, and sections 8 to 11 are
 * where that is said plainly for each section of the site.
 */
export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  summary:
    "These terms are the agreement between you and True Khmer for use of our platform. They explain what we offer, what we ask of you as a member, and how disputes are handled. Please read them before you create an account.",
  sections: [
    {
      id: "agreement",
      title: "1. The agreement",
      blocks: [
        {
          kind: "p",
          text: `These Terms of Service (the "Terms") form a binding agreement between you and ${LEGAL.entityLong} ("True Khmer", "we", "us") covering your use of truekhmer.com and every service offered through it (the "Platform").`,
        },
        {
          kind: "p",
          text: "By creating an account, or by using the Platform at all, you accept these Terms and our [Privacy Policy](/privacy). If you do not accept them, please do not use the Platform.",
        },
        {
          kind: "p",
          text: 'If you accept these Terms on behalf of an organisation — as a partner, an employer, an event organiser or a course provider — you confirm that you are authorised to bind that organisation, and "you" means both you and it.',
        },
      ],
    },
    {
      id: "who-can-join",
      title: "2. Who can use the Platform",
      blocks: [
        {
          kind: "list",
          items: [
            `You must be at least ${LEGAL.minimumAge} years old.`,
            "You must give accurate information when you register, and keep it up to date.",
            "One person, one account. Do not create an account for someone else, impersonate anyone, or misrepresent your affiliation with an organisation.",
            "You must not use the Platform if we have previously suspended or removed your account, unless we agree in writing that you may return.",
          ],
        },
        {
          kind: "p",
          text:
            "You are responsible for your account and everything done through it. Keep your password private, turn on two-factor authentication if you can, and tell us at **" +
            LEGAL.contact.general +
            "** as soon as you suspect someone else has access.",
        },
      ],
    },
    {
      id: "the-services",
      title: "3. What the Platform offers",
      blocks: [
        {
          kind: "p",
          text: "True Khmer is a community platform. Depending on your account, it gives you access to:",
        },
        {
          kind: "list",
          items: [
            "**Forum** — public questions, answers and discussion between members.",
            "**Events** — event listings, registration and, where the organiser uses it, ticketing through our ticketing partner.",
            "**Volunteer** — volunteering opportunities posted by organisations, and applications to them.",
            "**Launchpad** — opportunities, roles and initiatives posted by organisations, and applications to them.",
            "**Education** — courses, lessons, quizzes and certificates of completion.",
            "**Khmer voices** — articles and editorial content published by True Khmer and its contributors.",
            "**Community** — profiles of partner organisations, and partner registration.",
            "**Your space and workspace** — your profile, saved items, applications, tickets, classes, and the tools for managing content you have posted.",
          ],
        },
        {
          kind: "p",
          text: "We are still building. We may add, change, suspend or withdraw any part of the Platform, and we will give reasonable notice of a change that materially reduces a feature you rely on, unless the change is needed for security, legal or urgent operational reasons.",
        },
      ],
    },
    {
      id: "conduct",
      title: "4. Community rules",
      blocks: [
        {
          kind: "p",
          text: "The Platform exists to help Cambodians find each other, learn and build. These rules protect that. You must not:",
        },
        {
          kind: "list",
          items: [
            "Post anything unlawful, defamatory, hateful, harassing, threatening, sexually explicit, or that incites violence or discrimination against a person or group.",
            "Post someone else's personal information without their consent, or share private messages, documents or images that are not yours to share.",
            "Impersonate another person or organisation, or misstate your identity, employer, qualifications or role.",
            "Post spam, chain messages, repeated promotional content, multi-level marketing schemes, or any offer that is misleading about what it is.",
            "Post fraudulent listings, opportunities that do not exist, or roles that require a candidate to pay a fee to be considered.",
            "Infringe anyone's copyright, trade mark or other rights, including by uploading course material, images or articles you do not have the rights to.",
            "Upload malware, attempt to gain unauthorised access to any account or system, probe or test the Platform's security, or interfere with its operation.",
            "Scrape, crawl or bulk-collect content or member information by automated means without our written permission, or use it to train a machine-learning model without our written permission.",
            "Use the Platform to collect candidates or contacts for a service unrelated to the community, or to send members unsolicited commercial messages.",
            "Misuse the reporting tools, or retaliate against a member who reports content in good faith.",
          ],
        },
        {
          kind: "p",
          text: `If you see something that breaks these rules, report it from the post itself, or write to **${LEGAL.contact.moderation}**.`,
        },
      ],
    },
    {
      id: "your-content",
      title: "5. Content you post",
      blocks: [
        {
          kind: "p",
          text: "What you post stays yours. We do not claim ownership of your questions, answers, listings, articles, courses, photographs or any other content you submit.",
        },
        {
          kind: "p",
          text: "To be able to show it, you grant True Khmer a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, adapt for formatting and display, publish and distribute the content you post, for the purpose of operating and promoting the Platform and the sections you posted it to. The licence lasts as long as the content is on the Platform, and ends when you delete it — except for copies retained in backups for a limited period, and for content others have already shared or quoted elsewhere.",
        },
        {
          kind: "p",
          text: "You confirm that you have the rights to everything you post, and that posting it does not breach anyone else's rights or any law.",
        },
        {
          kind: "p",
          text:
            "We are not obliged to monitor content, but we may review, edit the formatting of, restrict, remove or refuse to publish anything that breaks these Terms, is subject to a valid complaint, or exposes True Khmer or its members to legal risk. Where we remove your content or restrict your account, we will tell you why unless we are legally prevented from doing so, and you may ask us to reconsider by writing to " +
            LEGAL.contact.moderation +
            ".",
        },
        {
          kind: "p",
          text: "**Feedback.** If you send us suggestions for the Platform, we may use them without restriction or obligation to you.",
        },
      ],
    },
    {
      id: "opportunities",
      title: "6. Opportunities, volunteering and applications",
      blocks: [
        {
          kind: "p",
          text: "Launchpad and Volunteer listings are posted by the organisations and members behind them, not by True Khmer.",
        },
        { kind: "subheading", text: "If you post a listing" },
        {
          kind: "list",
          items: [
            "Describe the role, the organisation, the terms and any compensation accurately, and keep the listing current — close it once it is filled.",
            "Never ask an applicant for money, for payment of a fee, or for bank, card or payment credentials.",
            "Comply with the employment, labour, volunteering and anti-discrimination law that applies to you.",
            "Use the personal information in an application only to assess that application, handle it in line with the applicable data protection law, and delete it when it is no longer needed.",
          ],
        },
        { kind: "subheading", text: "If you apply" },
        {
          kind: "list",
          items: [
            "Your application, and the profile information attached to it, is sent to the organisation that posted the listing. From that point it is held under that organisation's own privacy policy.",
            "We do not verify organisations, listings or the statements made in them beyond basic moderation, and we do not guarantee that a role exists, that you will be contacted, or that any offer will be made or honoured.",
            "Use your judgement. Never pay to apply, and never send identity documents or payment details to someone who asks for them through a listing — tell us instead.",
          ],
        },
        {
          kind: "callout",
          text: "True Khmer is not an employer, a recruitment agency or a party to any agreement you reach with an organisation through the Platform. Any engagement, contract, placement or volunteering arrangement is between you and that organisation alone.",
        },
      ],
    },
    {
      id: "events",
      title: "7. Events and tickets",
      blocks: [
        {
          kind: "p",
          text: "Events listed on the Platform are run by their organisers. The organiser sets the programme, the venue, the prices and the entry conditions, and is responsible for running the event and for anything that happens at it.",
        },
        {
          kind: "list",
          items: [
            "Registration and ticketing for some events are handled by our ticketing partner, Plumpi. When you are taken there, that service's own terms and privacy policy apply in addition to these Terms.",
            "Cancellations, changes and refunds are the organiser's decision and are subject to the organiser's policy. True Khmer does not process refunds for events it does not run.",
            "An organiser may need to share attendee lists with a venue or a co-host in order to run the event; the organiser is responsible for telling you when it does.",
          ],
        },
      ],
    },
    {
      id: "education",
      title: "8. Courses and certificates",
      blocks: [
        {
          kind: "list",
          items: [
            "Courses are published by True Khmer and by course providers on the Platform. Providers are responsible for their own material and for holding the rights to it.",
            "Course material is licensed to you for your own learning. Do not copy, redistribute, resell or republish it, and do not share your account so that others can use an enrolment.",
            "Do not cheat in an assessment, share quiz answers, or obtain a certificate for work that is not yours. We may withdraw a certificate obtained that way.",
            "**A True Khmer certificate records completion of a course on this Platform. It is not an accredited academic or professional qualification, and it does not certify employment, licensing or regulatory status.**",
            "We may update or withdraw a course. If a course you are enrolled in is withdrawn, we will make a reasonable effort to give you access to what you had already completed.",
          ],
        },
      ],
    },
    {
      id: "partners",
      title: "9. Partners and membership packages",
      blocks: [
        {
          kind: "list",
          items: [
            "Partner registration is an application. We may accept or decline it, and we may end a partnership where the partner breaks these Terms or where continuing would damage the community's trust.",
            "Fees, the term, what is included and how it is invoiced are set out in the package you select and in any separate agreement signed with you. Unless that agreement says otherwise, fees are payable in advance and are non-refundable once the benefits of the package have begun.",
            "Partner badges, tier names and the True Khmer name and logo may be used only as described in the package or in written brand guidance we provide, only while the partnership is current, and never in a way that suggests we endorse a product, a claim or a third party.",
            "You are responsible for the accuracy of your organisation's profile, logo and photographs, and for holding the rights to them.",
          ],
        },
      ],
    },
    {
      id: "our-content",
      title: "10. Our rights in the Platform",
      blocks: [
        {
          kind: "p",
          text: "The Platform itself — its software, design, layout, graphics, text written by True Khmer, and the True Khmer name, logo and marks — belongs to True Khmer or to those who have licensed it to us, and is protected by copyright, trade mark and other laws.",
        },
        {
          kind: "p",
          text: "You may use the Platform as these Terms allow. You may not copy, modify, reverse engineer, resell, or create derivative works from it, or remove any notice of ownership from it, except where the law gives you a right we cannot restrict.",
        },
        {
          kind: "p",
          text: `If you believe content on the Platform infringes your rights, write to **${LEGAL.contact.legal}** with a description of the work, the URL of the content, and your contact details, and we will review it promptly.`,
        },
      ],
    },
    {
      id: "third-party",
      title: "11. Other services and links",
      blocks: [
        {
          kind: "p",
          text: "The Platform links to and embeds services run by others — sign-in, ticketing, video, maps, the websites of members and partners. We do not control them, we do not endorse them by linking to them, and we are not responsible for their content, their terms or their handling of your information. Read their terms before you rely on them.",
        },
      ],
    },
    {
      id: "suspension",
      title: "12. Suspension and ending your account",
      blocks: [
        {
          kind: "p",
          text: "You may stop using the Platform at any time and delete your account from Settings. Deleting your account removes your personal information as described in our [Privacy Policy](/privacy); some public content may remain where others took part in it.",
        },
        {
          kind: "p",
          text: `We may restrict features, remove content, suspend or terminate an account where a member breaks these Terms or the law, where an account is being used to harm other members, or where we are required to. Except where a serious or unlawful breach makes immediate action necessary, we will give notice and, where it is appropriate, a chance to put things right. Content and account records are retained for ${LEGAL.accountGraceDays} days after termination so that a decision can be reviewed, unless the law requires otherwise.`,
        },
        {
          kind: "p",
          text: "Sections that by their nature should survive the end of this agreement — content licences already granted, intellectual property, disclaimers, limitation of liability, indemnity and governing law — continue to apply.",
        },
      ],
    },
    {
      id: "disclaimers",
      title: "13. Disclaimers",
      blocks: [
        {
          kind: "p",
          text: 'The Platform is provided "as is" and "as available". To the fullest extent permitted by law, we make no warranty that it will be uninterrupted, secure, error-free, or that it will meet your requirements.',
        },
        {
          kind: "p",
          text: "Content posted by members, organisations, partners and course providers is theirs. We do not verify it, and we do not warrant that a listing, a course, an event, an article or an answer in the forum is accurate, complete or suitable for your purposes. Nothing on the Platform is legal, financial, medical or professional advice.",
        },
        {
          kind: "p",
          text: "Nothing in these Terms excludes a liability that cannot lawfully be excluded, including liability for death or personal injury caused by negligence, or for fraud.",
        },
      ],
    },
    {
      id: "liability",
      title: "14. Limitation of liability",
      blocks: [
        {
          kind: "p",
          text: "To the fullest extent permitted by law, True Khmer and its directors, employees and agents are not liable for any indirect, incidental, special, consequential or punitive loss, or for any loss of profits, revenue, business, goodwill, opportunity or data, arising out of or in connection with your use of the Platform.",
        },
        {
          kind: "p",
          text: "Our total liability to you for all claims arising in any 12-month period is limited to the greater of the amount you paid True Khmer in that period, or USD 100.",
        },
        {
          kind: "p",
          text: "Some jurisdictions do not allow certain limitations, so parts of this section may not apply to you. In that case our liability is limited as far as the applicable law allows.",
        },
      ],
    },
    {
      id: "indemnity",
      title: "15. Indemnity",
      blocks: [
        {
          kind: "p",
          text: "You agree to indemnify and hold True Khmer harmless from any claim, loss, liability or reasonable cost — including legal fees — arising from content you post, your use of the Platform, your breach of these Terms, or your infringement of the rights of another person or organisation.",
        },
      ],
    },
    {
      id: "law",
      title: "16. Governing law and disputes",
      blocks: [
        {
          kind: "p",
          text: `These Terms, and any dispute arising out of them or out of your use of the Platform, are governed by the laws of the ${LEGAL.jurisdiction}, without regard to its conflict-of-law rules. The courts of Phnom Penh, Kingdom of Cambodia, have jurisdiction, except where the law of your country of residence gives you the right to bring proceedings in your local courts.`,
        },
        {
          kind: "p",
          text: `Before starting proceedings, please write to us at **${LEGAL.contact.legal}** and give us 30 days to resolve the matter with you. Most disputes are settled faster that way.`,
        },
      ],
    },
    {
      id: "changes",
      title: "17. Changes to these Terms",
      blocks: [
        {
          kind: "p",
          text: "We may change these Terms as the Platform and the law develop. The date at the top shows when they last changed. For a material change we will give notice on the Platform or by email before it takes effect. Continuing to use the Platform after a change takes effect means you accept the revised Terms; if you do not, you may delete your account.",
        },
      ],
    },
    {
      id: "general",
      title: "18. General",
      blocks: [
        {
          kind: "list",
          items: [
            "**Entire agreement.** These Terms, the Privacy Policy and any agreement signed for a partner package are the whole agreement between us about the Platform.",
            "**Severability.** If a provision is found unenforceable, the rest stays in force.",
            "**No waiver.** If we do not enforce a provision on one occasion, we keep the right to enforce it later.",
            "**Assignment.** You may not transfer your rights under these Terms without our consent. We may transfer ours to an affiliate or in connection with a reorganisation.",
            "**Notices.** We give notice through the Platform or to the email address on your account; you give notice to the addresses in these Terms.",
            "**Language.** These Terms are written in English. Where we publish a translation and the versions differ, the English version governs.",
          ],
        },
      ],
    },
    {
      id: "contact",
      title: "19. Contact us",
      blocks: [
        {
          kind: "p",
          text: `Legal notices and copyright complaints: **${LEGAL.contact.legal}**. Reports about content or conduct: **${LEGAL.contact.moderation}**. Everything else: **${LEGAL.contact.general}**. By post: ${LEGAL.entity}, ${LEGAL.address}.`,
        },
      ],
    },
  ],
};
