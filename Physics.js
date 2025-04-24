import Matter from "matter-js"

const Physics = (entities, { touches, time }) => {
  const engine = entities.physics.engine
  const world = entities.physics.world

  Matter.Engine.update(engine, time.delta)

  const monster = entities.monster
  const rightCandle = entities.rightCandle
  const leftCandle = entities.leftCandle

  if (monster && monster.visibility === "flex") {
    const monsterX = monster.body.position.x
    const monsterY = monster.body.position.y
    const rightCandleX = rightCandle.body.position.x
    const rightCandleY = rightCandle.body.position.y

    if (monster.animType === "walk") {
      const direction = rightCandleX > monsterX ? 1 : -1

      Matter.Body.setVelocity(monster.body, {
        x: direction * 3, 
        y: monster.body.velocity.y,
      })

      const dx = Math.abs(monsterX - rightCandleX)

      if (dx < 50 && monster.animType !== "die") {
        console.log("FORCED COLLISION: Monster reached right candle!")

        Matter.Body.setPosition(monster.body, {
          x: rightCandleX - 25, 
          y: monster.body.position.y,
        })

        Matter.Body.setVelocity(monster.body, { x: 0, y: 0 })
        Matter.Sleeping.set(monster.body, true) 

        monster.animType = "die"

        setTimeout(() => {
          monster.visibility = "none"
        }, 2000) 
      }
    }
  }

  touches
    .filter((t) => t.type === "press")
    .forEach((t) => {
      const touchX = t.event.pageX
      const touchY = t.event.pageY

      if (monster && monster.visibility === "flex" && monster.animType !== "walk" && monster.animType !== "die") {
        const monsterX = monster.body.position.x
        const monsterY = monster.body.position.y
        const monsterWidth = 50
        const monsterHeight = 78
        if (
          touchX >= monsterX - monsterWidth / 2 &&
          touchX <= monsterX + monsterWidth / 2 &&
          touchY >= monsterY - monsterHeight / 2 &&
          touchY <= monsterY + monsterHeight / 2
        ) {
          console.log("Monster touched, starting to walk")
          monster.animType = "walk"

          const rightCandleX = rightCandle.body.position.x
          const direction = rightCandleX > monsterX ? 1 : -1
          Matter.Body.setVelocity(monster.body, { x: direction * 3, y: 0 })
        }
      }

      if (leftCandle) {
        const candleX = leftCandle.body.position.x
        const candleY = leftCandle.body.position.y
        const candleWidth = 60
        const candleHeight = 90

        if (
          touchX >= candleX - candleWidth / 2 &&
          touchX <= candleX + candleWidth / 2 &&
          touchY >= candleY - candleHeight / 2 &&
          touchY <= candleY + candleHeight / 2
        ) {
          console.log("Left candle touched")
          leftCandle.isLit = !leftCandle.isLit
        }
      }

      if (rightCandle) {
        const candleX = rightCandle.body.position.x
        const candleY = rightCandle.body.position.y
        const candleWidth = 60
        const candleHeight = 90

        if (
          touchX >= candleX - candleWidth / 2 &&
          touchX <= candleX + candleWidth / 2 &&
          touchY >= candleY - candleHeight / 2 &&
          touchY <= candleY + candleHeight / 2
        ) {
          console.log("Right candle touched")
          rightCandle.isLit = !rightCandle.isLit
        }
      }
    })

  return entities
}

export default Physics

