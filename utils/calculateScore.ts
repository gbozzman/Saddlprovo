interface RaceData {
  pastPositions: number[]
  raceClass: string
  speedRatings: number[]
  trackForm: number
  surfaceAdaptability: number
  distanceCompatibility: number
  trainerStats: number
  jockeyStats: number
  recentForm: number[]
  daysOffTrack: number
}

export function calculateHorseScore(data: RaceData): number {
  // Performance Data (50%)
  const pastPositionsScore = calculatePastPositionsScore(data.pastPositions) * 0.25
  const raceClassScore = calculateRaceClassScore(data.raceClass) * 0.15
  const speedRatingScore = calculateSpeedRatingScore(data.speedRatings) * 0.1

  // Track-Specific Suitability (25%)
  const trackFormScore = data.trackForm * 0.15
  const surfaceScore = data.surfaceAdaptability * 0.05
  const distanceScore = data.distanceCompatibility * 0.05

  // Trainer and Jockey (10%)
  const trainerScore = data.trainerStats * 0.05
  const jockeyScore = data.jockeyStats * 0.05

  // Recent Form and Fitness (15%)
  const consistencyScore = calculateConsistencyScore(data.recentForm) * 0.05
  const fitnessScore = calculateFitnessScore(data.daysOffTrack) * 0.1

  const totalScore =
    (pastPositionsScore +
      raceClassScore +
      speedRatingScore +
      trackFormScore +
      surfaceScore +
      distanceScore +
      trainerScore +
      jockeyScore +
      consistencyScore +
      fitnessScore) *
    100

  return Math.round(totalScore * 10) / 10 // Round to 1 decimal place
}

function calculatePastPositionsScore(positions: number[]): number {
  return (
    positions.reduce((acc, pos) => {
      if (pos <= 3) return acc + 1
      if (pos <= 6) return acc + 0.5
      return acc
    }, 0) / positions.length
  )
}

function calculateRaceClassScore(raceClass: string): number {
  const classScores = {
    "Group 1": 1,
    "Group 2": 0.9,
    "Group 3": 0.8,
    Listed: 0.7,
    "Class 1": 0.6,
    "Class 2": 0.5,
    "Class 3": 0.4,
    "Class 4": 0.3,
    "Class 5": 0.2,
    "Class 6": 0.1,
  }
  return classScores[raceClass as keyof typeof classScores] || 0
}

function calculateSpeedRatingScore(ratings: number[]): number {
  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length
  return Math.min(avgRating / 100, 1)
}

function calculateConsistencyScore(recentForm: number[]): number {
  const trend = recentForm.slice().reverse()
  let score = 0
  for (let i = 1; i < trend.length; i++) {
    if (trend[i] <= trend[i - 1]) score += 1
  }
  return score / (trend.length - 1)
}

function calculateFitnessScore(daysOff: number): number {
  if (daysOff <= 30) return 1
  if (daysOff <= 60) return 0.8
  if (daysOff <= 90) return 0.6
  if (daysOff <= 120) return 0.4
  return 0.2
}
