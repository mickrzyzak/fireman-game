import React from 'react';
import { connect } from 'react-redux';
import { gridToggle, clientSelected } from './../actions';
import './../styles/console.scss';

class Console extends React.Component {

  action = (string) => {
    switch(string) {
      case '/grid':
        this.props.gridToggle();
        break;
      case '/savemap':
        let mapJSON = JSON.stringify([this.props.store.map.data, this.props.store.map.visual]);
        prompt('Map code', mapJSON);
        break;
      case '/select':
        this.props.clientSelected(null);
        break;
      case '/select wood':
        this.props.clientSelected('WOOD');
        break;
      case '/select brick':
        this.props.clientSelected('BRICK');
        break;
      case '/select asphalt':
        this.props.clientSelected('ASPHALT');
        break;
      case '/select water':
        this.props.clientSelected('WATER');
        break;
      case '/select torch':
        this.props.clientSelected('TORCH');
        break;
      case '/select add-fireman':
        this.props.clientSelected('ADD_FIREMAN');
        break;
      case '/select hydrant':
        this.props.clientSelected('HYDRANT');
        break;
      case '/select bush':
        this.props.clientSelected('BUSH');
        break;
      case '/select flower':
        this.props.clientSelected('FLOWER');
        break;
      case '/select tree':
        this.props.clientSelected('TREE');
        break;
      case '/select erase':
        this.props.clientSelected('ERASE');
        break;
      default:
        return 0;
    }
  }

  keyPress = (event) => {
    if(event.key === 'Enter') {
      this.action(event.target.value);
      event.target.value = '';
    }
  }

  render() {
    let console;
    let version;
    if(this.props.devMode) {
      console = <div className="Console">
        <input
          type="text"
          placeholder="Konsola..."
          onKeyPress={ this.keyPress }
        />
      </div>;
      version = <div className="Version">Tryb developerski<br />Wersja: { this.props.version }</div>;
    }
    return <>
      { console }
      { version }
    </>;
  }

}

const consoleStateToProps = store => {
  return {
    store: store,
  }
}

const consoleDispatchToProps = dispatch => {
  return {
    gridToggle: () => dispatch(gridToggle()),
    clientSelected: (selected) => dispatch(clientSelected(selected)),
  }
}

export default connect(consoleStateToProps, consoleDispatchToProps)(Console);
