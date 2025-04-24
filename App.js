"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ImageBackground } from "react-native"
import SpriteSheet from "rn-sprite-sheet"
import Images from "./Images"

export default function App() {
  const screenWidth = Dimensions.get("window").width
  const screenHeight = Dimensions.get("window").height

  const GROUND_LEVEL = screenHeight - 150

  const leftCandlePosition = { x: 80, y: GROUND_LEVEL }
  const rightCandlePosition = { x: screenWidth - 80, y: GROUND_LEVEL }
  const thirdCandlePosition = { x: screenWidth - 160, y: GROUND_LEVEL }

  const [leftCandleIsLit, setLeftCandleIsLit] = useState(true)
  const [rightCandleIsLit, setRightCandleIsLit] = useState(true)
  const [thirdCandleIsLit, setThirdCandleIsLit] = useState(true)
  const [candlesVisible, setCandlesVisible] = useState(false)

  const [monsterState, setMonsterState] = useState({
    animation: "appear",
    position: { x: 150, y: 100 },
    isVisible: true,
    isWalking: false,
    hasDied: false,
  })

  const [fallButtonVisible, setFallButtonVisible] = useState(false)

  const leftCandleRef = useRef(null)
  const rightCandleRef = useRef(null)
  const thirdCandleRef = useRef(null)
  const monsterRef = useRef(null)

  const fallIntervalRef = useRef(null)
  const walkIntervalRef = useRef(null)

  const [debug, setDebug] = useState({
    message: "Waiting for the monster to appear...",
    collisionDetected: false,
  })

  const startMonsterFall = () => {
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current)
    }

    setDebug((prev) => ({ ...prev, message: "Monster falling..." }))

    setCandlesVisible(true)

    let y = monsterState.position.y
    fallIntervalRef.current = setInterval(() => {
      y += 5
      if (y >= GROUND_LEVEL) {
        clearInterval(fallIntervalRef.current)
        fallIntervalRef.current = null

        setMonsterState((prev) => ({
          ...prev,
          animation: "idle",
          position: { ...prev.position, y: GROUND_LEVEL },
          isWalking: false,
        }))

        setDebug((prev) => ({ ...prev, message: "Monster ready. Click to walk." }))
      } else {
        setMonsterState((prev) => ({
          ...prev,
          position: { ...prev.position, y },
        }))
      }
    }, 30)
  }

  useEffect(() => {
    setCandlesVisible(false)

    if (monsterRef.current) {
      monsterRef.current.play({
        type: "appear",
        fps: 24,
        loop: false,
        onFinish: () => {
          setDebug((prev) => ({ ...prev, message: "Monster appearing..." }))
          startMonsterFall()
        },
      })
    }
    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current)
      }
      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (monsterRef.current && monsterState.animation !== "appear") {
      monsterRef.current.play({
        type: monsterState.animation,
        fps: 24,
        loop: monsterState.animation === "walk",
        onFinish: () => {
          if (monsterState.animation === "die") {
            setDebug((prev) => ({ ...prev, message: "Monster died! Tap anywhere to restart." }))
            setTimeout(() => {
              setMonsterState((prev) => ({
                ...prev,
                isVisible: false,
                hasDied: true,
              }))
            }, 1000)
          }
        },
      })
    }
  }, [monsterState.animation])

  useEffect(() => {
    if (candlesVisible) {
      if (leftCandleRef.current) {
        leftCandleRef.current.play({
          type: "light",
          fps: 24,
          loop: true,
        })
      }

      if (rightCandleRef.current) {
        rightCandleRef.current.play({
          type: "light",
          fps: 24,
          loop: true,
        })
      }

      if (thirdCandleRef.current) {
        thirdCandleRef.current.play({
          type: "light",
          fps: 24,
          loop: true,
        })
      }
    }
  }, [candlesVisible])

  useEffect(() => {
    if (leftCandleRef.current && candlesVisible) {
      leftCandleRef.current.play({
        type: leftCandleIsLit ? "light" : "extinguish",
        fps: 24,
        loop: leftCandleIsLit,
      })
    }
  }, [leftCandleIsLit, candlesVisible])

  useEffect(() => {
    if (rightCandleRef.current && candlesVisible) {
      rightCandleRef.current.play({
        type: rightCandleIsLit ? "light" : "extinguish",
        fps: 24,
        loop: rightCandleIsLit,
      })
    }
  }, [rightCandleIsLit, candlesVisible])

  useEffect(() => {
    if (thirdCandleRef.current && candlesVisible) {
      thirdCandleRef.current.play({
        type: thirdCandleIsLit ? "light" : "extinguish",
        fps: 24,
        loop: thirdCandleIsLit,
      })
    }
  }, [thirdCandleIsLit, candlesVisible])

  const handleMonsterClick = () => {
    if (
      !monsterState.isWalking &&
      !monsterState.hasDied &&
      monsterState.animation !== "die" &&
      monsterState.position.y >= GROUND_LEVEL
    ) {
      setMonsterState((prev) => ({
        ...prev,
        animation: "walk",
        isWalking: true,
      }))

      setDebug((prev) => ({ ...prev, message: "Monster walking to right candle..." }))

      if (walkIntervalRef.current) {
        clearInterval(walkIntervalRef.current)
      }

      let x = monsterState.position.x
      const targetX = rightCandlePosition.x - 50
      walkIntervalRef.current = setInterval(() => {
        x += 10

        if (x >= targetX) {
          clearInterval(walkIntervalRef.current)
          walkIntervalRef.current = null

          setMonsterState((prev) => ({
            ...prev,
            animation: "die",
            position: { ...prev.position, x: targetX },
            isWalking: false,
          }))

          setDebug((prev) => ({
            ...prev,
            message: "COLLISION DETECTED! Monster dying...",
            collisionDetected: true,
          }))
        } else {
          setMonsterState((prev) => ({
            ...prev,
            position: { ...prev.position, x },
          }))
        }
      }, 50)
    }
  }

  const toggleLeftCandle = () => {
    setLeftCandleIsLit(!leftCandleIsLit)
  }

  const toggleRightCandle = () => {
    setRightCandleIsLit(!rightCandleIsLit)
  }

  const toggleThirdCandle = () => {
    setThirdCandleIsLit(!thirdCandleIsLit)
  }

  const resetGame = () => {
    if (fallIntervalRef.current) {
      clearInterval(fallIntervalRef.current)
      fallIntervalRef.current = null
    }

    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current)
      walkIntervalRef.current = null
    }

    setLeftCandleIsLit(true)
    setRightCandleIsLit(true)
    setThirdCandleIsLit(true)

    setCandlesVisible(false)

    setFallButtonVisible(false)

    setDebug({
      message: "Click the Fall button to make the monster fall...",
      collisionDetected: false,
    })

    setMonsterState({
      animation: "appear",
      position: { x: 150, y: 100 },
      isVisible: true,
      isWalking: false,
      hasDied: false,
    })

    if (monsterRef.current) {
      monsterRef.current.play({
        type: "appear",
        fps: 24,
        loop: false,
        onFinish: () => {
          startMonsterFall()
        },
      })
    }
  }

  const candleOffset = { x: 30, y: 45 }
  const monsterOffset = { x: 25, y: 39 }

  const handleScreenTap = () => {
    if (monsterState.hasDied) {
      resetGame()
      console.log("Screen tapped - resetting game")
      setFallButtonVisible(true)
    }
  }

  return (
    <View style={styles.borderContainer}>
      <ImageBackground source={Images.Background} style={styles.backgroundImage}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleScreenTap}>
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>{debug.message}</Text>
          </View>

          <View style={[styles.groundLine, { top: GROUND_LEVEL }]} />

          {candlesVisible && (
            <>
              <View style={[styles.candle, { left: leftCandlePosition.x, top: leftCandlePosition.y }]}>
                <SpriteSheet
                  ref={leftCandleRef}
                  source={require("./assets/candle-sprite.png")}
                  columns={8}
                  rows={1}
                  height={100}
                  width={400}
                  imageStyle={{ marginLeft: -25 }}
                  animations={{
                    light: Array.from({ length: 8 }, (_, i) => i),
                    extinguish: [7],
                  }}
                />
              </View>

              <View style={[styles.candle, { left: rightCandlePosition.x, top: rightCandlePosition.y }]}>
                <SpriteSheet
                  ref={rightCandleRef}
                  source={require("./assets/candle-sprite.png")}
                  columns={8}
                  rows={1}
                  height={100}
                  width={400}
                  imageStyle={{ marginLeft: -25 }}
                  animations={{
                    light: Array.from({ length: 8 }, (_, i) => i),
                    extinguish: [7],
                  }}
                />
              </View>

              <View style={[styles.candle, { left: thirdCandlePosition.x, top: thirdCandlePosition.y }]}>
                <SpriteSheet
                  ref={thirdCandleRef}
                  source={require("./assets/candle-sprite.png")}
                  columns={8}
                  rows={1}
                  height={100}
                  width={400}
                  imageStyle={{ marginLeft: -25 }}
                  animations={{
                    light: Array.from({ length: 8 }, (_, i) => i),
                    extinguish: [7],
                  }}
                />
              </View>
            </>
          )}
          {monsterState.isVisible && (
            <TouchableOpacity
              style={[
                styles.monster,
                {
                  left: monsterState.position.x - monsterOffset.x,
                  top: monsterState.position.y - monsterOffset.y,
                },
              ]}
              onPress={handleMonsterClick}
            >
              <SpriteSheet
                ref={monsterRef}
                source={require("./assets/mummy.png")}
                columns={9}
                rows={6}
                height={78}
                animations={{
                  walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                  appear: Array.from({ length: 15 }, (v, i) => i + 18),
                  die: Array.from({ length: 21 }, (v, i) => i + 33),
                  idle: [0],
                }}
              />
            </TouchableOpacity>
          )}

          <Text style={styles.nameText}>Rupsagar Shrestha</Text>

          {fallButtonVisible && (
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetButtonText}>Fall</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  borderContainer: {
    flex: 1,
    borderWidth: 10,
    borderColor: "#FF0000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  nameText: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 10,
  },
  candle: {
    position: "absolute",
    width: 60,
    height: 90,
  },
  monster: {
    position: "absolute",
    width: 50,
    height: 78,
  },
  resetButton: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    zIndex: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  debugContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  debugText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 5,
    borderRadius: 5,
  },
  collisionHighlight: {
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 5,
  },
  groundLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
})

