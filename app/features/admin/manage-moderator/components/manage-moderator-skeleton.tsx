import { Skeleton } from "~/components/ui/skeleton";
import { TableCell, TableRow } from "~/components/ui/table";

export default function ManageModeratorSkeleton() {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell className="px-8 py-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-2 min-w-0 flex-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell className="px-8 py-6">
        <Skeleton className="h-6 w-24 rounded-lg" />
      </TableCell>
      <TableCell className="px-8 py-6 text-center">
        <Skeleton className="h-6 w-20 rounded-lg mx-auto" />
      </TableCell>
      <TableCell className="px-8 py-6 text-center">
        <Skeleton className="h-4 w-24 rounded mx-auto" />
      </TableCell>
      <TableCell className="px-8 py-6 text-right">
        <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
      </TableCell>
    </TableRow>
  ));
}
