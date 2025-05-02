import { Loader2 } from "lucide-react"
import Logo from "@/components/logo"

export default function SearchLoading() {
  return (
    <main className="flex flex-col items-center justify-between w-full min-h-[calc(100vh-4rem)] px-4 py-6 pb-20 overflow-y-auto bg-[#183531]">
      <div className="w-full max-w-md">
        <Logo />
        <h2 className="text-[#DDAD69] text-base font-medium text-center mt-1 mb-4">Your Personal Racing Assistant</h2>

        <div className="flex flex-col items-center justify-center w-full h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#DDAD69] animate-spin mb-4" />
          <p className="text-white text-lg font-medium">Loading search...</p>
        </div>
      </div>
    </main>
  )
}
