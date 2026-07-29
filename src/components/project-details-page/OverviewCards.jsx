import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Users,
} from "lucide-react";

const OverviewCards = ({ overview }) => {
  const cards = [
    {
      title: "Developers",
      value: overview.developersCount,
      icon: Users,
    },
    {
      title: "Total Tasks",
      value: overview.totalTasks,
      icon: ListTodo,
    },
    {
      title: "In Progress",
      value: overview.inProgressTasks,
      icon: Clock3,
    },
    {
      title: "Completed",
      value: overview.completedTasks,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <Icon size={21} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
