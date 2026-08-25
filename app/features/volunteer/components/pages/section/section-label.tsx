interface SectionLabelProps {
  children: string;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-[14px] leading-[19.5px] font-semibold text-[#344256]">
      {children}
    </p>
  );
}
