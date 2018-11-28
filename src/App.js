import React, { Component } from 'react';
import ParticlesFix from './Components/ParticlesFix/ParticlesFix.js';
import Navigation from './Components/Navigation/Navigation.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import './App.css';

var myBoxes = [];
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  calculateFacesLocations = (data) => {
    myBoxes = [];
    for (let k=0; k < data.outputs[0].data.regions.length; k++){
      var clarifaiFace = data.outputs[0].data.regions[k].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      myBoxes.push(
        <div key={k} className='bounding-box' style={{
          top: clarifaiFace.top_row * height,
          right: width - (clarifaiFace.right_col * width),
          bottom: height - (clarifaiFace.bottom_row * height),
          left: clarifaiFace.left_col * width,
        }}>
        </div>
      )
    }
    this.setState({ box: {
       myBoxes 
      }
    })
  }




  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://shrouded-tundra-61121.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input,
          })
        })
    .then(response => response.json())
    .then(response => {
      if (response)  {
        fetch('https://shrouded-tundra-61121.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log)
      }
      this.calculateFacesLocations(response)
      })
    .catch(err => console.log(err)); 
  }

  onRouteChange = (route) => {
    if (route ==='signout') {
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <ParticlesFix />
        <Navigation isSignedIn={ isSignedIn } onRouteChange={this.onRouteChange}/>
        { route ==='home' 
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name} 
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition box = { box } imageUrl={ imageUrl }/>
            </div>
          : (
              this.state.route ==='signin'
              ? <SignIn 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange}
              />
              : <Register 
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange}
                />
            )
 
        }
      </div>
    );
  }
}

export default App;
