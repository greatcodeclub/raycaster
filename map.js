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
