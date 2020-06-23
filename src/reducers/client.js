const client = (state = { selected: 'ADD_FIREMAN', selectedId: null }, action) => {
  switch(action.type) {
    case 'clientSelected':
      return { ...state, selected: action.selected, selectedId: action.selectedId };
    default:
      return state;
  }
}

export default client;
