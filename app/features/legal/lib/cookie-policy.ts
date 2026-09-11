import type { LegalDocument } from "../types";
import {
  COOKIE_TABLE_COLUMNS,
  cookieRows,
  THIRD_PARTY_EMBEDS,
} from "./cookie-catalog";
import { LEGAL } from "./legal-info";

/**
 * The cookie policy: a plain statement of what is set and why.
 *
 * There are no controls on this page because there is nothing to control —
 * every cookie the Platform sets is strictly necessary to sign a member in, and
 * consent is neither required for those nor meaningful to ask for. Offering a
 * switch that cannot change anything would be worse than offering none: it
 * implies a choice the product does not actually honour.
 */
export const cookiePolicy: LegalDocument = {
  title: "Cookie Policy",
  summary:
    "Cookies are how we keep you signed in. This page explains how True Khmer uses them, what we deliberately do not use them for, and what the services embedded in our pages set.",
  sections: [
    {
      id: "what-they-are",
      title: "What cookies are",
      blocks: [
        {
          kind: "p",
          text: "A cookie is a small text file a website asks your browser to store and send back on the next request. Cookies are how a site recognises that two page loads came from the same person — which is what makes staying signed in possible at all. Similar technologies, such as local storage in your browser, do the same job for some features, and we treat them the same way as cookies here.",
        },
        {
          kind: "p",
          text: "Every cookie True Khmer sets is strictly necessary: they keep you signed in, and they protect your account during sign-in and two-factor verification. Each is set only in response to something you do, and none of them carries an advertising identifier or follows you to other websites.",
        },
      ],
    },
    {
      id: "what-we-dont-use",
      title: "What we do not use",
      blocks: [
        {
          kind: "p",
          text: "We set no analytics cookies, no advertising cookies and no cookies that track you across other websites. We run no advertising networks, we do not sell advertising space on the Platform, and we do not build profiles of you for marketing.",
        },
        {
          kind: "callout",
          text: "This is also why you are not asked to accept or refuse cookies here: there is nothing optional to decide about. If we ever introduce a cookie that is not strictly necessary, we will ask for your consent before it is set, and it will be listed on this page first.",
        },
      ],
    },
    {
      id: "third-party-cookies",
      title: "Content from other services",
      blocks: [
        {
          kind: "p",
          text: "Some pages load content run by other companies, which sets its own cookies once that content is open. We do not control those cookies, and they are governed by each provider's own policy.",
        },
        {
          kind: "table",
          columns: COOKIE_TABLE_COLUMNS,
          rows: cookieRows(THIRD_PARTY_EMBEDS),
        },
      ],
    },
    {
      id: "browser-controls",
      title: "Managing cookies in your browser",
      blocks: [
        {
          kind: "p",
          text: "Your browser gives you controls that sit above anything on this page: you can see the cookies stored for a site, delete them, block third-party cookies, or block cookies from a site entirely. They are usually found under Settings → Privacy.",
        },
        {
          kind: "callout",
          text: "Blocking or deleting all cookies for truekhmer.com will sign you out and stop you signing back in, because the session cookie is what carries your sign-in.",
        },
      ],
    },
    {
      id: "signals",
      title: "Do Not Track and Global Privacy Control",
      blocks: [
        {
          kind: "p",
          text: "Some browsers send a “Do Not Track” or Global Privacy Control signal. There is no single standard for how a site should answer Do Not Track, so we do not rely on it. We do not track you across other websites in any case, whatever signal your browser sends.",
        },
      ],
    },
    {
      id: "contact",
      title: "Questions about cookies",
      blocks: [
        {
          kind: "p",
          text: `If something on this page is unclear, or you think a cookie is being set that is not listed, write to **${LEGAL.contact.privacy}** and we will look into it.`,
        },
      ],
    },
  ],
};
