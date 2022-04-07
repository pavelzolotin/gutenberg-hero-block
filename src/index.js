import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType('block-test/hero-block', {
	title: __('Hero Block', 'block-test/hero-block'),
	description: __('Display hero block.', 'block-test/hero-block'),
	edit: Edit,
	save,
});
