var DEG = Math.PI / 180 // 1 deg == pi/180 radian

function Player() {
  this.x = 1
  this.y = 1

  this.angle = 45
}

Player.prototype.move = function(distance) {
  this.x += Math.cos(this.angle * DEG) * distance
  this.y += Math.sin(this.angle * DEG) * distance
}

function Map() {
  // Matrix of the walls. 1 = wall, 0 = no wall
  this.grid = [
  // x =>
  // 0  1  2  3  4  5  6  7  8  9
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0
     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, // 1
     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, // 2
     0, 0, 0, 1, 1, 1, 1, 1, 0, 0, // 3
     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, // 4
     0, 0, 0, 0, 0, 1, 0, 0, 0, 0, // 5
     1, 1, 1, 0, 0, 1, 0, 0, 1, 1, // 6
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 7
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 8
     0, 0, 0, 0, 0, 1, 0, 0, 0, 0  // 9
  ]

  this.width = 10
  this.height = 10
}

Map.prototype.get = function(x, y) {
  x = Math.floor(x)
  y = Math.floor(y)
  if (x < 0 || x >= this.width ||
      y < 0 || y >= this.height) {
    return 1 // default to wall
  }
  return this.grid[x + y * this.width]
}

// Draw a mini map on screen w/ the player and its field of view.
Map.prototype.draw = function(canvas, player, camera, startX, startY) {
  var scale = 10
  var context = canvas.getContext("2d")

  for (var x = startX; x < this.width; x++) {
    for (var y = startY; y < this.width; y++) {
      if (this.get(x, y)) {
        // wall
        context.fillStyle = "#000"
      } else {
        context.fillStyle = "#fff"
      }
      context.fillRect(x * scale, y * scale, scale, scale)
    }
  }

  // Draw FOV
  var depth = 5
  var angle = camera.fov / 2
  context.beginPath()
  context.moveTo(player.x * scale, player.y * scale)
  context.lineTo((player.x + Math.cos((player.angle - angle) * DEG) * depth) * scale,
                 (player.y + Math.sin((player.angle - angle) * DEG) * depth) * scale)
  context.lineTo((player.x + Math.cos((player.angle + angle) * DEG) * depth) * scale,
                 (player.y + Math.sin((player.angle + angle) * DEG) * depth) * scale)
  context.lineWidth = 2
  context.fillStyle = "#00f"
  context.globalAlpha = 0.2
  context.fill()
  context.globalAlpha = 1

  // Draw player
  context.fillStyle = "#900"
  context.fillRect(player.x * scale, player.y * scale, scale, scale)
}

function Camera(map, player) {
  this.map = map
  this.player = player

  // Field of view, in degree.
  this.fov = 60

  // Max distance to draw
  this.maxDistance = 15
}

Camera.prototype.project = function(canvas) {
  var context = canvas.getContext("2d")

  // Loop over each ray angles to cast
  var rayAngle = player.angle - (this.fov / 2)
  var angleIncrement = this.fov / canvas.width
  // Distance from projection plane
  var distanceFromPlane = canvas.width / 2 / Math.tan(this.fov / 2 * DEG)

  for (var x = 0; x < canvas.width; x++) {
    var distance = this.castRay(rayAngle)
    
    // Correct fish eye distortion
    distance = distance * Math.cos((player.angle - rayAngle) * DEG)

    var sliceHeight = 1 / distance * distanceFromPlane

    // Center column vertically
    var y = canvas.height / 2 - sliceHeight / 2

    // Draw column slice
    context.fillStyle = '#f0f'
    context.fillRect(x, y, 1, sliceHeight)

    // Shade it based on distance
    context.fillStyle = '#000'
    context.globalAlpha = distance / this.maxDistance * 1.3
    context.fillRect(x, y, 1, sliceHeight)
    context.globalAlpha = 1

    rayAngle += angleIncrement
  }
}

Camera.prototype.castRay = function(angle) {
  var x = player.x
  var y = player.y

  var lengthIncrement = 0.01
  var xIncrement = Math.cos(angle * DEG) * lengthIncrement
  var yIncrement = Math.sin(angle * DEG) * lengthIncrement

  for (var length = 0; length < this.maxDistance; length+=0.01) {
    x += xIncrement
    y += yIncrement

    var hit = map.get(x, y)

    if (hit) return length
  }
}

var canvas = document.getElementById("screen")
var player = new Player()
var map = new Map()
var camera = new Camera(map, player)
var game = new Game(canvas)

game.onFrame(function() {
  if (game.keyPressed.up) {
    player.move(0.1)
  } else if (game.keyPressed.down) {
    player.move(-0.1)
  }

  if (game.keyPressed.left) {
    player.angle -= 1
  } else if (game.keyPressed.right) {
    player.angle += 1
  }

  var context = canvas.getContext("2d")

  // Clear the screen
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  camera.project(canvas)  
  map.draw(canvas, player, camera, 0, 0)
})
