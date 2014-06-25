function Game(canvas) {
  var self = this

  // Keep track of key states
  // Eg.:
  //   game.keyPressed.up === true  // while UP key is pressed)
  //   game.keyPressed.up === false // when UP key is released)
  this.keyPressed = {}

  $(canvas).on('keydown keyup', function(e) {
    // Convert key code to key name
    var keyName = Game.keys[e.which]

    if (keyName) {
      // eg.: `self.keyPressed.up = true` on keydown
      // Will be set to `false` on keyup
      self.keyPressed[keyName] = e.type === 'keydown'
      e.preventDefault()
    }
  })
}

// Some key code to key name mappings
Game.keys = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

// Setup the game loop.
//
// Calls the `callback` each time the screen needs to be redrawn.
Game.prototype.onFrame = function(callback) {
  var self = this

  var time = new Date().getTime()

  if (window.requestAnimationFrame) {
    requestAnimationFrame(function() {
      callback()
      // requestAnimationFrame only calls our callback once, we need to
      // schedule the next call ourself.
      self.onFrame(callback)
    })
  } else {
    // requestAnimationFrame is not supported by all browsers. We fall back to
    // a timer.
    var fps = 60
    setInterval(callback, 1000 / fps)
  }
}
