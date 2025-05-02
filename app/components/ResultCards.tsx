"use client"

import { useState } from "react"
import { useSpring, animated } from "react-spring"
import { useSwipeable } from "react-swipeable"

function HorseCard({ horse, index, currentIndex }) {
  const [flipped, setFlipped] = useState(false)

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  })

  const handleClick = () => setFlipped((state) => !state)

  return (
    <div
      className={`absolute w-full h-full ${index === currentIndex ? "z-10" : `z-${10 - (currentIndex - index)}`}`}
      style={{
        transform: `translateY(${(index - currentIndex) * 10}px)`,
      }}
      onClick={handleClick}
    >
      <animated.div
        className="w-full h-full rounded-lg border border-[#FFBF00] bg-white text-black p-4 shadow-lg"
        style={{
          opacity: opacity.to((o) => 1 - o),
          transform,
          rotateY: "0deg",
        }}
      >
        <h2 className="text-xl font-bold mb-2">{horse.name}</h2>
        <p className="text-lg">Overall Score: {horse.score}/100</p>
      </animated.div>
      <animated.div
        className="w-full h-full rounded-lg border border-[#FFBF00] bg-white text-black p-4 shadow-lg absolute top-0 left-0"
        style={{
          opacity,
          transform: transform.to((t) => `${t} rotateY(180deg)`),
          rotateY: "180deg",
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Trainer: {horse.trainer}</h3>
        <h3 className="text-lg font-semibold mb-2">Jockey: {horse.jockey}</h3>
        <div className="space-y-2">
          <PerformanceBar label="Speed" value={horse.performance.speed} />
          <PerformanceBar label="Stamina" value={horse.performance.stamina} />
          <PerformanceBar label="Agility" value={horse.performance.agility} />
        </div>
      </animated.div>
    </div>
  )
}

function PerformanceBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

export default function ResultCards({ results }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, results.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    onSwipedUp: () => setCurrentIndex((prev) => Math.min(prev + 1, results.length - 1)),
    onSwipedDown: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  if (results.length === 0) {
    return null
  }

  return (
    <div {...handlers} className="relative h-96 w-full max-w-sm mx-auto">
      {results.map((horse, index) => (
        <HorseCard key={horse.name} horse={horse} index={index} currentIndex={currentIndex} />
      ))}
    </div>
  )
}
