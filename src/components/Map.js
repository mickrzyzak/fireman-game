import React from 'react';
import Fireman from './Fireman';
import { connect } from 'react-redux';
import { mapToStore, visualLayerToggle, addFireman, setFiremanTarget, clientSelected, setDialogue } from './../actions';

class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fireInit: 80,
      smokeInit: 20,
      blockSize: 40,
    };
  }

  componentDidMount() {
    // Create or load map data
    let data, visual;
    if(this.props.data) {
      let json = JSON.parse(this.props.data);
      data = json[0];
      visual = json[1];
    } else {
      data = new Array(parseInt(this.props.y));
      for(let i = 0; i < data.length; i++) {
        data[i] = new Array(parseInt(this.props.x));
      }
    }
    // Create firemap data
    let temperature = new Array(parseInt(this.props.y));
    for(let i = 0; i < temperature.length; i++) {
      temperature[i] = new Array(parseInt(this.props.x));
      temperature[i].fill(0);
    }
    // Start the initial fire
    let firestarter = JSON.parse(this.props.firestarter);
    firestarter.map(block => {
      temperature[block.y][block.x] = this.state.fireInit;
      return 0;
    });

    // Update map in the store
    this.mapToStore(this.props.x, this.props.y, data, visual, temperature);
    // Set fire simulaiton interval
    let mapInterval = setInterval(() => {
      this.fireSimulation();
    }, 1000);
    this.setState({
      mapInterval,
    });
    // Add resize event
    window.addEventListener('resize', () => { this.forceUpdate(); });
    // Add keypress event
    window.addEventListener('keypress', (event) => { this.keyPress(event) });
  }

  keyPress = (event) => {
    // Vars
    let key = event.key;
    // Toggle visual layer
    if(key === 'v') {
      this.props.visualLayerToggle();
    }
  }

  fireSimulation = () => {
    // Game balance vars
    let heatingPower = 10;
    let selfHeatingPower = 5;
    let firehosePower = 35;
    // Other vars
    let somethingChange = false;
    let data = this.props.store.data;
    let temperature = this.props.store.temperature;
    // Fire simulation
    temperature.map((row, row_index) => {
      row.map((column, column_index) => {
        if(temperature[row_index][column_index] >= this.state.fireInit) {
          if(temperature[row_index][column_index] < 100) {
            temperature[row_index][column_index] = temperature[row_index][column_index] + selfHeatingPower;
            somethingChange = true;
          }
          if(column_index - 1 >= 0) if(data[row_index][column_index - 1] === 'WOOD'
          && (temperature[row_index][column_index - 1] + heatingPower) < 100) {
            temperature[row_index][column_index - 1] = temperature[row_index][column_index - 1] + heatingPower;
            somethingChange = true;
          }
          if(column_index + 1 < this.props.store.cords.x) if(data[row_index][column_index + 1] === 'WOOD'
          && (temperature[row_index][column_index + 1] + heatingPower) < 100) {
            temperature[row_index][column_index + 1] = temperature[row_index][column_index + 1] + heatingPower;
            somethingChange = true;
          }
          if(row_index - 1 >= 0) if(data[row_index - 1][column_index] === 'WOOD'
          && (temperature[row_index - 1][column_index] + heatingPower) < 100) {
            temperature[row_index - 1][column_index] = temperature[row_index - 1][column_index] + heatingPower;
            somethingChange = true;
          }
          if(row_index + 1 < this.props.store.cords.y) if(data[row_index + 1][column_index] === 'WOOD'
          && (temperature[row_index + 1][column_index] + heatingPower) < 100) {
            temperature[row_index + 1][column_index] = temperature[row_index + 1][column_index] + heatingPower;
            somethingChange = true;
          }
        }
        if(temperature[row_index][column_index] >= this.state.smokeInit
        && temperature[row_index][column_index] < this.state.fireInit) {
          temperature[row_index][column_index] = temperature[row_index][column_index] + selfHeatingPower;
          somethingChange = true;
        }
        if(temperature[row_index][column_index] < 0) {
          temperature[row_index][column_index] = 0;
        }
        if(temperature[row_index][column_index] > 100) {
          temperature[row_index][column_index] = 100;
        }
        return 0;
      });
      return 0;
    });
    // Extinction
    this.props.firemans.map((fireman) => {
      if(fireman.action === 'Extinguish' && temperature[fireman.target.y][fireman.target.x] > 0) {
        temperature[fireman.target.y][fireman.target.x] = temperature[fireman.target.y][fireman.target.x] - firehosePower;
        if(temperature[fireman.target.y][fireman.target.x] < this.state.smokeInit) {
          temperature[fireman.target.y][fireman.target.x] = -1;
        }
        somethingChange = true;
      }
      return 0;
    });
    // Update map in the store
    if(somethingChange) {
      this.mapToStore();
    }
  }

  cordAction = (x, y, type) => {
    if(type === null) return;
    // Vars
    let somethingChange = false;
    let data = this.props.store.data;
    let visual = this.props.store.visual;
    let temperature = this.props.store.temperature;
    // Set block type
    if(['WOOD', 'BRICK', 'ASPHALT', 'WATER'].includes(type)) {
      if(data[y][x] === type) {
        data[y][x] = null;
      } else {
        data[y][x] = type;
      }
      somethingChange = true;
    }
    // Add visual element
    if(['HYDRANT', 'BUSH', 'FLOWER'].includes(type)) {
      if(type === 'FLOWER') {
        type = type+'_'+(Math.floor(Math.random() * 2) + 1);
      }
      visual.push({ x, y, name: type });
      somethingChange = true;
    }
    // Remove visual element
    if('ERASE' === type) {
      visual.map((element, index) => {
        if(element.x === x && element.y === y) {
          visual.splice(index, 1);
        }
        return 0;
      });
      somethingChange = true;
    }
    // Ignite
    if('TORCH' === type) {
      if('WOOD' === this.props.store.data[y][x]) {
        temperature[y][x] = this.state.fireInit;
        somethingChange = true;
      }
    }
    // Add fireman
    if('ADD_FIREMAN' === type) {
      if(!['WOOD', 'BRICK'].includes(this.props.store.data[y][x])) {
        this.props.addFireman(this.props.firemans.length, { x, y });
      }
    }
    // Set target to fireman
    if('FIREMAN' === type) {
      let selectedFireman = this.props.firemans[this.props.client.selectedId];
      if('WOOD' === this.props.store.data[y][x]) {
        let distance = Math.sqrt(Math.pow(selectedFireman.position.x - x, 2) + Math.pow(selectedFireman.position.y - y, 2)) * this.state.blockSize;
        if(distance < 300 && selectedFireman.connection !== false) {
          this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Extinguish');
        } else if(selectedFireman.connection === false) {
          this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Idle');
          this.props.setDialogue(this.props.client.selectedId, 'Najpierw muszę podłączyć wąż.');
        } else if(distance >= 300) {
          this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Idle');
          this.props.setDialogue(this.props.client.selectedId, 'Zbyt daleko.');
        }
        this.props.clientSelected('FIREMAN', this.props.client.selectedId);
      } else if(!['WOOD', 'BRICK'].includes(this.props.store.data[y][x])) {
        this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Move');
        this.props.clientSelected(null);
      }
    }
    // Update map in the store
    if(somethingChange) {
      this.mapToStore();
    }
  }

  generateMapBody = () => {
    // Generate map html
    let map = this.props.store;
    let rows = [];
    for(let iy = 0; iy < map.cords.y; iy++) {
      let columns = [];
      for(let ix = 0; ix < map.cords.x; ix++) {
        // Grid
        let text;
        if(map.grid) {
          text = (map.data[iy][ix]) ? map.data[iy][ix] : ix + 'x' + iy;
        }
        // Block type
        let type;
        switch(map.data[iy][ix]) {
          case 'BRICK':
            type = 'Brick';
            break;
          case 'WOOD':
            type = 'Wood';
            break;
          case 'ASPHALT':
            type = 'Asphalt';
            break;
          case 'WATER':
            type = 'Water';
            break;
          default:
            type = 'Empty';
        }
        // Create block
        columns.push(
          <div
            className={ 'Block ' + type }
            onClick={ this.cordAction.bind(this, ix, iy, this.props.client.selected) }
            key={ ix }
          >
            { text }
          </div>
        );
      }
      rows.push(<div className="Row" key={ iy }>{ columns }</div>);
    }
    return rows;
  }

  generateFireLayer = () => {
    // Generate fire layer
    let map = this.props.store;
    let fireElements = [];
    let particles = [];
    for(var i = 1; i <= 4; i++) {
      particles.push(<div className="Particle" key={ i }></div>);
    }
    particles = <div className="Wrapper">{ particles }</div>;
    for(let iy = 0; iy < map.cords.y; iy++) {
      for(let ix = 0; ix < map.cords.x; ix++) {
        let fireClass, smokeClass;
        let positionX = ix * this.state.blockSize;
        let positionY = iy * this.state.blockSize;
        if(map.temperature[iy][ix] >= this.state.fireInit) {
          fireClass = 'Fire Ignite';
        } else if(map.temperature[iy][ix] >= this.state.smokeInit) {
          fireClass= 'Fire';
        }
        if(map.temperature[iy][ix] >= this.state.smokeInit && map.temperature[iy][ix] < this.state.fireInit) {
          smokeClass = 'Smoke';
        } else if(map.temperature[iy][ix] >= this.state.fireInit || map.temperature[iy][ix] === -1) {
          smokeClass = 'Smoke Burnt';
        }
        if(fireClass !== undefined) {
          fireElements.push(
            <div
              className={ fireClass }
              key={ 'Fire-' + ix + 'x' + iy }
              style={{
                top: positionY+'px',
                left: positionX+'px',
              }}
            >
              { particles }
            </div>
          );
        }
        if(smokeClass !== undefined) {
          fireElements.push(
            <div
              className={ smokeClass }
              key={ 'Smoke-' + ix + 'x' + iy }
              style={{
                top: positionY+'px',
                left: positionX+'px',
              }}
            >
              { particles }
            </div>
          );
        }
      }
    }
    return fireElements;
  }

  generateVisualLayer = () => {
    // Generate fire layer
    let map = this.props.store;
    let visualElements = [];
    map.visual.map((element, index) => {
      let positionX = element.x * this.state.blockSize;
      let positionY = element.y * this.state.blockSize;
      visualElements.push(
        <img
          className={ 'VisualElement ' + element.name.toLowerCase() }
          src={ require('../images/'+element.name.toLowerCase()+'.svg') }
          alt={ element.name }
          key={ index }
          style={{
            'top':  positionY+'px',
            'left': positionX+'px',
          }}
        />
      );
      return 0;
    });
    return visualElements;
  }

  mapToStore = (x = null, y = null, data = null, visual = null, temperature = null) => {
    // Update map in the store
    if(x === null) x = this.props.store.cords.x;
    if(y === null) y = this.props.store.cords.y;
    if(data === null) data = this.props.store.data;
    if(visual === null) visual = this.props.store.visual;
    if(temperature === null) temperature = this.props.store.temperature;
    this.props.mapToStore(x, y, data, visual, temperature);
  }

  render() {
    // Render firemans
    let firemans = [];
    this.props.firemans.map((obj, index) => {
      firemans.push(<Fireman id={ obj.id } key={ index } />);
      return 0;
    });
    // Render map
    if(window.innerWidth >= this.props.store.cords.x * this.state.blockSize + 120) {
      return <div id="Map" className="Map">
        { this.generateMapBody() }
        { (this.props.store.visualLayer) ? this.generateVisualLayer() : null }
        { this.generateFireLayer() }
        { firemans }
      </div>;
    } else {
      return <span>Rozdzielczość okna przegląarki jest zbyt mała.</span>;
    }
  }

}

const mapStateToProps = store => {
  return {
    store: store.map,
    client: store.client,
    firemans: store.firemans,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    mapToStore: (x, y, data, visual, temperature) => dispatch(mapToStore(x, y, data, visual, temperature)),
    visualLayerToggle: () => dispatch(visualLayerToggle()),
    addFireman: (id, position) => dispatch(addFireman(id, position)),
    setFiremanTarget: (id, target, action) => dispatch(setFiremanTarget(id, target, action)),
    clientSelected: (selected, selectedId) => dispatch(clientSelected(selected, selectedId)),
    setDialogue: (id, text) => dispatch(setDialogue(id, text)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
