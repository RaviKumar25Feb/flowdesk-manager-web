import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Mail,
  MessageSquareText,
  Pencil,
  Send,
  UserRound,
} from "lucide-react";

const TaskDescription = ({ description, InfoItem }) => {
  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <MessageSquareText size={19} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900">Description</h2>

          <p className="text-xs text-gray-500">
            Task requirements and expected work
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
          {description || "No description has been provided for this task."}
        </p>
      </div>
    </section>
  );
};

export default TaskDescription;
