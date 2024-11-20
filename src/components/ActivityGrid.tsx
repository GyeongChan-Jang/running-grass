'use client'

export default function ActivityGrid() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">활동 기록</h2>
      <div className="grid grid-cols-7 gap-1">
        {/* GitHub style contribution grid will be here */}
        {Array.from({ length: 365 }).map((_, i) => (
          <div key={i} className="w-full pt-[100%] bg-gray-100 rounded-sm" />
        ))}
      </div>
    </div>
  )
}
