export interface Horse {
  id: string
  name: string
  score: number
  jockey: string
  trainer: string
  performance: {
    winRate: number
    jockeyPerformance: number
    trainerForm: number
    groundDurability: number
    injuryHistory: number
    ageAndWeight: number
  }
}

export interface RaceData {
  id: string
  name: string
  horses: Horse[]
}
