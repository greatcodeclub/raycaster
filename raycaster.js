var RAD = Math.PI / 180

function Player() {
  this.x = 1
  this.y = 5

  this.angle = 35
}

function Map() {
  // Matrix of the walls. 1 = wall, 0 = no wall
  this.grid = [
  // x =>
  // 0  1  2  3  4  5  6  7  8  9
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 0
     1, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 1
     1, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 2
     1, 0, 0, 0, 0, 1, 0, 0, 0, 1, // 3
     1, 0, 0, 0, 0, 1, 0, 0, 0, 1, // 4
     1, 0, 0, 0, 0, 1, 0, 0, 0, 1, // 5
     1, 0, 0, 0, 0, 1, 0, 0, 0, 1, // 6
     1, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 7
     1, 0, 0, 0, 0, 0, 0, 0, 0, 1, // 8
     1, 1, 1, 1, 1, 1, 1, 1, 1, 1  // 9
  ]

  this.width = 10
  this.height = 10

  // Size of one element in the grid.
  this.gridWidth = 64
  this.gridHeight = 64
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
Map.prototype.draw = function(context, player, camera, startX, startY) {
  var scale = 10

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
  context.lineTo((player.x + Math.cos((player.angle - angle) * RAD) * depth) * scale,
                 (player.y + Math.sin((player.angle - angle) * RAD) * depth) * scale)
  context.lineTo((player.x + Math.cos((player.angle + angle) * RAD) * depth) * scale,
                 (player.y + Math.sin((player.angle + angle) * RAD) * depth) * scale)
  context.lineWidth = 2
  context.fillStyle = "#00f"
  context.globalAlpha = 0.2
  context.fill()
  context.globalAlpha = 1

  // Draw player
  context.fillStyle = "#900"
  context.fillRect(player.x * scale, player.y * scale, scale, scale)
}

function Camera(canvas) {
  // Field of view, in degree.
  this.fov = 60

  // Distance from projection plane
  this.distance = canvas.width / 2 / Math.tan(this.fov / 2 * RAD)

  this.maxDistance = 15
}

var canvas = document.getElementById("screen")
var camera = new Camera(canvas)
var player = new Player()
var map = new Map()

var context = canvas.getContext("2d")
map.draw(context, player, camera, 0, 0)

// Loop over each ray angles to cast
var rayAngle = player.angle - (camera.fov / 2)
var angleIncrement = camera.fov / canvas.width

for (var column = 0; column < canvas.width; column += 1) {
  var distance = castRay(player.x, player.y, rayAngle)
  var sliceHeight = 1 / distance * camera.distance
  
  // Draw column slice
  context.fillStyle = '#f0f'
  context.fillRect(column, canvas.height / 2 - sliceHeight / 2, 1, sliceHeight)

  // Shading
  context.fillStyle = '#000'
  context.globalAlpha = distance / camera.maxDistance
  context.fillRect(column, canvas.height / 2 - sliceHeight / 2, 1, sliceHeight)
  context.globalAlpha = 1

  rayAngle += angleIncrement
}

function castRay(startX, startY, angle) {
  for (var i = 0; i < camera.maxDistance; i++) {
    var x = startX + Math.cos(angle * RAD) * i
    var y = startY + Math.sin(angle * RAD) * i

    var hit = map.get(x, y)

    context.fillStyle = hit ? "#900" : "#090"
    context.fillRect(x * 10, y * 10, 5, 5)

    if (hit) return i
  }
}
