function Camera() {
  // Initial camera position
  this.x = 0
  this.y = 500

  // Camera angle
  this.angle = 0

  // Field of view, in degree.
  this.fov = 60

  // Max distance to draw
  this.maxDistance = 1500
}

Camera.prototype.project = function(map, canvas) {
  var angle = this.angle - (this.fov / 2)
  var angleIncrement = this.fov / canvas.width

  var distanceFromScreen = canvas.width / 2 / Math.tan(this.fov / 2 * DEG)

  var context = canvas.getContext("2d")

  for (var x = 0; x < canvas.width; x++) {
    var distance = this.castRay(angle, map)

    distance = distance * Math.cos((this.angle - angle) * DEG)

    var sliceHeight = map.wallHeight / distance * distanceFromScreen

    var y = canvas.height / 2 - sliceHeight / 2

    context.fillStyle = '#f0f'
    context.fillRect(x, y, 1, sliceHeight)

    context.fillStyle = '#000'
    context.globalAlpha = distance / this.maxDistance
    context.fillRect(x, y, 1, sliceHeight)
    context.globalAlpha = 1

    angle += angleIncrement
  }
}

Camera.prototype.castRay = function(angle, map) {
  var x = this.x
  var y = this.y

  var xIncrement = Math.cos(angle * DEG)
  var yIncrement = Math.sin(angle * DEG)

  for (var length = 0; length < this.maxDistance; length++) {
    x += xIncrement
    y += yIncrement

    var hit = map.get(x, y)

    if (hit) return length
  }
}

Camera.prototype.move = function(distance) {
  this.x += Math.cos(this.angle * DEG) * distance
  this.y += Math.sin(this.angle * DEG) * distance
}
