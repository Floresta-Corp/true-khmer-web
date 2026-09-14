import type { LegalDocument } from "../types";
import { LEGAL } from "./legal-info";

/**
 * The privacy policy.
 *
 * Written against what the platform actually does: the fields the signup,
 * onboarding and profile forms collect, the sections a member can post into,
 * the processors in the request path (hosting, object storage, ticketing,
 * embedded video, sign-in), and the cookies listed in `cookie-catalog`. Any
 * change to those is a change this document has to follow — a policy that
 * describes processing the product does not do is as much of a compliance
 * problem as one that omits processing it does.
 */
export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  summary:
    "This policy explains what personal information True Khmer collects when you use our platform, why we collect it, who we share it with, and the choices and rights you have over it.",
  sections: [
    {
      id: "who-we-are",
      title: "1. Who we are",
      blocks: [
        {
          kind: "p",
          text: `${LEGAL.entityLong} operates the True Khmer community platform at truekhmer.com and the services offered through it (the "Platform"). We are the controller of the personal information described in this policy, which means we decide why and how it is processed.`,
        },
        {
          kind: "p",
          text: `True Khmer is a Khmer-to-Khmer initiative: a community platform that brings together a discussion forum, events, volunteering and opportunity listings, online courses, partner organisations and editorial content, in order to connect Cambodian talent with the people and organisations who are building the country's future.`,
        },
        {
          kind: "p",
          text: `You can reach us about anything in this policy at **${LEGAL.contact.privacy}**, or by post at ${LEGAL.address}.`,
        },
      ],
    },
    {
      id: "scope",
      title: "2. What this policy covers",
      blocks: [
        {
          kind: "p",
          text: "This policy covers the Platform's public pages, the signed-in member areas, and the forms you submit through them. It applies whether you are browsing without an account, holding a member account, posting as an organiser or teaching a course, or applying on behalf of a partner organisation.",
        },
        {
          kind: "p",
          text: "It does not cover services operated by other organisations, even where we link to them or embed them in a page. Those are described in [Third-party services we rely on](#third-parties), and each has its own privacy policy.",
        },
      ],
    },
    {
      id: "what-we-collect",
      title: "3. Information we collect",
      blocks: [
        { kind: "subheading", text: "Information you give us" },
        {
          kind: "p",
          text: "Most of what we hold is information you type into the Platform yourself:",
        },
        {
          kind: "list",
          items: [
            "**Account details.** Your first and last name, email address, password (stored only as a salted hash, never in a form we can read), and — if you choose to add one — a phone number with its country code. If you sign in with Google, we receive your name, email address and profile picture from Google instead of a password.",
            "**Profile details.** Job title or occupation, gender, date of birth, country and city, a short biography, skills, profile photo, personal website and links to your social accounts. Every one of these fields is optional except those marked as required at signup, and you can change or clear them at any time from Edit profile.",
            "**Onboarding answers.** The interests you select, the ways you tell us you would like to contribute, and the membership tier you start on. We use these to decide what to show you first.",
            "**Content you post.** Forum questions, answers and comments; volunteering opportunities and applications; Launchpad listings and applications; events you create or register for; course enrolments, lesson progress, quiz answers and the certificates issued to you; comments on articles; and anything you upload as part of those — images, documents, or a CV.",
            "**Partner and organiser information.** If you register an organisation, the organisation's details, the package selected, and the name, role, email address and phone number of the contact person you nominate.",
            "**Messages to us.** What you write when you contact support, report content, or reply to a moderation decision, including any attachments.",
          ],
        },
        { kind: "subheading", text: "Information we collect automatically" },
        {
          kind: "list",
          items: [
            "**Technical and log data.** Your IP address, browser and device type, operating system, language, the pages you request, the time of the request, and the page that referred you. This is the ordinary record a web server keeps in order to serve pages, and it is what lets us detect abuse and diagnose faults.",
            "**Session and security data.** Sign-in times, the session cookie that keeps you signed in, two-factor verification events, and whether you asked us to trust a device.",
            "**Activity on the Platform.** Which listings you save, the courses you are enrolled in and how far through them you are, notifications you have read, and similar records that are needed to make the features work.",
          ],
        },
        {
          kind: "p",
          text: "We do not use advertising networks, and we do not build profiles of you for advertising purposes. See our [Cookie Policy](/cookies) for how cookies are used on the Platform.",
        },
        { kind: "subheading", text: "Information from others" },
        {
          kind: "list",
          items: [
            "**Google**, if you use Google to sign in or to create your account.",
            "**Event organisers and ticketing**, where an event you attend is run through our ticketing partner and your registration or attendance is recorded there.",
            "**Other members**, where someone reports your content or names you in a report.",
          ],
        },
        {
          kind: "callout",
          text:
            "We never ask for your national ID number, bank card details or payment credentials through the Platform's own forms. If a page appears to ask you for them, do not enter them, and tell us at " +
            LEGAL.contact.privacy +
            ".",
        },
      ],
    },
    {
      id: "how-we-use",
      title: "4. How and why we use your information",
      blocks: [
        {
          kind: "p",
          text: "We use personal information only for the purposes below. Where the law of your country requires us to identify a legal basis for processing — for example the GDPR, if you are in the European Economic Area or the United Kingdom — the basis we rely on is named in the third column.",
        },
        {
          kind: "table",
          columns: ["Purpose", "Information used", "Legal basis"],
          rows: [
            [
              "Creating and running your account, signing you in, and keeping you signed in",
              "Account details, session and security data",
              "Performance of our contract with you",
            ],
            [
              "Showing your profile and your posts to the parts of the community you chose to publish them to",
              "Profile details, content you post",
              "Performance of our contract with you",
            ],
            [
              "Passing your application to the organisation that posted an opportunity, a volunteering role or an event",
              "Profile details, application content and attachments",
              "Performance of our contract with you, at your request",
            ],
            [
              "Running courses: enrolment, progress, quiz results and certificates",
              "Account details, course activity",
              "Performance of our contract with you",
            ],
            [
              "Service messages — verification codes, password resets, security alerts, changes to these documents, replies from support",
              "Account details, contact details",
              "Performance of our contract with you",
            ],
            [
              "Notifications about activity that concerns you, such as a reply to your question or a decision on your application",
              "Account details, activity on the Platform",
              "Our legitimate interest in a working notification service; you can change what you receive",
            ],
            [
              "Keeping the Platform safe: preventing spam, fraud, scraping, impersonation and abuse, and enforcing our Terms of Service",
              "Technical and log data, content you post, reports",
              "Our legitimate interest in protecting the community and the service",
            ],
            [
              "Diagnosing faults, measuring load and improving how the Platform works",
              "Technical and log data, aggregated activity",
              "Our legitimate interest in a reliable service",
            ],
            [
              "Newsletters, community announcements and campaign invitations",
              "Contact details, interests",
              "Your consent, which you can withdraw at any time",
            ],
            [
              "Meeting legal obligations and responding to lawful requests",
              "Whatever the obligation or request requires",
              "Compliance with a legal obligation",
            ],
          ],
        },
        {
          kind: "p",
          text: "We do not make decisions that produce legal or similarly significant effects about you by automated means alone, and we do not sell personal information.",
        },
      ],
    },
    {
      id: "public-information",
      title: "5. What other people can see",
      blocks: [
        {
          kind: "p",
          text: "True Khmer is a community platform, so some of what you enter is meant to be seen. Before you post, it is worth knowing precisely which parts are public:",
        },
        {
          kind: "list",
          items: [
            "**Your member profile** — your name, photo, job title, location, biography, skills, membership tier and the links you added — is visible to anyone with the link, including people who are not signed in, and can be indexed by search engines.",
            "**Anything you post in a public section** — forum questions and answers, comments on articles, opportunities, volunteering roles and events you publish — is public, along with your name and photo as its author.",
            "**Applications you submit** are not public. They go to the organisation that posted the opportunity, and to our moderation team where a report is made.",
            "**Course progress, quiz results, saved items, tickets, notifications and settings** are private to you, other than a certificate you choose to share yourself.",
          ],
        },
        {
          kind: "callout",
          text: "Deleting a public post removes it from the Platform, but it does not reach copies other people have already made — screenshots, quotes, reposts, or the caches of search engines we do not control.",
        },
      ],
    },
    {
      id: "sharing",
      title: "6. When we share information",
      blocks: [
        {
          kind: "p",
          text: "We share personal information only in the situations described here.",
        },
        {
          kind: "list",
          items: [
            "**With other members**, as described in [What other people can see](#public-information).",
            "**With organisations you apply to or register with.** When you apply to a Launchpad opportunity or a volunteering role, or register for an event, the organisation that posted it receives your application and the profile information attached to it, and becomes an independent controller of that information under its own privacy policy.",
            "**With service providers** who process information on our instructions and under contract, listed in [Third-party services we rely on](#third-parties).",
            "**For safety and legal reasons**, where we believe in good faith that disclosure is reasonably necessary to comply with a law, regulation, legal process or enforceable government request; to enforce our Terms of Service; to investigate a suspected violation; or to protect the rights, property or safety of our members, the public or True Khmer — including to prevent fraud or an imminent risk of harm.",
            "**In a reorganisation.** If True Khmer is involved in a merger, acquisition, financing or transfer of assets, personal information may be transferred as part of it. We will tell you before your information becomes subject to a different privacy policy.",
            "**In aggregate or anonymised form** — for example community statistics or impact reporting — where the information can no longer be linked to you.",
          ],
        },
      ],
    },
    {
      id: "third-parties",
      title: "7. Third-party services we rely on",
      blocks: [
        {
          kind: "p",
          text: "Running the Platform means relying on a small number of other organisations. Each processes only what its role requires:",
        },
        {
          kind: "table",
          columns: ["Service", "What it does", "What it can see"],
          rows: [
            [
              "Cloudflare",
              "Hosting, content delivery, and protection against attacks and abuse",
              "Technical and log data for every request, and the content served",
            ],
            [
              "Object storage and CDN",
              "Stores and serves uploads: profile photos, cover images, course materials, documents",
              "The files you upload and the requests that fetch them",
            ],
            [
              "Google Sign-In",
              "Lets you create an account or sign in with Google",
              "That you signed in; Google shares your name, email and picture with us",
            ],
            [
              "Google Fonts",
              "Serves the typefaces the Platform is set in",
              "Your IP address and browser, when a font is fetched",
            ],
            [
              "YouTube",
              "Plays video lessons embedded in courses",
              "That a video was loaded, plus the data YouTube collects under Google's own policy",
            ],
            [
              "Plumpi",
              "Event ticketing and registration for events run on that platform",
              "Your registration and ticket details for those events",
            ],
            [
              "Email delivery",
              "Sends verification codes, password resets and service notices",
              "Your email address and the contents of those messages",
            ],
          ],
        },
        {
          kind: "p",
          text: "Embedded video and fonts load from those providers when the page containing them is opened. If you would rather they did not, most browsers can block third-party content per site. Our [Cookie Policy](/cookies) lists what each of them sets.",
        },
      ],
    },
    {
      id: "cookies",
      title: "8. Cookies and similar technologies",
      blocks: [
        {
          kind: "p",
          text: "We use cookies to keep you signed in and to protect accounts during sign-in and two-factor verification. These are strictly necessary: without them the Platform cannot sign you in.",
        },
        {
          kind: "p",
          text: "We do not currently set any cookie that is not strictly necessary — no analytics, no advertising, no cross-site tracking. If we introduce one, we will ask for your consent before it is set. Our [Cookie Policy](/cookies) explains how we use cookies and what the services embedded in our pages set.",
        },
      ],
    },
    {
      id: "transfers",
      title: "9. International transfers",
      blocks: [
        {
          kind: "p",
          text: "True Khmer is based in the Kingdom of Cambodia, and our community and our service providers are spread across several countries. Your information may therefore be stored or processed outside the country you live in, including in countries whose data protection laws differ from your own.",
        },
        {
          kind: "p",
          text: "Where we transfer personal information out of the European Economic Area or the United Kingdom, we do so on the basis of the European Commission's Standard Contractual Clauses or another transfer mechanism recognised under the applicable law, together with the technical and organisational measures described in [How we protect information](#security).",
        },
      ],
    },
    {
      id: "retention",
      title: "10. How long we keep information",
      blocks: [
        {
          kind: "p",
          text: "We keep personal information only for as long as we need it for the purpose it was collected for:",
        },
        {
          kind: "list",
          items: [
            `**Account and profile information** is kept while your account is open. When you delete your account we remove or anonymise it within ${LEGAL.accountGraceDays} days, other than anything we must keep for the reasons below.`,
            "**Public content you posted** may remain visible after your account closes, shown as posted by a removed member, where deleting it would break a conversation others took part in. You can delete your own posts before closing your account.",
            "**Applications** are kept by the organisation that received them under its own retention policy; our copy is removed with your account.",
            "**Course records and certificates** are kept while your account is open, so that a certificate you have been awarded remains verifiable.",
            "**Security and server logs** are kept for a short period — typically no more than 12 months — and longer only where an investigation requires it.",
            "**Records we are legally required to retain**, such as those relating to a partner package or a legal claim, are kept for the period the law requires.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "11. How we protect information",
      blocks: [
        {
          kind: "p",
          text: "We take measures appropriate to the risk, including encryption of traffic in transit, storing passwords only as salted hashes, signed and HTTP-only session cookies, optional two-factor authentication on member and administrator accounts, access controls that limit staff access to what their role requires, an audit log of administrative actions, and time-limited links for file uploads.",
        },
        {
          kind: "p",
          text:
            "No service can promise perfect security. You can help by using a password you use nowhere else, turning on two-factor authentication in Settings, and telling us at **" +
            LEGAL.contact.privacy +
            "** if you think your account has been accessed by someone else. If a breach occurs that is likely to result in a risk to your rights, we will notify you and the relevant authority as the applicable law requires.",
        },
      ],
    },
    {
      id: "your-rights",
      title: "12. Your rights and choices",
      blocks: [
        {
          kind: "p",
          text: "You can exercise most of these yourself, at any time, from within the Platform:",
        },
        {
          kind: "list",
          items: [
            "**See and correct your information** — Edit profile holds everything on your public profile, and Settings holds your account and security options.",
            "**Delete your account** from Settings, which removes your personal information as described in [How long we keep information](#retention).",
            "**Control notifications** from your notification preferences, and unsubscribe from any newsletter using the link in its footer.",
            "**Read how we use cookies** in our [Cookie Policy](/cookies), and block or clear them from your browser's privacy settings.",
          ],
        },
        {
          kind: "p",
          text: "Depending on where you live, you may also have the right to request a copy of your personal information in a portable format, to ask us to restrict or stop processing it, to object to processing carried out on the basis of our legitimate interests, and to withdraw consent you have given — without affecting processing carried out before you withdrew it.",
        },
        {
          kind: "p",
          text: `To make a request, write to **${LEGAL.contact.privacy}** from the email address on your account. We answer within 30 days, and will tell you if we need longer. We may need to verify your identity first; we will not charge you for a request unless it is manifestly unfounded or excessive.`,
        },
        {
          kind: "p",
          text: "If you are not satisfied with our answer, you may complain to your local data protection authority. We would rather hear from you first, and will try to put it right.",
        },
      ],
    },
    {
      id: "children",
      title: "13. Children",
      blocks: [
        {
          kind: "p",
          text: `The Platform is not intended for children. You must be at least ${LEGAL.minimumAge} years old to create an account. We do not knowingly collect personal information from anyone under that age, and if we learn that we have, we delete the account and the information promptly. If you believe a child has given us their information, tell us at **${LEGAL.contact.privacy}**.`,
        },
      ],
    },
    {
      id: "changes",
      title: "14. Changes to this policy",
      blocks: [
        {
          kind: "p",
          text: "We update this policy when the Platform changes or the law does. The date at the top always shows when it last changed. If a change materially affects how we use your personal information, we will tell you before it takes effect — by a notice on the Platform, by email, or both — and where the law requires it, we will ask for your consent.",
        },
      ],
    },
    {
      id: "contact",
      title: "15. Contact us",
      blocks: [
        {
          kind: "p",
          text: `Questions, requests and complaints about privacy: **${LEGAL.contact.privacy}**. Anything else: **${LEGAL.contact.general}**. By post: ${LEGAL.entity}, ${LEGAL.address}.`,
        },
      ],
    },
  ],
};
