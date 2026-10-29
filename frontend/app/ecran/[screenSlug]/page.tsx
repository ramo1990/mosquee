
// import { Suspense } from "react";
// import MosqueScreen from "./MosqueScreen";

// export default function Page({
//   params,
// }: {
//   params: Promise<{ screenSlug: string }>;
// }) {
//   return (
//     <Suspense fallback={<div className="p-6 text-white">Chargement de l’écran...</div>}>
//       <ScreenPage params={params} />
//     </Suspense>
//   );
// }

// async function ScreenPage({
//   params,
// }: {
//   params: Promise<{ screenSlug: string }>;
// }) {
//   const { screenSlug } = await params;

//   return <MosqueScreen screenSlug={screenSlug} />;
// }
