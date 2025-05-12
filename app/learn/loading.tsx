import Image from "next/image"

export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-[#183531] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 w-64 h-32 relative">
          <Image src="/images/saddlepro-logo.png" alt="SaddlePro Logo" fill style={{ objectFit: "contain" }} priority />
        </div>

        {/* Loading spinner */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-[#DDAD69] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Loading learning resources...</p>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 w-full max-w-sm">
          <div className="h-4 bg-[#DDAD69]/20 rounded-full mb-4 animate-pulse"></div>
          <div className="h-4 bg-[#DDAD69]/20 rounded-full mb-4 w-3/4 animate-pulse"></div>
          <div className="h-4 bg-[#DDAD69]/20 rounded-full w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
