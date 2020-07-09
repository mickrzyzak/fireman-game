export function mapToStore(x, y, data, visual, temperature) {
  return {
    type: 'mapToStore',
    cords: { x, y },
    data,
    visual,
    temperature,
  }
}

export function gridToggle() {
  return {
    type: 'gridToggle',
  }
}

export function visualLayerToggle() {
  return {
    type: 'visualLayerToggle',
  }
}

export function clientSelected(selected, selectedId = null) {
  return {
    type: 'clientSelected',
    selected,
    selectedId,
  }
}

export function addFireman(id, position) {
  return {
    type: 'addFireman',
    id,
    position,
  }
}

export function setFiremanTarget(id, target, action) {
  return {
    type: 'setFiremanTarget',
    id,
    target,
    action,
  }
}

export function moveFireman(id, target, orientation) {
  return {
    type: 'moveFireman',
    id,
    target,
    orientation,
  }
}

export function setConnection(id, connection) {
  return {
    type: 'setConnection',
    id,
    connection,
  }
}

export function addConnectionPoint(id, point) {
  return {
    type: 'addConnectionPoint',
    id,
    point,
  }
}
