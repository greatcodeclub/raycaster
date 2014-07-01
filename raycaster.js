var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var map = new Map()
var camera = new Camera(map)
var game = new Game(canvas)

var context = canvas.getContext("2d")

game.onFrame(function() {
  if (game.keyPressed.up) {
    camera.move(10)
  } else if (game.keyPressed.down) {
    camera.move(-10)
  }

  if (game.keyPressed.left) {
    camera.angle -= 1
  } else if (game.keyPressed.right) {
    camera.angle += 1
  }

  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  camera.project(map, canvas)

  // Draw the mini-map
  map.draw(canvas, camera)
})
