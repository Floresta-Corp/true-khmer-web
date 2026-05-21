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
      <Card className="w-full bg-white rounded-2xl overflow-hidden shadow-none">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
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
