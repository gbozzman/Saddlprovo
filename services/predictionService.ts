import { supabase } from "@/lib/supabase"
import type { LiveRaceRunner } from "@/lib/supabase"

// Check if we're in a preview environment or missing credentials
const isMissingCredentials = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export type Prediction = {
  id?: number
  user_id: string
  race_id: string
  predicted_order: string // JSON string of horse IDs in predicted order
  created_at?: string
}

// Store predictions in memory for preview mode
const mockPredictions: Record<string, Prediction> = {}

export async function savePrediction(
  userId: string,
  raceId: string,
  predictedHorses: LiveRaceRunner[],
): Promise<Prediction | null> {
  try {
    // Extract just the IDs in order
    const predictedOrder = predictedHorses.map((horse) => horse.id)

    // If we're in preview mode, store prediction in memory
    if (isMissingCredentials) {
      const prediction = {
        id: Date.now(),
        user_id: userId,
        race_id: raceId,
        predicted_order: JSON.stringify(predictedOrder),
        created_at: new Date().toISOString(),
      }

      // Use a composite key of userId + raceId
      const key = `${userId}-${raceId}`
      mockPredictions[key] = prediction

      console.log("Saved mock prediction:", prediction)
      return prediction
    }

    // Otherwise, save to Supabase
    try {
      const { data, error } = await supabase
        .from("user_predictions") // Changed table name to user_predictions
        .upsert(
          {
            user_id: userId,
            race_id: raceId,
            predicted_order: JSON.stringify(predictedOrder),
            created_at: new Date().toISOString(),
          },
          { onConflict: "user_id,race_id" },
        )
        .select()
        .single()

      if (error) {
        console.error("Error saving prediction:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception saving prediction:", error)
      return null
    }
  } catch (error) {
    console.error("Exception in savePrediction:", error)
    return null
  }
}

export async function getUserPrediction(userId: string, raceId: string): Promise<LiveRaceRunner[] | null> {
  try {
    // If we're in preview mode, get prediction from memory
    if (isMissingCredentials) {
      const key = `${userId}-${raceId}`
      const prediction = mockPredictions[key]

      if (!prediction) {
        return null
      }

      // For mock data, just return empty array since we don't have the actual horses
      return []
    }

    // Otherwise, get from Supabase
    try {
      const { data, error } = await supabase
        .from("user_predictions") // Changed table name to user_predictions
        .select("*")
        .eq("user_id", userId)
        .eq("race_id", raceId)
        .single()

      if (error) {
        // Check if the error is because the table doesn't exist
        if (error.message.includes("does not exist")) {
          console.warn("Table user_predictions does not exist yet. This is expected if no predictions have been made.")
          return null
        }

        console.error("Error fetching prediction:", error)
        return null
      }

      if (!data) {
        return null
      }

      // We need to fetch the actual horses and order them according to the prediction
      const predictedOrder = JSON.parse(data.predicted_order)

      const { data: horses, error: horsesError } = await supabase
        .from("live_race_runners")
        .select("*")
        .eq("race_id", raceId)
        .in("id", predictedOrder)

      if (horsesError) {
        console.error("Error fetching horses for prediction:", horsesError)
        return null
      }

      // Sort horses according to predicted order
      return predictedOrder.map((id: number) => horses.find((horse) => horse.id === id))
    } catch (error) {
      console.error("Exception fetching prediction:", error)
      return null
    }
  } catch (error) {
    console.error("Exception in getUserPrediction:", error)
    return null
  }
}
