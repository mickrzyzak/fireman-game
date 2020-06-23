import React from 'react';
import Map from './Map';
import './../styles/app.scss';

function App() {
  return (
    <Map
      x="20"
      y="15"
      data='[["WOOD","WOOD","WOOD",null,null,null,"WOOD","WOOD",null,null,null,null,null,"WOOD","WOOD","WOOD",null,null,null,null],["WOOD","WOOD","WOOD",null,null,null,null,null,null,null,null,null,null,null,"WOOD","WOOD",null,null,"WOOD","WOOD"],[null,null,null,null,null,null,"WOOD","WOOD",null,"WOOD","WOOD",null,null,null,null,null,null,"WOOD","WOOD","WOOD"],[null,"WOOD","WOOD",null,null,"WOOD","WOOD","WOOD","ASPHALT","ASPHALT","ASPHALT",null,"WOOD","WOOD","WOOD",null,null,"WOOD","WOOD","WOOD"],[null,"WOOD","WOOD",null,null,"WOOD","WOOD","WOOD","ASPHALT","ASPHALT","ASPHALT",null,"WOOD","WOOD","WOOD",null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,"ASPHALT",null,"WOOD","WOOD","WOOD",null,null,null,"WOOD","WOOD"],[null,null,"WOOD","WOOD","WOOD",null,null,null,null,null,"ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","WOOD","WOOD"],[null,null,"WOOD","WOOD","WOOD","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","WOOD","WOOD",null,"WOOD","WOOD","WOOD",null,"WOOD","WOOD"],[null,null,null,"WOOD","WOOD",null,null,null,null,null,"ASPHALT","WOOD","WOOD",null,"WOOD","WOOD","WOOD",null,null,null],[null,null,null,null,null,null,null,null,null,null,"ASPHALT","WOOD","WOOD",null,null,null,null,null,null,null],[null,"WOOD","WOOD",null,"WOOD","WOOD","WOOD",null,null,null,"ASPHALT",null,null,null,null,"WOOD","WOOD","WOOD",null,null],[null,"WOOD","WOOD",null,"WOOD","WOOD","WOOD",null,null,null,"ASPHALT",null,null,null,null,"WOOD","WOOD","WOOD","WOOD",null],["ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT","ASPHALT"],[null,null,null,"WOOD","WOOD","WOOD",null,null,"WOOD","WOOD","WOOD",null,null,null,"WOOD","WOOD","WOOD","WOOD",null,null],[null,null,null,"WOOD","WOOD","WOOD",null,null,"WOOD","WOOD","WOOD",null,null,null,"WOOD","WOOD","WOOD","WOOD",null,null]]'
    />
  );
}

export default App;
