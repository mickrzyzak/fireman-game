export function mapToStore(x, y, data, temperature) {
  return {
    type: 'mapToStore',
    cords: { x, y },
    data,
    temperature,
  }
}

export function gridToggle() {
  return {
    type: 'gridToggle',
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
