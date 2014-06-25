var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var map = new Map()
var camera = new Camera(map)
var game = new Game(canvas)

game.onFrame(function() {
  // Move the camera
  if (game.keyPressed.up) {
    camera.move(0.1)
  } else if (game.keyPressed.down) {
    camera.move(-0.1)
  }

  // Rotate the camera
  if (game.keyPressed.left) {
    camera.angle -= 1
  } else if (game.keyPressed.right) {
    camera.angle += 1
  }

  var context = canvas.getContext("2d")

  // Clear the screen
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Project the camera on the canvas
  camera.project(canvas)

  // Draw the mini-map
  map.draw(canvas, camera, 0, 0)
})
