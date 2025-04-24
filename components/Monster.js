import React from "react"
import { View } from "react-native"
import SpriteSheet from "rn-sprite-sheet"

class Monster extends React.Component {
  constructor(props) {
    super(props)
    this.monster = null
    this.state = {
      currentAnimation: "appear",
    }
  }

  componentDidMount() {
    if (this.monster) {
      this.monster.play({
        type: "appear",
        fps: 24,
        loop: false,
        onFinish: () => {
          this.setState({ currentAnimation: "idle" })
        },
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.animType !== this.props.animType && this.monster) {
      console.log("Changing animation to:", this.props.animType)
      this.setState({ currentAnimation: this.props.animType })

      this.monster.play({
        type: this.props.animType,
        fps: 24,
        loop: this.props.animType === "walk",
        onFinish: () => {
          if (this.props.animType === "die") {
            console.log("Monster death animation completed")
          }
        },
      })
    }
  }

  render() {
    const width = 50 
    const height = 78 
    const x = this.props.body.position.x - width / 2
    const y = this.props.body.position.y - height / 2

    return (
      <View
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: width,
          height: height,
          display: this.props.visibility || "flex",
        }}
      >
        <SpriteSheet
          ref={(ref) => (this.monster = ref)}
          source={require("../assets/mummy.png")}
          columns={9}
          rows={6}
          height={height}
          animations={{
            walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            appear: Array.from({ length: 15 }, (v, i) => i + 18),
            die: Array.from({ length: 21 }, (v, i) => i + 33),
            idle: [0], 
          }}
          onLoad={() => {
            console.log("Monster spritesheet loaded")
          }}
        />
      </View>
    )
  }
}

export default Monster

