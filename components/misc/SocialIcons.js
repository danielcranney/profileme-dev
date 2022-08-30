import React from 'react';
import TwitterIcon from './TwitterIcon';
import GitHubIcon from './GitHubIcon';

export const SocialIcons = () => {
	return (
		<div className='flex items-center gap-x-1.5'>
			<GitHubIcon />
			<TwitterIcon />
		</div>
	);
};
