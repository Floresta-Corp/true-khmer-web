import type { ReactNode } from "react";

interface InstructorContactButtonsProps {
  phone: string | null;
  email: string | null;
}

const TILE =
  "flex size-10 items-center justify-center rounded-[10px] bg-[#EFF4FE] transition-colors";

function ContactTile({
  href,
  label,
  unavailableLabel,
  children,
}: {
  href: string | null;
  label: string;
  unavailableLabel: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span
        className={`${TILE} opacity-40`}
        title={unavailableLabel}
        aria-label={unavailableLabel}
        role="img"
      >
        {children}
      </span>
    );
  }

  return (
    <a href={href} aria-label={label} className={`${TILE} hover:bg-[#D5E2FA]`}>
      {children}
    </a>
  );
}

export function InstructorContactButtons({
  phone,
  email,
}: InstructorContactButtonsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <ContactTile
        href={phone ? `tel:${phone}` : null}
        label="Call the instructor"
        unavailableLabel="This instructor has not added a phone number"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M13.0001 12.1012C11.0043 14.2018 5.9133 9.15653 7.91674 7.04795C9.13997 5.76052 7.75815 4.28923 6.99329 3.20778C5.55782 1.17815 2.40655 3.98034 2.50225 5.76287C2.80406 11.384 8.88474 18.0455 14.7731 17.4645C16.6152 17.2827 18.7317 13.956 16.6187 12.7402C15.5622 12.1322 14.112 10.931 13.0001 12.1012Z"
            stroke="#1C5DD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6666 2.5C13.2137 2.5 14.6975 3.11458 15.7914 4.20854C16.8854 5.30251 17.5 6.78624 17.5 8.33333"
            stroke="#1C5DD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6666 5.83301C12.3297 5.83301 12.9656 6.0964 13.4344 6.56524C13.9032 7.03408 14.1666 7.66997 14.1666 8.33301"
            stroke="#1C5DD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ContactTile>

      <ContactTile
        href={email ? `mailto:${email}` : null}
        label="Email the instructor"
        unavailableLabel="This instructor has not added an email address"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M1.66663 9.99967C1.66663 6.85698 1.66663 5.28563 2.88701 4.30932C4.1074 3.33301 6.07159 3.33301 9.99996 3.33301C13.9283 3.33301 15.8925 3.33301 17.1129 4.30932C18.3333 5.28563 18.3333 6.85698 18.3333 9.99967C18.3333 13.1424 18.3333 14.7137 17.1129 15.69C15.8925 16.6663 13.9283 16.6663 9.99996 16.6663C6.07159 16.6663 4.1074 16.6663 2.88701 15.69C1.66663 14.7137 1.66663 13.1424 1.66663 9.99967Z"
            stroke="#1C5DD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.2221 4.4248L13.2009 8.16557C11.6704 9.44101 10.9051 10.0787 9.99998 10.0787C9.09486 10.0787 8.32959 9.44101 6.79906 8.16557L2.77783 4.4248"
            stroke="#1C5DD4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ContactTile>
    </div>
  );
}
