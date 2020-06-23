const map = (state = { cords: { x: null, y: null }, data: [], temperature: [], grid: false }, action) => {
  switch(action.type) {
    case 'mapToStore':
      return {
        ...state,
        cords: { x: action.cords.x, y: action.cords.y },
        data: action.data,
        temperature: action.temperature,
      };
    case 'gridToggle':
      return { ...state, grid: !state.grid };
    default:
      return state;
  }
}

export default map;
