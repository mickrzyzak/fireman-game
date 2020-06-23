const firemans = (state = [], action) => {
  switch(action.type) {
    case 'addFireman':
      return [
        ...state,
        { id: action.id,
          position: { x: action.position.x, y: action.position.y },
          target: { x: action.position.x, y: action.position.y },
          orientation: 'Bottom',
          action: 'Idle',
        }
      ];
    case 'setFiremanTarget':
      state[action.id].target.x = action.target.x;
      state[action.id].target.y = action.target.y;
      state[action.id].action = action.action;
      if(action.action === 'Extinguish') {
        if(Math.abs(state[action.id].target.y - state[action.id].position.y) > Math.abs(state[action.id].target.x - state[action.id].position.x)) {
          if(state[action.id].target.y < state[action.id].position.y) state[action.id].orientation = 'Top';
          if(state[action.id].target.y > state[action.id].position.y) state[action.id].orientation = 'Bottom';
        } else {
          if(state[action.id].target.x < state[action.id].position.x) state[action.id].orientation = 'Left';
          if(state[action.id].target.x > state[action.id].position.x) state[action.id].orientation = 'Right';
        }
      }
      return state;
    case 'moveFireman':
      state[action.id].position.x = action.target.x;
      state[action.id].position.y = action.target.y;
      if(action.orientation) state[action.id].orientation = action.orientation;
      return state;
    default:
      return state;
  }
}

export default firemans;
