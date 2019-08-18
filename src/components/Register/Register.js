import React, { Component } from 'react';
import LoadingSpinner from '../LoadingSpinner/loadingspinner';
import ErrorRegisterMessage from '../ErrorMessage/errorRegisterMessage';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: '',
			isLoading: false,
			displayError: false,
			invalidEmail: false
		};
	}

	onNameChange = event => {
		this.setState({ name: event.target.value });
	};

	onEmailChange = event => {
		this.setState({ email: event.target.value });
	};

	onPasswordChange = event => {
		this.setState({ password: event.target.value });
	};

	handleKeyPress = event => {
		if (event.key === 'Enter') {
			this.onSubmitSignIn();
		}
	};

	onSubmitSignIn = () => {
		this.setState({ isLoading: true }, () => {
			fetch('https://aqueous-crag-33852.herokuapp.com/register', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
					name: this.state.name
				})
			})
				.then(response => response.json())
				.then(user => {
					if (user.id) {
						this.props.loadUser(user);
						this.props.onRouteChange('home');
					} else {
						if (user === 'incorrect form submission') {
							this.setState({ displayError: true, invalidEmail: false });
						} else {
							this.setState({ invalidEmail: true, displayError: false });
						}
						this.setState({ isLoading: false });
					}
				});
		});
	};

	render() {
		return (
			<article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
				<main className='pa4 black-80'>
					<div className='measure'>
						<fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
							<legend className='f1 fw6 ph0 mh0'>Register</legend>
							<div className='mt3'>
								<label className='db fw6 lh-copy f6' htmlFor='name'>
									Name
								</label>
								<input
									className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
									type='text'
									name='name'
									id='name'
									onChange={this.onNameChange}
									onKeyPress={this.handleKeyPress}
								/>
							</div>
							<div className='mt3'>
								<label className='db fw6 lh-copy f6' htmlFor='email-address'>
									Email
								</label>
								<input
									className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
									type='email'
									name='email-address'
									id='email-address'
									onChange={this.onEmailChange}
									onKeyPress={this.handleKeyPress}
								/>
							</div>
							<div className='mv3'>
								<label className='db fw6 lh-copy f6' htmlFor='password'>
									Password
								</label>
								<input
									className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
									type='password'
									name='password'
									id='password'
									onChange={this.onPasswordChange}
									onKeyPress={this.handleKeyPress}
								/>
							</div>
						</fieldset>
						<div className=''>
							{this.state.isLoading ? (
								<LoadingSpinner />
							) : (
								<input
									className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
									type='submit'
									value='Register'
									onClick={this.onSubmitSignIn}
									onKeyPress={this.handleKeyPress}
								/>
							)}
							{this.state.displayError ? <ErrorRegisterMessage /> : false}
							{this.state.invalidEmail ? (
								<div style={{ fontSize: '1rem', color: 'red' }}>
									<p>Unable to register</p>
								</div>
							) : (
								false
							)}
						</div>
					</div>
				</main>
			</article>
		);
	}
}

export default Register;
