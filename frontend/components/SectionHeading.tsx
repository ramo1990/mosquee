
import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export default function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
          {title}
        </h2>

        <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        {linkLabel}
        <span aria-hidden="true" className="text-base">
          →
        </span>
      </Link>
    </div>
  );
}