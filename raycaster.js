var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var map = new Map()
var camera = new Camera(map)

// Draw the mini-map
map.draw(canvas, camera)
