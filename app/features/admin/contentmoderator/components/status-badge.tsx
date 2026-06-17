import type { ReportStatus } from "~/features/admin/contentmoderator/types";

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles = {
    open: "bg-rose-500/10 text-rose-600 border border-rose-200",
    closed: "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {status === "closed" ? "Closed" : "Open"}
    </span>
  );
};

export { StatusBadge };
