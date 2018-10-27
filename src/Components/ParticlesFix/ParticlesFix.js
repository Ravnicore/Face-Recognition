import React, { Component } from 'react';
import Particles from 'react-particles-js';


const particlesOptions = {
  particles: {
    number: {
      value: 180,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

class ParticlesFix extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      return false;
    }
    render() {
      return (
        <Particles className='particles'
          params={particlesOptions}
        />
      )
    }
}

export default ParticlesFix;