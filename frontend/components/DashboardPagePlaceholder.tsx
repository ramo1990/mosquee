
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  backHref?: string;
  children?: ReactNode;
};

export default function DashboardPagePlaceholder({
  title,
  description,
  backHref = "/dashboard",
  children,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:underline"
      >
        ← Retour au tableau de bord
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
        {description}
      </p>

      {children ? (
        <div className="mt-8">
          {children}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-emerald-800">
            Cette section sera bientôt disponible.
          </p>

          <p className="mt-2 text-sm text-emerald-700">
            Les fonctionnalités de gestion seront ajoutées ici.
          </p>
        </div>
      )}
    </div>
  );
}


// import Link from "next/link";

// type Props = {
//   title: string;
//   description: string;
//   backHref?: string;
// };

// export default function DashboardPagePlaceholder({
//   title,
//   description,
//   backHref = "/dashboard",
// }: Props) {
//   return (
//     <div className="rounded-2xl bg-white p-8 shadow-sm">
//       <Link
//         href={backHref}
//         className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:underline"
//       >
//         ← Retour au tableau de bord
//       </Link>

//       <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">
//         {title}
//       </h1>

//       <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
//         {description}
//       </p>

//       <div className="mt-8 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-6 py-10 text-center">
//         <p className="text-sm font-semibold text-emerald-800">
//           Cette section sera bientôt disponible.
//         </p>

//         <p className="mt-2 text-sm text-emerald-700">
//           Les fonctionnalités de gestion seront ajoutées ici.
//         </p>
//       </div>
//     </div>
//   );
// }