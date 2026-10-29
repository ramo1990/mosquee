
import { Suspense } from "react";
import MosqueScreen from "./MosqueScreen";

type PageProps = {
  params: Promise<{
    slug: string;
    ecranSlug: string;
  }>;
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-white">
          Chargement de l’écran...
        </div>
      }
    >
      <ScreenPage params={params} />
    </Suspense>
  );
}

async function ScreenPage({ params }: PageProps) {
  const { ecranSlug } = await params;

  return <MosqueScreen screenSlug={ecranSlug} />;
}
