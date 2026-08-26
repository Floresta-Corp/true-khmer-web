import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function EmptyApplicationCard() {
  return (
    <motion.div
      key="empty-state"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
    >
      <Card className="w-full overflow-hidden rounded-2xl bg-white shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 text-gray-400">
            <Calendar className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            No Applications Yet
          </h3>
          <p className="text-sm text-gray-500">
            You haven't submitted any applications. Start exploring
            opportunities to apply.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
