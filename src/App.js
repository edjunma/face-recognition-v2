import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ErrorImgMessage from './components/ErrorMessage/errorImageMessage';
import Rank from './components/Rank/Rank';
import './App.css';

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
	apiKey: '147046a299a541b4902c4001df6535a2'
});

const particlesOptions = {
	particles: {
		number: {
			value: 80,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
};

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
		joined: ''
	}
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
		};
	};

	loadUser = data => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined
			}
		});
	};

	calculateFaceLocation = data => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height
		};
	};

	displayFaceBox = box => {
		this.setState({ box: box });
	};

	onInputChange = event => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
    if(this.state.input){
        fetch('https://polar-gorge-81355.herokuapp.com/imgurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
      .then(response => response.json())
      .then(response => {
        if(response.status) {
          fetch('https://polar-gorge-81355.herokuapp.com/img', { //'https://polar-gorge-81355.herokuapp.com/img'
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
						.then(response => response.json())
						.then(count => {
							this.setState({displayError: false});
							this.setState(Object.assign(this.state.user, { entries: count }));
						})
						.catch(err => {
							this.setState({displayError: true});
						});
				} else {
					this.setState({displayError: true});
				}
				this.setState({displayError: false});
				this.displayFaceBox(this.calculateFaceLocation(response));
			})
			.catch(err => this.setState({displayError: true}))
		} else {
			this.setState({displayError: true});
		};
	}

	onRouteChange = route => {
		if (route === 'signout') {
			this.setState(initialState);
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	render() {
    const { route, isSignedIn, box, imageUrl, displayError } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
       { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onSubmit={this.onSubmit}
              />
                <FaceR box={box} imageUrl={imageUrl}/>
              { displayError 
              ? <ErrorImgMessage />
              : null
              }
            </div>
            : (
              route === 'signin' || route === 'signout'
              ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
