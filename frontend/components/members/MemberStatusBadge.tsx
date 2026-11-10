import type { MemberStatus } from "./members.types";

import { STATUS_LABELS } from "./members.constants";

type Props = {
  status: MemberStatus;
};

const STATUS_STYLES: Record<MemberStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-800",
};

export default function MemberStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}