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
 * This method helps to determine if the selected text is a valid scenario name
 * This method will throw error if user selects any line except Scenario or Scenario outline
 */
export const getScenarioName = () => {
	const selectedLine: any = vscode.window.activeTextEditor?.document.lineAt(
		vscode.window.activeTextEditor.selection.active.line
	).text;

	if (selectedLine?.includes('Scenario')) {
		return selectedLine
			.replace(/(Scenario:|Scenario Outline:)/, '')
			.replace(/^\s\s*/, '')
			.replace(/\s\s*$/, '');
	} else {
		vscode.window.showErrorMessage('Scenario Name incorrect. Please select Scenario or Scenario Outline');
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
};

/**
 * constructs the executable run configuration based scenario selected
 * @param debugConfig
 * @param scenarioName
 * @param featureFilePath
 */
export const generateExecutableScenarioConfiguration = (
	debugConfig: Configuration,
	scenarioName: string,
	featureFilePath: string
) => {
	switch (true) {
		case debugConfig.program.includes('protractor'):
			debugConfig.args.push('--cucumberOpts.name');
			debugConfig.args.push(scenarioName);
			return debugConfig;
		case debugConfig.program.includes('wdio.js'):
			debugConfig.args.push('--cucumberOpts.name');
			debugConfig.args.push(scenarioName);
			return debugConfig;
		case debugConfig.program.includes('cucumber-js'):
			debugConfig.args[0] = featureFilePath;
			debugConfig.args.push('--name');
			debugConfig.args.push(scenarioName);
			return debugConfig;
		default:
			vscode.window.showErrorMessage('un-supported tool used. Use only support Protractor,WebDriverIo and Cucumber-JS');
			throw new Error('un-supported tool used. Use only support Protractor, Cucumber and WebDriverIo');
	}
};
