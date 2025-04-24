"use client"

import Matter from "matter-js"
import { useState, useRef } from "react"
import { View, TouchableWithoutFeedback } from "react-native"
import SpriteSheet from "rn-sprite-sheet"

const Fire = (props) => {
  const fire = useRef(null)
  const [isActive, setIsActive] = useState(false)

  const width = props.body.bounds.max.x - props.body.bounds.min.x
  const height = props.body.bounds.max.y - props.body.bounds.min.y

  const xPos = props.body.position.x - width / 2
  const yPos = props.body.position.y - height / 2

  const startAnimate = (type) => {
    if (fire.current) {
      fire.current.play({
        type: type,
        fps: 24,
        loop: type === "burn",
        onFinish: () => {
          if (type === "ignite") {
            setIsActive(true)
            fire.current.play({
              type: "burn",
              fps: 24,
              loop: true,
            })
          } else if (type === "extinguish") {
            setIsActive(false)
          }
        },
      })
    }
  }

  return (
    <View
      style={{
        position: "absolute",
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        borderWidth: props.debug ? 1 : 0,
        borderColor: "orange",
      }}
    >
      <SpriteSheet
        ref={fire}
        source={require("../assets/fire.png")}
        columns={6}
        rows={3}
        height={height}
        imageStyle={{ marginTop: 0 }}
        animations={{
          ignite: [0, 1, 2, 3, 4, 5, 6, 7],
          burn: [8, 9, 10, 11, 12, 13, 14, 15, 16],
          extinguish: [17],
        }}
        onLoad={() => startAnimate("ignite")}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          if (isActive) {
            startAnimate("extinguish")
          } else {
            startAnimate("ignite")
          }
        }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      </TouchableWithoutFeedback>
    </View>
  )
}

export default (world, color, pos, size, options = {}) => {
  const initialOptions = {
    label: "Fire",
    isStatic: true,
    isSensor: true,
    ...options,
  }

  const fireBodies = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, initialOptions)

  Matter.World.add(world, fireBodies)

  return {
    body: fireBodies,
    color,
    pos,
    size,
    isActive: false,
    debug: false,
    renderer: <Fire />,
  }
}

