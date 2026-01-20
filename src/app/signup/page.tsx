export function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  //   return <LoadingSkeleton />;
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <main>{/*  */}</main>
    </div>
  );
}
