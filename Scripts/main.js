exports.activate = function() {
  trail = []
}

exports.deactivate = function() {
  trail = []
}

nova.commands.register("trail.push", (editor) => {
  push(waypoint(editor))
})

nova.commands.register("trail.pop", (editor) => {
  openWaypoint(pop())
})

nova.commands.register("trail.pop_to", (editor) => {
  if (trail.length > 0) {
    nova.workspace.showChoicePalette(trailChoices(trail), {}, (name, index) => openWaypoint(popTo(index)))
  } else {
    nova.workspace.showChoicePalette(["Trail is empty — add some waypoints first"], {}, (name, index) => null)
  }
})

// // //

function openWaypoint(waypoint) {
  if (waypoint) {
    nova.workspace.openFile(waypoint.path, { line: waypoint.line, column: waypoint.column })
  }
}

function openWaypointAtIndex(index) {
  if (index) {
    openWaypoint(trail[index])
  }
}

function pop() {
  return trail.shift()
}

function popTo(index) {
  if (index >= 0 && index < trail.length) {
    const removed = trail.splice(0, index + 1)
    return removed[removed.length - 1]
  }
}

function push(waypoint) {
  trail.unshift(waypoint)
}

function relativePath(path) {
  return nova.workspace.relativizePath(path)
}

function trailChoices(trail) {
  return trail.map((waypoint) => `${relativePath(waypoint.path)} (line ${waypoint.line}, col ${waypoint.column})`)
}

function waypoint(editor) {
  const text = editor.document.getTextInRange(new Range(0, editor.document.length))
  const cursorPosition = editor.selectedRange.start
  const lines = text.slice(0, cursorPosition).split('\n')
  const line = lines.length
  const column = lines.slice(-1)[0].length + 1
  const path = editor.document.path

  return {path: path, line: line, column: column}
}
