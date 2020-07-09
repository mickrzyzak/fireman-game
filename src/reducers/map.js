const map = (state = { cords: { x: null, y: null }, data: [], visual: [], temperature: [], grid: false, visualLayer: true }, action) => {
  switch(action.type) {
    case 'mapToStore':
      return {
        ...state,
        cords: { x: action.cords.x, y: action.cords.y },
        data: action.data,
        visual: action.visual,
        temperature: action.temperature,
      };
    case 'gridToggle':
      return { ...state, grid: !state.grid };
    case 'visualLayerToggle':
      return { ...state, visualLayer: !state.visualLayer };
    default:
      return state;
  }
}

export default map;
