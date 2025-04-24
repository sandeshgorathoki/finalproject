import React from "react"
import { View } from "react-native"
import SpriteSheet from "rn-sprite-sheet"

class Candle extends React.Component {
  constructor(props) {
    super(props)
    this.candle = null
    this.state = {
      isLit: false,
    }
  }

  componentDidMount() {
    if (this.candle) {
      this.candle.play({
        type: "extinguish",
        fps: 24,
        loop: false,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLit !== this.props.isLit) {
      if (this.candle) {
        if (this.props.isLit) {
          this.candle.play({
            type: "light",
            fps: 24,
            loop: true,
          })
        } else {
          this.candle.play({
            type: "extinguish",
            fps: 24,
            loop: false,
          })
        }
      }
    }
  }

  render() {
    const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x
    const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y
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
        }}
      >
        <SpriteSheet
          ref={(ref) => (this.candle = ref)}
          source={require("../assets/candle.png")}
          columns={7}
          rows={2}
          height={height}
          animations={{
            light: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            extinguish: [7],
          }}
        />
      </View>
    )
  }
}

export default Candle

