import { View } from "react-native"

const Box = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x
  const height = props.body.bounds.max.y - props.body.bounds.min.y
  const x = props.body.position.x - width / 2
  const y = props.body.position.y - height / 2

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: props.color || "red",
      }}
    />
  )
}

export default Box

