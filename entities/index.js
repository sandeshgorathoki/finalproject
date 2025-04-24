import Matter from "matter-js"
import { Dimensions } from "react-native"
import Monster from "../components/Monster"
import Candle from "../components/Candle"
import Edges from "../components/Edges"

export default (gameWorld) => {
  const engine = Matter.Engine.create({ enableSleeping: false })
  const world = engine.world
  engine.gravity.y = 0.4 

  const screenWidth = Dimensions.get("window").width
  const screenHeight = Dimensions.get("window").height

  return {
    physics: { engine, world },

    LeftCandle: Candle(
      world,
      "blue",
      { x: 60, y: screenHeight - 100 }, 
      { height: 90, width: 60 },
      { id: "LeftCandle" },
    ),

    RightCandle: Candle(
      world,
      "blue",
      { x: screenWidth - 60, y: screenHeight - 100 }, 
      { height: 90, width: 60 },
      { id: "RightCandle" },
    ),

    Monster: Monster(
      world,
      "blue",
      { x: screenWidth / 2, y: 100 }, 
      { height: 78, width: 50 },
      { label: "Monster", restitution: 0, frictionAir: 0 },
      { animType: "appear", visibility: "flex" },
    ),

    TopEdge: Edges(
      world,
      "transparent", 
      { x: screenWidth / 2, y: 0 },
      { height: 30, width: screenWidth },
    ),
    LeftEdge: Edges(world, "transparent", { x: 0, y: screenHeight / 2 }, { height: screenHeight, width: 30 }),
    RightEdge: Edges(
      world,
      "transparent",
      { x: screenWidth, y: screenHeight / 2 },
      { height: screenHeight, width: 30 },
    ),
    BottomEdge: Edges(
      world,
      "transparent",
      { x: screenWidth / 2, y: screenHeight },
      { height: 30, width: screenWidth },
    ),

    Ground: Edges(
      world,
      "transparent",
      { x: screenWidth / 2, y: screenHeight - 50 },
      { height: 10, width: screenWidth },
    ),
  }
}

