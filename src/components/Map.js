import React from 'react';
import Fireman from './Fireman';
import { connect } from 'react-redux';
import { mapToStore, addFireman, setFiremanTarget, clientSelected } from './../actions';

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
    // Create map data
    let data;
    if(this.props.data) {
      data = JSON.parse(this.props.data);
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
    // Update map in the store
    this.mapToStore(this.props.x, this.props.y, data, temperature);
    // Set fire simulaiton interval
    let mapInterval = setInterval(() => {
      this.fireSimulation();
    }, 1000);
    this.setState({
      mapInterval,
    });
    // Add resize event
    window.addEventListener('resize', () => { this.forceUpdate(); });
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
    let temperature = this.props.store.temperature;
    // Add map element
    if(['WOOD', 'BRICK', 'ASPHALT'].includes(type)) {
      if(data[y][x] === type) {
        data[y][x] = null;
      } else {
        data[y][x] = type;
      }
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
      if('WOOD' === this.props.store.data[y][x]) {
        let distance = Math.sqrt(Math.pow(this.props.firemans[this.props.client.selectedId].position.x - x, 2) + Math.pow(this.props.firemans[this.props.client.selectedId].position.y - y, 2)) * this.state.blockSize;
        if(distance < 300) {
          this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Extinguish');
        } else {
          this.props.setFiremanTarget(this.props.client.selectedId, { x, y }, 'Toofar');
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
        // Map data
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
          default:
            type = 'Empty';
        }
        // Fire and smoke
        let fire;
        let smoke;
        let particles = [];
        for(var i = 1; i <= 4; i++) {
          particles.push(<div className="Particle" key={ i }></div>);
        }
        particles = <div className="Wrapper">{ particles }</div>;
        if(map.temperature[iy][ix] >= this.state.fireInit) {
          fire = <div className="Fire Ignite">{ particles }</div>;
        } else if(map.temperature[iy][ix] >= this.state.smokeInit) {
          fire = <div className="Fire">{ particles }</div>;
        }
        if(map.temperature[iy][ix] >= this.state.smokeInit && map.temperature[iy][ix] < this.state.fireInit) {
          smoke = <div className="Smoke">{ particles }</div>;
        } else if(map.temperature[iy][ix] >= this.state.fireInit || map.temperature[iy][ix] === -1) {
          smoke = <div className="Smoke Burnt">{ particles }</div>;
        }
        // Create block
        columns.push(
          <div
            className={ 'Column ' + type }
            onClick={ this.cordAction.bind(this, ix, iy, this.props.client.selected) }
            key={ ix }
          >
            { text }
            { fire }
            { smoke }
          </div>
        );
      }
      rows.push(<div className="Row" key={ iy }>{ columns }</div>);
    }
    return rows;
  }

  mapToStore = (x = null, y = null, data = null, temperature = null) => {
    // Update map in the store
    if(x === null) x = this.props.store.cords.x;
    if(y === null) y = this.props.store.cords.y;
    if(data === null) data = this.props.store.data;
    if(temperature === null) temperature = this.props.store.temperature;
    this.props.mapToStore(x, y, data, temperature);
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
    mapToStore: (x, y, data, temperature) => dispatch(mapToStore(x, y, data, temperature)),
    addFireman: (id, position) => dispatch(addFireman(id, position)),
    setFiremanTarget: (id, target, action) => dispatch(setFiremanTarget(id, target, action)),
    clientSelected: (selected, selectedId) => dispatch(clientSelected(selected, selectedId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
