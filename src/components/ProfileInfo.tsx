'use client'

export default function ProfileInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <img src="/placeholder-avatar.png" alt="Profile" className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-xl font-bold">사용자 이름</h1>
          <p className="text-gray-600">@username</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-bold">총 거리</p>
          <p>0 km</p>
        </div>
        <div>
          <p className="font-bold">총 시간</p>
          <p>0h</p>
        </div>
        <div>
          <p className="font-bold">활동 수</p>
          <p>0</p>
        </div>
      </div>
    </div>
  )
}
