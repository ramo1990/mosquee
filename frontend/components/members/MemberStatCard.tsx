
import type { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: string;
};

export default function MemberStatCard({
  title,
  value,
  description,
  icon,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-gray-950">
            {value}
          </p>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">{description}</p>
    </div>
  );
}
