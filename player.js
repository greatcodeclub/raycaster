function Player() {
  this.x = 1
  this.y = 1

  this.angle = 45
}

Player.prototype.move = function(distance) {
  this.x += Math.cos(this.angle * DEG) * distance
  this.y += Math.sin(this.angle * DEG) * distance
}
