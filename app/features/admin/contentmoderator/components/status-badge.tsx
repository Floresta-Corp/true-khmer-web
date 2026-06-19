export type ReportStatus = "OPEN" | "CLOSED";

const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const styles = {
    CLOSED: "bg-rose-500/20 dark:text-rose-400  text-rose-600",
    OPEN: "bg-emerald-500/20 dark:text-emerald-400 text-emerald-600  ",
  };

  return (
    <span
      className={`px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${styles[status]}`}
    >
      {status === "CLOSED" ? "CLOSED" : "OPEN"}
    </span>
  );
};

export { StatusBadge };
