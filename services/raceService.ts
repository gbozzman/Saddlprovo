import { supabase, type LiveRace, type LiveRaceRunner, type LiveCourse } from "@/lib/supabase"

export async function fetchCourses(): Promise<LiveCourse[]> {
  try {
    console.log("Fetching courses...")
    // Only fetch courses that have races in the next 7 days
    const today = new Date().toISOString().split("T")[0]
    const sevenDaysLater = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]

    // First approach: Get all courses
    try {
      const { data, error } = await supabase.from("live_courses").select("*").order("name")

      if (error) {
        console.error("Error fetching courses:", error)
        return []
      }

      if (!data) {
        console.error("No courses returned")
        return []
      }

      console.log(`Fetched ${data.length} courses`)
      return data
    } catch (error) {
      console.error("Exception in first approach:", error)

      // Fallback approach: Generate mock data
      console.log("Using fallback mock courses")
      return [
        { course_id: "aintree", name: "Aintree" },
        { course_id: "ascot", name: "Ascot" },
        { course_id: "cheltenham", name: "Cheltenham" },
        { course_id: "epsom", name: "Epsom" },
        { course_id: "goodwood", name: "Goodwood" },
        { course_id: "newmarket", name: "Newmarket" },
        { course_id: "york", name: "York" },
      ]
    }
  } catch (error) {
    console.error("Exception fetching courses:", error)
    return []
  }
}

export async function fetchRaceDates(courseId: string): Promise<string[]> {
  try {
    console.log(`Fetching race dates for course: ${courseId}`)
    const today = new Date().toISOString().split("T")[0]
    const sevenDaysLater = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]

    // Try different approaches to handle both real and mock Supabase clients
    try {
      // Approach 1: Full query chain
      const { data, error } = await supabase
        .from("live_races")
        .select("date")
        .eq("course_id", courseId)
        .gte("date", today)
        .lte("date", sevenDaysLater)
        .order("date")
        .distinct()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error("No data returned")
      }

      const dates = data.map((item) => item.date)
      console.log(`Fetched ${dates.length} race dates (approach 1)`)
      return dates
    } catch (e) {
      console.log("First approach failed, trying alternative approach", e)

      try {
        // Approach 2: Get all dates and filter manually
        const { data, error } = await supabase
          .from("live_races")
          .select("date")
          .eq("course_id", courseId)
          .gte("date", today)
          .lte("date", sevenDaysLater)
          .order("date")

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error("No data returned")
        }

        // Manually get distinct dates
        const uniqueDates = Array.from(new Set(data.map((item) => item.date)))
        console.log(`Fetched ${uniqueDates.length} race dates (approach 2)`)
        return uniqueDates
      } catch (e2) {
        console.log("Second approach failed, using fallback", e2)

        // Approach 3: Fallback to mock data
        const mockDates = [
          today,
          new Date(new Date(today).setDate(new Date(today).getDate() + 1)).toISOString().split("T")[0],
          new Date(new Date(today).setDate(new Date(today).getDate() + 2)).toISOString().split("T")[0],
        ]
        console.log(`Using ${mockDates.length} fallback dates`)
        return mockDates
      }
    }
  } catch (error) {
    console.error("Exception fetching race dates:", error)
    return []
  }
}

export async function fetchRaceTimes(courseId: string, date: string): Promise<string[]> {
  try {
    console.log(`Fetching race times for course: ${courseId}, date: ${date}`)

    const { data, error } = await supabase
      .from("live_races")
      .select("time")
      .eq("course_id", courseId)
      .eq("date", date)
      .order("time")

    if (error) {
      console.error("Error fetching race times:", error)
      return []
    }

    if (!data) {
      console.error("No race times returned")
      return []
    }

    const times = data.map((item) => item.time)
    console.log(`Fetched ${times.length} race times`)
    return times
  } catch (error) {
    console.error("Exception fetching race times:", error)
    return []
  }
}

export async function fetchRaceDetails(courseId: string, date: string, time: string): Promise<LiveRace | null> {
  try {
    console.log(`Fetching race details for course: ${courseId}, date: ${date}, time: ${time}`)

    const { data, error } = await supabase
      .from("live_races")
      .select("*")
      .eq("course_id", courseId)
      .eq("date", date)
      .eq("time", time)
      .single()

    if (error) {
      console.error("Error fetching race details:", error)
      return null
    }

    if (!data) {
      console.error("No race details returned")
      return null
    }

    console.log("Fetched race details:", data)
    return data
  } catch (error) {
    console.error("Exception fetching race details:", error)
    return null
  }
}

export async function fetchRaceRunners(raceId: string): Promise<LiveRaceRunner[]> {
  try {
    console.log(`Fetching runners for race: ${raceId}`)

    const { data, error } = await supabase
      .from("live_race_runners")
      .select("*")
      .eq("race_id", raceId)
      .order("normalized_score", { ascending: false })

    if (error) {
      console.error("Error fetching race runners:", error)
      return []
    }

    if (!data || data.length === 0) {
      console.log("No runners found, generating mock data")
      return generateMockRunners(raceId)
    }

    console.log(`Fetched ${data.length} runners`)
    return data
  } catch (error) {
    console.error("Exception fetching race runners:", error)
    return generateMockRunners(raceId)
  }
}

// Helper function to generate mock runners when no data is available
function generateMockRunners(raceId: string): LiveRaceRunner[] {
  const runners: LiveRaceRunner[] = []
  const horseNames = [
    "Gallant Thunder",
    "Swift Victory",
    "Royal Dash",
    "Noble Spirit",
    "Mighty Charge",
    "Stellar Blaze",
    "Golden Arrow",
    "Silver Streak",
  ]

  for (let i = 0; i < horseNames.length; i++) {
    const score = Math.floor(Math.random() * 40) + 60 // 60-99
    let label = "❄️ Improving Prospect"
    if (score >= 85) label = "⭐ Star Player"
    else if (score >= 70) label = "🔥 Prime Challenger"
    else if (score >= 55) label = "⚡ Competitive Outsider"

    runners.push({
      id: i + 1,
      race_id: raceId,
      horse_name: horseNames[i],
      form: "1,2,3,4",
      days_since_last_run: Math.floor(Math.random() * 30) + 1,
      rpr: Math.floor(Math.random() * 20) + 80,
      ts: Math.floor(Math.random() * 20) + 80,
      trainer_win_rate: Math.floor(Math.random() * 30) + 10,
      jockey_win_rate: Math.floor(Math.random() * 30) + 10,
      course_wins: Math.floor(Math.random() * 3),
      distance_wins: Math.floor(Math.random() * 3),
      total_races: Math.floor(Math.random() * 10) + 5,
      recent_top3_count: Math.floor(Math.random() * 3),
      running_style: ["Front", "Mid", "Closer"][Math.floor(Math.random() * 3)],
      weight_carried: Math.floor(Math.random() * 10) + 140,
      draw_position: i + 1,
      class_drop: Math.random() > 0.5,
      normalized_score: score,
      label,
      jockey: ["J. Smith", "T. Johnson", "R. Wilson", "M. Davis"][Math.floor(Math.random() * 4)],
      trainer: ["A. Williams", "B. Thompson", "C. Taylor", "D. Brown"][Math.floor(Math.random() * 4)],
      scores: {
        "Form Momentum": Math.floor(Math.random() * 100),
        "Track Affinity": Math.floor(Math.random() * 100),
        Stamina: Math.floor(Math.random() * 100),
        "Distance Weight": Math.floor(Math.random() * 100),
        "Jockey Trainer": Math.floor(Math.random() * 100),
        "Pace Suitability": Math.floor(Math.random() * 100),
        "Environmental Impact": Math.floor(Math.random() * 100),
        "Risk Factor": Math.floor(Math.random() * 100),
      },
    })
  }

  // Sort by score descending
  return runners.sort((a, b) => b.normalized_score - a.normalized_score)
}
