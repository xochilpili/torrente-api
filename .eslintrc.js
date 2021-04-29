const path = require('path');
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	ignorePatterns: ['dist/', 'lib/', 'tests/'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: [2, 'single', 'avoid-escape'],
		strict: [2, 'never'],
		semi: ['error', 'always'],
		'no-console': 2,
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-lerna': {
				packages: path.resolve(__dirname, 'src/packages'),
			},
		},
	},
};
