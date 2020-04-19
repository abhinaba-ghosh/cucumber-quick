import * as vscode from 'vscode';

interface Configuration {
	type: string;
	request: string;
	name: string;
	protocol: string;
	program: string;
	stopOnEntry: false;
	cwd: string;
	args: string[];
	runtimeArgs: [];
	sourceMaps: true;
	smartStep: true;
	console: string;
}

/**
 * indemnify the absolute file path if user right click and selects 'Run Feature' option.
 *
 * throws error if feature file path is undefined
 */
export const getFeatureFilePath = (): string => {
	const currentlyOpenFeatureFilePath = vscode.window.activeTextEditor?.document.fileName;
	if (currentlyOpenFeatureFilePath) {
		return currentlyOpenFeatureFilePath;
	} else {
		vscode.window.showErrorMessage('Feature File Path undefined!');
		throw new Error('Feature File Path undefined!');
	}
};

/**
 * constructs the executable run configuration based on feature file path.
 * throws error if un-supported tool is used
 * @param debugConfig
 * @param featureFilePath
 */
export const generateExecutableFeatureConfiguration = (debugConfig: Configuration, featureFilePath: string) => {
	switch (true) {
		case debugConfig.program.includes('protractor'):
			debugConfig.args.push('--specs');
			debugConfig.args.push(`${featureFilePath}`);
			return debugConfig;
		case debugConfig.program.includes('wdio.js'):
			debugConfig.args.push('--spec');
			debugConfig.args.push(`${featureFilePath}`);
			return debugConfig;
		case debugConfig.program.includes('cucumber-js'):
			debugConfig.args.push(`${featureFilePath}`);
			return debugConfig;
		default:
			vscode.window.showErrorMessage('un-supported tool used. Use only support Protractor,WebDriverIo and Cucumber-JS');
			throw new Error('un-supported tool used. Use only support Protractor, Cucumber and WebDriverIo');
	}
};
