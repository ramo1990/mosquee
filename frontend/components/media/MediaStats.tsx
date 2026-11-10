
type Props = {
  total: number;
  images: number;
  videos: number;
  published: number;
};

export default function MediaStats({
  total,
  images,
  videos,
  published,
}: Props) {
  const stats = [
    { title: "Total médias", value: total },
    { title: "Images", value: images },
    { title: "Vidéos", value: videos },
    { title: "Publiés", value: published },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.title}
          </p>

          <p className="mt-3 text-3xl font-extrabold text-gray-950">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}