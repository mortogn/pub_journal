import { SubmissionStatus } from "@/types";

// Inline status badge component mapping enum to color classes
function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variant = statusColor(status);
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium border ${variant.bg} ${variant.border} ${variant.text}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function statusColor(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.DRAFT:
      return {
        bg: "bg-zinc-100",
        border: "border-zinc-300",
        text: "text-zinc-700",
      };
    case SubmissionStatus.SUBMITTED:
      return {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-700",
      };
    case SubmissionStatus.UNDER_REVIEW:
      return {
        bg: "bg-amber-100",
        border: "border-amber-300",
        text: "text-amber-700",
      };
    case SubmissionStatus.ACCEPTED:
      return {
        bg: "bg-emerald-100",
        border: "border-emerald-300",
        text: "text-emerald-700",
      };
    case SubmissionStatus.REJECTED:
      return {
        bg: "bg-red-100",
        border: "border-red-300",
        text: "text-red-700",
      };
    case SubmissionStatus.PUBLISHED:
      return {
        bg: "bg-green-100",
        border: "border-green-300",
        text: "text-green-700",
      };
    default:
      return {
        bg: "bg-muted",
        border: "border-transparent",
        text: "text-foreground",
      };
  }
}

export default StatusBadge;
