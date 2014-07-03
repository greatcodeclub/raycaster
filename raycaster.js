var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var map = new Map()
var camera = new Camera(map)
var game = new Game(canvas)

camera.project(map, canvas)

// Draw the mini-map
map.draw(canvas, camera)
