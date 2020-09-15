const firemans = (state = [], action) => {
  switch(action.type) {
    case 'addFireman':
      return [
        ...state,
        {
          id: action.id,
          position: { x: action.position.x, y: action.position.y },
          target: { x: action.position.x, y: action.position.y },
          connection: false,
          orientation: 'Bottom',
          action: 'Idle',
          dialogue: { text: 'Gotów do służby!', timestamp: null },
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
    case 'setConnection':
      state[action.id].connection = action.connection;
      return state;
    case 'addConnectionPoint':
      if(typeof state[action.id].connection.way !== 'undefined') {
        if(state[action.id].connection.way.length > 0) {
          if(state[action.id].connection.way[state[action.id].connection.way.length - 1].x !== action.point.x
          || state[action.id].connection.way[state[action.id].connection.way.length - 1].y !== action.point.y) {
            state[action.id].connection.way.push(action.point);
          }
        } else {
          state[action.id].connection.way.push(action.point);
        }
      }
      return state;
    case 'setDialogue':
      state[action.id].dialogue = { text: action.text, timestamp: Date.now() };
      return state;
    default:
      return state;
  }
}

export default firemans;
