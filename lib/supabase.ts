import { createClient } from "@supabase/supabase-js"

// Define types for our database tables
export type LiveCourse = {
  id: number
  course_id: string
  name: string
  country: string
  region: string
}

export type LiveRace = {
  id: number
  race_id: string
  date: string
  time: string
  course: string
  distance_yards: number
  going: string
  race_class: string
  race_type: string
  field_size: number
  weather: string
  course_id: string
  avg_weight: number
  sci_score: number
}

export type LiveRaceRunner = {
  id: number
  race_id: string
  horse_name: string
  form: string
  days_since_last_run: number
  rpr: number
  ts: number
  trainer_win_rate: number
  jockey_win_rate: number
  course_wins: number
  distance_wins: number
  total_races: number
  recent_top3_count: number
  running_style: string
  weight_carried: number
  draw_position: number
  class_drop: boolean
  normalized_score: number
  label: string
  jockey: string
  trainer: string
  scores: {
    [key: string]: number
  }
}

// Check if Supabase credentials are missing
const isMissingCredentials = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create mock data for preview
const mockCourses: LiveCourse[] = [
  { id: 1, course_id: "ascot", name: "Ascot", country: "UK", region: "South" },
  { id: 2, course_id: "newmarket", name: "Newmarket", country: "UK", region: "East" },
  { id: 3, course_id: "york", name: "York", country: "UK", region: "North" },
  { id: 4, course_id: "cheltenham", name: "Cheltenham", country: "UK", region: "West" },
  { id: 5, course_id: "aintree", name: "Aintree", country: "UK", region: "South" },
]

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date.toISOString().split("T")[0])
  }
  return dates
}

const mockDates = generateDates()

// Generate race times
const mockTimes = ["12:30", "13:15", "14:00", "14:45", "15:30", "16:15", "17:00"]

// Generate mock race runners with SIE pillars
const generateMockRunners = (raceId: string): LiveRaceRunner[] => {
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

// Create a mock race
const generateMockRace = (courseId: string, date: string, time: string): LiveRace => {
  return {
    id: 1,
    race_id: `${courseId}-${date}-${time}`.replace(/:/g, ""),
    course_id: courseId,
    date,
    time,
    course: mockCourses.find((c) => c.course_id === courseId)?.name || courseId,
    distance_yards: 2200,
    going: "Good",
    race_class: "Class 3",
    race_type: "Flat",
    field_size: 8,
    weather: "Clear",
    avg_weight: 145,
    sci_score: Math.floor(Math.random() * 10) + 1, // 1-10
  }
}

// Create a mock Supabase client if credentials are missing
let supabase: any

if (isMissingCredentials) {
  console.log("Using mock Supabase client due to missing credentials")

  // Create a mock client with specific handlers for each query pattern
  supabase = {
    from: (table: string) => {
      return {
        select: (columns = "*") => {
          // Create a query builder that tracks state
          const state = {
            table,
            filters: {} as Record<string, any>,
            orderBy: null as string | null,
          }

          // Return a builder object with all the methods we need
          return {
            eq: (column: string, value: any) => {
              state.filters[column] = value
              return this
            },
            gte: (column: string, value: any) => {
              state.filters[`${column}_gte`] = value
              return this
            },
            order: (column: string, options = {}) => {
              state.orderBy = column
              return this
            },
            distinct: () => {
              // Handle fetchRaceDates query pattern
              if (state.table === "live_races" && state.filters["course_id"] && state.filters["date_gte"]) {
                return Promise.resolve({
                  data: mockDates.map((date) => ({ date })),
                  error: null,
                })
              }
              return Promise.resolve({ data: [], error: null })
            },
            single: () => {
              // Handle fetchRaceDetails query pattern
              if (
                state.table === "live_races" &&
                state.filters["course_id"] &&
                state.filters["date"] &&
                state.filters["time"]
              ) {
                return Promise.resolve({
                  data: generateMockRace(state.filters["course_id"], state.filters["date"], state.filters["time"]),
                  error: null,
                })
              }
              return Promise.resolve({ data: null, error: null })
            },
          }
        },
      }
    },
  }

  // Add direct handlers for specific query patterns
  supabase.from("live_courses").select = () => ({
    order: () => Promise.resolve({ data: mockCourses, error: null }),
  })

  supabase.from("live_races").select = (columns = "*") => {
    return {
      eq: (column: string, value: any) => {
        if (column === "course_id") {
          return {
            eq: (column2: string, value2: any) => {
              if (column2 === "date") {
                return {
                  order: () =>
                    Promise.resolve({
                      data: mockTimes.map((time) => ({ time })),
                      error: null,
                    }),
                }
              }
              return { order: () => Promise.resolve({ data: [], error: null }) }
            },
            gte: (column2: string, value2: any) => {
              if (column2 === "date") {
                return {
                  order: () => ({
                    distinct: () =>
                      Promise.resolve({
                        data: mockDates.map((date) => ({ date })),
                        error: null,
                      }),
                  }),
                }
              }
              return { order: () => ({ distinct: () => Promise.resolve({ data: [], error: null }) }) }
            },
          }
        }
        return { eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }
      },
    }
  }

  supabase.from("live_race_runners").select = () => ({
    eq: (column: string, value: any) => {
      if (column === "race_id") {
        return {
          order: () =>
            Promise.resolve({
              data: generateMockRunners(value),
              error: null,
            }),
        }
      }
      return { order: () => Promise.resolve({ data: [], error: null }) }
    },
  })
} else {
  // Use the real Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
