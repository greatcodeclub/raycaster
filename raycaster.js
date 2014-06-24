var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var player = new Player()
var map = new Map()
var camera = new Camera(map, player)
var game = new Game(canvas)

game.onFrame(function() {
  // Move the player
  if (game.keyPressed.up) {
    player.move(0.1)
  } else if (game.keyPressed.down) {
    player.move(-0.1)
  }

  // Rotate the player
  if (game.keyPressed.left) {
    player.angle -= 1
  } else if (game.keyPressed.right) {
    player.angle += 1
  }

  var context = canvas.getContext("2d")

  // Clear the screen
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Project the camera on the canvas
  camera.project(canvas)  

  // Draw the mini-map
  map.draw(canvas, player, camera, 0, 0)
})
