import React from 'react';
import { connect } from 'react-redux';
import { clientSelected, moveFireman, setFiremanTarget } from './../actions';
import { firemanLeftSprite, firemanBottomSprite, firemanTopSprite } from './../sprites';

class Fireman extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      blockSize: 40,
      fireman: this.props.firemans[this.props.id],
      iteration: 0,
      wayEndPoint: { x: null, y: null },
      mapGrid: null,
    };
  }

  componentDidUpdate() {
    // Moving interval
    if(this.state.fireman.action === 'Move') {
      if(this.state.fireman.position.x !== this.state.fireman.target.x
        || this.state.fireman.position.y !== this.state.fireman.target.y) {
        if(!this.state.firemanMoveInterval
          || this.state.wayEndPoint.x !== this.state.fireman.target.x
          || this.state.wayEndPoint.y !== this.state.fireman.target.y) {
          this.findTheWay();
          clearInterval(this.state.firemanMoveInterval);
          let firemanMoveInterval = setInterval(() => {
            this.followTheWay();
          }, 500);
          this.setState({
            firemanMoveInterval,
          });
        }
      }
    }
  }

  followTheWay = () => {
    // End of way
    if((this.state.firemanMoveInterval
      && this.state.fireman.position.x === this.state.fireman.target.x
      && this.state.fireman.position.y === this.state.fireman.target.y)
      || this.state.fireman.action === 'Extinguish') {
      clearInterval(this.state.firemanMoveInterval);
      this.setState({
        firemanMoveInterval: null,
      });
      if(this.state.fireman.action === 'Move') {
        this.props.setFiremanTarget(this.state.fireman.id, this.state.fireman.position, 'Idle');
        this.forceUpdate();
      }
      return 0;
    }
    // Vars
    let map = this.props.store;
    let mapGrid = this.state.mapGrid;
    let orientation;
    let moveTo;
    let lowestDistance = 999999;
    // Search next step
    if(this.state.iteration > 0) {
      for(let iy = 0; iy < map.cords.y; iy++) {
        for(let ix = 0; ix < map.cords.x; ix++) {
          if(mapGrid[iy][ix] === this.state.iteration - 1
            && (Math.abs(ix - this.state.fireman.position.x) + Math.abs(iy - this.state.fireman.position.y)) <= 1) {
              let distance = Math.sqrt(Math.pow(ix - this.state.fireman.target.x, 2) + Math.pow(iy - this.state.fireman.target.y, 2));
              if(distance < lowestDistance) {
                lowestDistance = distance;
                moveTo = { x: ix, y: iy };
              }
          }
        }
      }
      // Set orientation
      if(moveTo.x < this.state.fireman.position.x) orientation = 'Left';
      if(moveTo.x > this.state.fireman.position.x) orientation = 'Right';
      if(moveTo.y < this.state.fireman.position.y) orientation = 'Top';
      if(moveTo.y > this.state.fireman.position.y) orientation = 'Bottom';
      this.props.moveFireman(
        this.state.fireman.id,
        moveTo,
        orientation,
      );
      this.setState({
        iteration: this.state.iteration - 1,
      });
    } else if(this.state.iteration === -1) {
      this.props.setFiremanTarget(this.state.fireman.id, this.state.fireman.position, 'Noway');
    }
  }

  findTheWay = () => {
    // Vars
    let map = this.props.store;
    let iteration = 0;
    let found = false;
    let blockIgnore = ['WOOD', 'BRICK'];
    // Generate temporary grid
    let mapGrid = new Array(parseInt(map.cords.y));
    for(let i = 0; i < mapGrid.length; i++) {
      mapGrid[i] = new Array(parseInt(map.cords.x));
    }
    mapGrid[this.state.fireman.target.y][this.state.fireman.target.x] = 0;
    // Find a way to target
    while(!found) {
      for(let iy = 0; iy < map.cords.y; iy++) {
        for(let ix = 0; ix < map.cords.x; ix++) {
          if(mapGrid[iy][ix] === iteration) {
            if(iy - 1 >= 0 && typeof mapGrid[iy - 1][ix] === 'undefined' && !blockIgnore.includes(map.data[iy - 1][ix])) {
              mapGrid[iy - 1][ix] = iteration + 1;
              if(iy - 1 === this.state.fireman.position.y && ix === this.state.fireman.position.x) found = true;
            }
            if(iy + 1 < map.cords.y && typeof mapGrid[iy + 1][ix] === 'undefined' && !blockIgnore.includes(map.data[iy + 1][ix])) {
              mapGrid[iy + 1][ix] = iteration + 1;
              if(iy + 1 === this.state.fireman.position.y && ix === this.state.fireman.position.x) found = true;
            }
            if(ix - 1 >= 0 && typeof mapGrid[iy][ix - 1] === 'undefined' && !blockIgnore.includes(map.data[iy][ix - 1])) {
              mapGrid[iy][ix - 1] = iteration + 1;
              if(iy === this.state.fireman.position.y && ix - 1 === this.state.fireman.position.x) found = true;
            }
            if(ix + 1 < map.cords.x && typeof mapGrid[iy][ix + 1] === 'undefined' && !blockIgnore.includes(map.data[iy][ix + 1])) {
              mapGrid[iy][ix + 1] = iteration + 1;
              if(iy === this.state.fireman.position.y && ix + 1 === this.state.fireman.position.x) found = true;
            }
          }
        }
      }
      iteration++;
      // Endless loop protection
      if(iteration > 1000)  {
        found = true;
        iteration = -1;
      }
    }
    this.setState({
      iteration,
      mapGrid,
      wayEndPoint: { x: this.state.fireman.target.x, y: this.state.fireman.target.y },
    }, () => {
      this.followTheWay();
    });
  }

  render() {
    // Set fireman orientation and action
    let className = (this.props.id === this.props.client.selectedId && this.props.client.selected === 'FIREMAN') ? 'Fireman Selected' : 'Fireman';
    if(this.state.fireman.orientation) className += ' ' + this.state.fireman.orientation;
    if(this.state.fireman.action) className += ' ' + this.state.fireman.action;
    // Set fireman sprite
    let firemanSprite;
    if(this.state.fireman.orientation === 'Left' || this.state.fireman.orientation === 'Right') firemanSprite = firemanLeftSprite;
    if(this.state.fireman.orientation === 'Top') firemanSprite = firemanTopSprite;
    if(this.state.fireman.orientation === 'Bottom') firemanSprite = firemanBottomSprite;
    // Water stream
    let positionX = this.state.fireman.position.x * this.state.blockSize;
    let positionY = this.state.fireman.position.y * this.state.blockSize;
    let radian = Math.atan2(this.state.fireman.target.x - this.state.fireman.position.x, this.state.fireman.target.y - this.state.fireman.position.y);
    let rotation = radian * (180 / Math.PI) * -1;
    let length = Math.sqrt(Math.pow(this.state.fireman.target.x - this.state.fireman.position.x, 2) + Math.pow(this.state.fireman.target.y - this.state.fireman.position.y, 2)) * this.state.blockSize;
    let visible = (this.state.fireman.action === 'Extinguish') ? ' Visible' : '';
    let waterStream = <div
      className={ 'WaterStream' + visible }
      style={{
        top: positionY+'px',
        left: positionX+'px',
        transform: 'translateY('+(this.state.blockSize / 2)+'px) rotateZ('+rotation+'deg)',
        height: length+'px',
      }}
    >
      <div className="Wrapper">
        <div className="Particles"></div>
      </div>
    </div>;
    // Render fireman
    return <>
      { waterStream }
      <div
        className={ className }
        style={{
          left: this.state.fireman.position.x * this.state.blockSize,
          top: this.state.fireman.position.y * this.state.blockSize,
        }}
        key={ this.state.fireman.id }
        onClick={ () => { this.props.clientSelected('FIREMAN', this.state.fireman.id) } }
      >
        <div className="Wrapper">
          { firemanSprite }
        </div>
      </div>
    </>;
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
    clientSelected: (selected, selectedId) => dispatch(clientSelected(selected, selectedId)),
    moveFireman: (id, target, orientation) => dispatch(moveFireman(id, target, orientation)),
    setFiremanTarget: (id, target, action) => dispatch(setFiremanTarget(id, target, action)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fireman);
