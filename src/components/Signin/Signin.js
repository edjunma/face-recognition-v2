import React, { Component } from 'react';
import LoadingSpinner from '../LoadingSpinner/loadingspinner';
import ErrorMsg from '../ErrorMessage/errormessage';

class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			isLoading: false,
			displayError: false
		};
	}
	onEmailChange = event => {
		this.setState({ signInEmail: event.target.value });
	};

	onPasswordChange = event => {
		this.setState({ signInPassword: event.target.value });
	};

	handleKeyPress = event => {
		if (event.key === 'Enter') {
			this.onSubmitSignIn();
		}
	};

	onSubmitSignIn = () => {
		this.setState({ isLoading: true }, () => {
			fetch('https://polar-gorge-81355.herokuapp.com/signin', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.signInEmail,
					password: this.state.signInPassword
				})
			})
				.then(response => response.json())
				.then(data => {
					if (data.id) {
						this.props.loadUser(data);
						this.props.onRouteChange('home');
					} else {
						this.setState({ isLoading: false, displayError: true });
					}
				})
				.catch(err => {
					this.setState({ isLoading: false, displayError: true });
				});
		});
	};

	render() {
		const { onRouteChange } = this.props;
		return (
			<div>
				<div className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
					<main className='pa4 black-80'>
						<div className='measure'>
							<fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
								<legend className='f1 fw6 ph0 mh0'>Sign In</legend>
								<div className='mt3'>
									<label className='db fw6 lh-copy f6' htmlFor='email-address'>
										Email
									</label>
									<input
										onChange={this.onEmailChange}
										onKeyPress={this.handleKeyPress}
										className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
										type='email'
										name='email-address'
										id='email-address'
									/>
								</div>
								<div className='mv3'>
									<label className='db fw6 lh-copy f6' htmlFor='password'>
										Password
									</label>
									<input
										onChange={this.onPasswordChange}
										onKeyPress={this.handleKeyPress}
										className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
										type='password'
										name='password'
										id='password'
									/>
								</div>
							</fieldset>
							{this.state.isLoading ? (
								<LoadingSpinner />
							) : (
								<div>
									<div className=''>
										<input
											className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
											type='submit'
											value='Sign in'
											onClick={this.onSubmitSignIn}
										/>
									</div>
									<div className='lh-copy mt3'>
										<p
											onClick={() => onRouteChange('register')}
											className='f6 link dim black db pointer'
										>
											Register
										</p>
									</div>
								</div>
							)}
							{this.state.displayError ? <ErrorMsg /> : false}
						</div>
					</main>
				</div>
				<p style={{ fontSize: '1.2rem' }}>
					For testing purposes, please use test@gmail.com and test as email and password
					respectively or you can also Register
				</p>
			</div>
		);
	}
}

export default Signin;
