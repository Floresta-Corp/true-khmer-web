interface SectionLabelProps {
  children: string;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-[14px] font-semibold leading-[19.5px] text-[#344256]">
      {children}
    </p>
  );
}
