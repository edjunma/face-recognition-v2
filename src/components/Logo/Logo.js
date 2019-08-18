import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt
				className='Tilt br2 shadow-2'
				options={{ max: 50 }}
				style={{
					height: 150,
					width: 150,
					borderRadius: '50%',
					position: 'relative',
					top: '-50px',
					left: '15px'
				}}
			>
				<a href='https://github.com/edjunma/face-recognition-v2' alt='logo'>
					<div className='Tilt-inner pa3'>
						<img style={{ paddingTop: '25px' }} alt='logo' src={brain} />
					</div>
				</a>
			</Tilt>
			o
		</div>
	);
};

export default Logo;
