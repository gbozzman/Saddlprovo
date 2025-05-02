"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ChevronRight,
  Crown,
  Check,
  ArrowDownToLine,
  Bell,
  BellOff,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Clock,
  Edit,
  X,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    email: "",
    plan: "free",
    searchesUsed: 0,
    totalSearches: 25,
    dayPass: null as { expiresAt: string } | null,
    memberSince: new Date().getFullYear(),
  })
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false)
  const [upgradeConfirmation, setUpgradeConfirmation] = useState<string | null>(null)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [newNickname, setNewNickname] = useState("")

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("userData")
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setUserData((prevData) => ({
          ...prevData,
          ...parsedData,
          memberSince: parsedData.memberSince || new Date().getFullYear(),
        }))
        setNewNickname(parsedData.nickname || "")
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
    }
  }, [])

  useEffect(() => {
    const currentTime = new Date()
    if (userData.dayPass) {
      const dayPassExpiry = new Date(userData.dayPass.expiresAt)
      if (currentTime > dayPassExpiry) {
        setUserData((prevData) => ({
          ...prevData,
          plan: "free",
          totalSearches: 25,
          searchesUsed: 0,
          dayPass: null,
        }))
      }
    }
  }, [userData.dayPass])

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData))
  }, [userData])

  const getPlanDetails = () => {
    switch (userData.plan) {
      case "gold":
        return { name: "Gold", color: "text-yellow-400", searches: 50 }
      case "platinum":
        return { name: "Platinum", color: "text-gray-300", searches: 150 }
      case "daypass":
        return { name: "Day Pass", color: "text-blue-400", searches: 10 }
      default:
        return { name: "Free", color: "text-green-400", searches: 25 }
    }
  }

  const planDetails = getPlanDetails()
  const progressPercentage = (userData.searchesUsed / planDetails.searches) * 100

  const handleUpgradeClick = () => {
    setIsUpgradePopupOpen(true)
  }

  const handleUpgrade = (plan: string) => {
    const newPlan = plan
    let newSearches = 25
    let message = ""

    switch (plan) {
      case "gold":
        newSearches = 50
        message = "Upgraded to Gold! You now have 50 searches per month."
        break
      case "platinum":
        newSearches = 150
        message = "Upgraded to Platinum! You now have 150 searches per month."
        break
      case "daypass":
        newSearches = 10
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 1)
        setUserData((prevData) => ({
          ...prevData,
          plan: "daypass",
          totalSearches: 10,
          searchesUsed: 0,
          dayPass: { expiresAt: expiryDate.toISOString() },
        }))
        message = "Day Pass activated! You have 10 searches for the next 24 hours."
        break
      case "downgrade-to-gold":
        newSearches = 50
        message = "Plan changed to Gold. You now have 50 searches per month."
        break
    }

    if (plan !== "daypass") {
      setUserData((prevData) => ({
        ...prevData,
        plan: plan === "downgrade-to-gold" ? "gold" : newPlan,
        totalSearches: newSearches,
        searchesUsed: 0,
        dayPass: null,
      }))
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    setUpgradeConfirmation(message)
    setIsUpgradePopupOpen(false)

    setTimeout(() => {
      setUpgradeConfirmation(null)
    }, 5000)
  }

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications)
  }

  const handleSaveNickname = () => {
    if (newNickname.trim() === "") {
      alert("Nickname cannot be empty")
      return
    }

    setUserData((prevData) => ({
      ...prevData,
      nickname: newNickname,
    }))

    // Update localStorage
    const storedData = JSON.parse(localStorage.getItem("userData") || "{}")
    storedData.nickname = newNickname
    localStorage.setItem("userData", JSON.stringify(storedData))

    setIsEditingNickname(false)
  }

  const menuItems = [
    { icon: User, label: "Edit Profile", action: () => router.push("/edit-profile") },
    { icon: Settings, label: "Settings", action: () => router.push("/settings") },
    { icon: HelpCircle, label: "Help & Support", action: () => router.push("/help-and-support") },
    { icon: LogOut, label: "Log Out", action: () => router.push("/login"), className: "text-red-500" },
  ]

  const renderMembershipStatus = () => {
    if (userData.plan === "daypass" && userData.dayPass) {
      const expiryDate = new Date(userData.dayPass.expiresAt)
      const now = new Date()
      const hoursLeft = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)))

      return (
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className={`text-xl font-semibold ${planDetails.color}`}>Day Pass Active</h3>
            <p className="text-sm text-white/80">
              {userData.searchesUsed} out of {planDetails.searches} Searches Used
            </p>
            <p className="text-xs text-white/60 mt-1">
              {hoursLeft} hour{hoursLeft !== 1 ? "s" : ""} left
            </p>
          </div>
          <Clock className="text-[#DDAD69] w-10 h-10" />
        </div>
      )
    }

    return (
      <>
        <h3 className={`text-xl font-semibold ${planDetails.color}`}>{planDetails.name} Plan</h3>
        <p className="text-sm text-white/80">
          {userData.searchesUsed} out of {planDetails.searches} Searches Used
        </p>
      </>
    )
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#183531] to-[#0D1E1C] text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#183531]/80 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-10 shadow-md"
      >
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Profile</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Profile Content */}
      <div className="flex flex-col items-center px-6 space-y-6 mt-8 pb-20">
        {/* Avatar and Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center space-y-2"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-[#DDAD69] to-[#B78E3C] rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-lg">
            {userData.name ? (
              <span className="text-white text-6xl font-bold">{userData.name.charAt(0)}</span>
            ) : (
              <User size={64} className="text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">{userData.name || "Anonymous"}</h2>

          {/* Nickname with Edit Option */}
          <div className="flex items-center space-x-2">
            {isEditingNickname ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="px-2 py-1 bg-white/10 border border-[#DDAD69] rounded text-white text-sm"
                  placeholder="Enter nickname"
                />
                <button
                  onClick={handleSaveNickname}
                  className="p-1 bg-[#DDAD69]/20 rounded hover:bg-[#DDAD69]/30 transition-colors"
                >
                  <Check size={16} className="text-[#DDAD69]" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingNickname(false)
                    setNewNickname(userData.nickname)
                  }}
                  className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-[#DDAD69]">@{userData.nickname || "anonymous"}</p>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="p-1 bg-[#DDAD69]/20 rounded hover:bg-[#DDAD69]/30 transition-colors"
                >
                  <Edit size={14} className="text-[#DDAD69]" />
                </button>
              </>
            )}
          </div>

          <p className="text-sm text-[#DDAD69]">Member since {userData.memberSince}</p>
        </motion.div>

        {/* Membership Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white/10 rounded-xl p-6 space-y-2 backdrop-blur-sm border border-white/20 shadow-lg"
        >
          {renderMembershipStatus()}
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#DDAD69] rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Upgrade Button */}
        {userData.plan !== "platinum" && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleUpgradeClick}
            className="w-full bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] rounded-xl p-4 space-y-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="text-white" size={24} />
                <h3 className="text-xl font-semibold text-white">Upgrade Your Plan</h3>
              </div>
              <ChevronRight className="text-white" size={20} />
            </div>
            <p className="text-white/80 text-sm">Unlock more searches and exclusive features!</p>
          </motion.button>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full space-y-2"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={item.action}
              className={`w-full flex items-center justify-between bg-white/10 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 ${item.className || ""}`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-[#DDAD69]" />
            </motion.button>
          ))}
        </motion.div>

        {/* Push Notifications Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full bg-white/10 rounded-xl p-4 space-y-2 backdrop-blur-sm border border-white/20"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
            <button
              onClick={handlePushNotificationToggle}
              className={`p-2 rounded-full ${
                pushNotifications ? "bg-green-500" : "bg-gray-600"
              } transition-colors duration-200 ease-in-out`}
            >
              {pushNotifications ? (
                <Bell className="text-white" size={20} />
              ) : (
                <BellOff className="text-gray-300" size={20} />
              )}
            </button>
          </div>
          <p className="text-sm text-white/70">
            {pushNotifications
              ? "You will receive notifications when your favorited horses are running."
              : "Enable notifications to stay updated on your favorited horses."}
          </p>
        </motion.div>
      </div>

      {/* Upgrade Confirmation */}
      <AnimatePresence>
        {upgradeConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 left-4 right-4 bg-green-500 text-white p-4 rounded-xl flex items-center shadow-lg"
          >
            <Check className="mr-2" size={20} />
            <p>{upgradeConfirmation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Popup */}
      <AnimatePresence>
        {isUpgradePopupOpen && (
          <UpgradePopup
            isOpen={isUpgradePopupOpen}
            onClose={() => setIsUpgradePopupOpen(false)}
            onUpgrade={handleUpgrade}
            currentPlan={userData.plan}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function UpgradePopup({
  isOpen,
  onClose,
  onUpgrade,
  currentPlan,
}: {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (plan: string) => void
  currentPlan: string
}) {
  if (!isOpen) return null

  const upgradeOptions = () => {
    const options = []

    if (currentPlan !== "daypass") {
      options.push(
        <UpgradeOption
          key="daypass"
          title="Day Pass"
          description="10 searches for 24 hours"
          price="£3.99"
          onClick={() => onUpgrade("daypass")}
          icon={<Clock className="text-blue-400" size={24} />}
        />,
      )
    }

    if (currentPlan !== "gold" && currentPlan !== "platinum") {
      options.push(
        <UpgradeOption
          key="gold"
          title="Gold Plan"
          description="50 searches per month"
          price="£9.99/month"
          onClick={() => onUpgrade("gold")}
          icon={<Crown className="text-yellow-400" size={24} />}
        />,
      )
    }

    if (currentPlan !== "platinum") {
      options.push(
        <UpgradeOption
          key="platinum"
          title="Platinum Plan"
          description="150 searches per month"
          price="£14.99/month"
          onClick={() => onUpgrade("platinum")}
          icon={<Crown className="text-gray-300" size={24} />}
        />,
      )
    }

    if (currentPlan === "platinum") {
      options.push(
        <UpgradeOption
          key="downgrade-to-gold"
          title="Downgrade to Gold"
          description="50 searches per month"
          price="£9.99/month"
          onClick={() => onUpgrade("downgrade-to-gold")}
          icon={<ArrowDownToLine className="text-yellow-400" size={24} />}
        />,
      )
    }

    return options
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#183531] p-6 rounded-xl w-full max-w-md shadow-2xl border border-[#DDAD69]/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-[#DDAD69] mb-4">
          {currentPlan === "platinum" ? "Change Your Plan" : "Choose Your Upgrade"}
        </h3>
        <div className="space-y-4">{upgradeOptions()}</div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

function UpgradeOption({
  title,
  description,
  price,
  onClick,
  icon,
}: {
  title: string
  description: string
  price: string
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white/10 rounded-xl p-4 text-left transition-colors hover:bg-white/20"
    >
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <p className="text-sm text-white/80 mb-2">{description}</p>
      <p className="text-[#DDAD69] font-semibold">{price}</p>
    </motion.button>
  )
}
