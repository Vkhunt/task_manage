function SkeletonCard() {
  return (

    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">

          <div className="h-5 bg-gray-200 rounded-md animate-pulse w-3/4" />

          <div className="h-3 bg-gray-200 rounded-md animate-pulse w-1/2" />
        </div>

        <div className="flex gap-1">
          <div className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-7 w-7 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>


      <div className="flex flex-col gap-1.5">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
      </div>


      <div className="flex gap-2">
        <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
      </div>


      <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-1.5">
          <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}


function SkeletonFiltersBar() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 flex gap-3 items-center">
      <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-9 flex-1 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}


export default function TasksLoading() {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>


      <SkeletonFiltersBar />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
