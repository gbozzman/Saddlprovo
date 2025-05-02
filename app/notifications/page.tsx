"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Bell, Settings, Calendar, Trophy, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Notification {
  id: number
  title: string
  message: string
  date: string
  read: boolean
  type: "race" | "system" | "achievement" | "promo"
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Race Starting Soon",
    message: "The Newcastle 14:30 race is starting in 30 minutes. Don't forget to submit your prediction!",
    date: "2025-03-19T14:00:00",
    read: false,
    type: "race",
  },
  {
    id: 2,
    title: "Badge Earned",
    message: "Congratulations! You've earned the 'Hot Streak' badge for making 3 predictions in a row.",
    date: "2025-03-18T16:45:00",
    read: true,
    type: "achievement",
  },
  {
    id: 3,
    title: "System Update",
    message: "We've updated our prediction algorithm to provide even more accurate insights.",
    date: "2025-03-17T09:30:00",
    read: true,
    type: "system",
  },
  {
    id: 4,
    title: "Special Offer",
    message: "Upgrade to Premium today and get 20% off your first month!",
    date: "2025-03-16T12:15:00",
    read: false,
    type: "promo",
  },
  {
    id: 5,
    title: "Favorite Horse Running",
    message: "Northern Star is running in the Ascot 15:45 tomorrow. Don't miss it!",
    date: "2025-03-15T18:00:00",
    read: true,
    type: "race",
  },
  {
    id: 6,
    title: "Leaderboard Update",
    message: "You've moved up 3 positions on the monthly leaderboard. Keep it up!",
    date: "2025-03-14T20:30:00",
    read: false,
    type: "achievement",
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "race" | "achievement" | "system" | "promo">("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "race":
        return <Calendar className="text-blue-400" size={20} />
      case "achievement":
        return <Trophy className="text-yellow-400" size={20} />
      case "system":
        return <Settings className="text-purple-400" size={20} />
      case "promo":
        return <Star className="text-green-400" size={20} />
      default:
        return <Bell className="text-[#DDAD69]" size={20} />
    }
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#183531] pb-20">
      {/* Header */}
      <div className="bg-[#183531] p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Notifications</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Filters */}
        <div className="mb-4 overflow-x-auto whitespace-nowrap pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`mr-2 px-4 py-2 rounded-full text-sm ${
              filter === "all" ? "bg-[#DDAD69] text-white" : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`mr-2 px-4 py-2 rounded-full text-sm ${
              filter === "unread" ? "bg-[#DDAD69] text-white" : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("race")}
            className={`mr-2 px-4 py-2 rounded-full text-sm ${
              filter === "race" ? "bg-[#DDAD69] text-white" : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors`}
          >
            Races
          </button>
          <button
            onClick={() => setFilter("achievement")}
            className={`mr-2 px-4 py-2 rounded-full text-sm ${
              filter === "achievement" ? "bg-[#DDAD69] text-white" : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors`}
          >
            Achievements
          </button>
        </div>

        {/* Mark all as read button */}
        <div className="flex justify-end mb-4">
          <button onClick={markAllAsRead} className="text-[#DDAD69] text-sm hover:underline">
            Mark all as read
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg ${
                  notification.read ? "bg-white/5" : "bg-white/10 border-l-4 border-[#DDAD69]"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-full mr-3">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${notification.read ? "text-white/80" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-white/60 text-xs">{formatDate(notification.date)}</span>
                    </div>
                    <p className={`text-sm mt-1 ${notification.read ? "text-white/60" : "text-white/80"}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-white/60">
              <Bell className="mx-auto mb-4 text-white/30" size={48} />
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
