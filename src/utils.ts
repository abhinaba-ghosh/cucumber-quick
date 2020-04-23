import * as vscode from 'vscode';
import * as fs from 'fs';

const workspaceFolder: vscode.Uri | any = vscode.window.activeTextEditor?.document.uri;

interface CucumberQuickConfiguration {
	tool: string;
	script: string;
}

/**
 * Collect cucumber-quick configuration object from .vscode/settings.json
 */
export const getCucumberQuickObject = (): CucumberQuickConfiguration => {
	let quickConfiguration: CucumberQuickConfiguration | undefined = {
		tool: 'default',
		script: 'default',
	};
	console.log('workspaceFolder:', workspaceFolder);
	try {
		quickConfiguration = JSON.parse(
			fs.readFileSync(
				`${vscode.workspace.getWorkspaceFolder(workspaceFolder)?.uri.fsPath}/.vscode/settings.json`,
				'utf8'
			)
		)['cucumber-quick'];
	} catch (err) {
		quickConfiguration = undefined;
	}
	console.log('quickConfiguration:', quickConfiguration);

	if (quickConfiguration && quickConfiguration.tool !== 'default' && quickConfiguration.script !== 'default') {
		return quickConfiguration;
	} else {
		vscode.window.showErrorMessage('cucumber-quick configuration not found in .vscode/settings.json');
		throw new Error('cucumber-quick configuration not found in .vscode/settings.json');
	}
};

/**
 * get script information from cucumber.quick configuration
 * @param cucumberQuickConfig
 */
export const getCucumberQuickScript = (cucumberQuickConfig: CucumberQuickConfiguration): string =>
	cucumberQuickConfig.script;

/**
 * get tool information from cucumber.quick configuration
 * @param cucumberQuickConfig
 */
export const getCucumberQuickTool = (cucumberQuickConfig: CucumberQuickConfiguration): string =>
	cucumberQuickConfig.tool;

/**
 * execute the command in the active vscode terminal
 * @param script
 * @param command
 * @param tool
 */
export const executeCucumberQuickCommand = (script: string, command: string, tool?: string) => {
	const terminal = getActiveTerminal();
	terminal?.show();
	tool === 'cucumberjs' ? terminal?.sendText(`${command}`) : terminal?.sendText(`${script} ${command}`);
};

/**
 * create active terminal if not exists
 */
const getActiveTerminal = () => {
	return vscode.window.activeTerminal ? vscode.window.activeTerminal : vscode.window.createTerminal('cucumber-quick');
};

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
		vscode.window.showErrorMessage(
			`Incorrect line selected: ${selectedLine}.\n Please select Scenario or Scenario Outline`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
};

/**
 * create command needed for specific scenario execution
 * @param cucumberQuickConfiguration
 * @param scenarioName
 */
export const createCommandToExecuteScenario = (scenarioName: string, tool: string): string => {
	const toolCommands = new Map()
		.set('protractor', `--cucumberOpts.name="${scenarioName}"`)
		.set('webdriverio', `--cucumberOpts.name="${scenarioName}"`)
		// .set('cypress', `--cucumberOpts.name="${scenarioName}"`)
		.set('cucumberjs', `--name "${scenarioName}"`);

	console.log('toolCommands.get(tool):', toolCommands.get(tool));

	if (toolCommands.get(tool) === undefined) {
		vscode.window.showErrorMessage(
			`un-supported tool found: ${tool}.Cucumber-Quick configuration tool only accept: protractor/webdriverio/cypress/cucumberjs.`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
	return toolCommands.get(tool);
};

/**
 * create command needed for specific feature execution
 * @param cucumberQuickConfiguration
 */
export const createCommandToExecuteFeature = (cucumberQuickConfiguration: CucumberQuickConfiguration): string => {
	const currentFeatureFilePath: string | undefined = vscode.window.activeTextEditor?.document.uri.fsPath;

	const toolCommands = new Map()
		.set('protractor', `--specs="${currentFeatureFilePath}"`)
		.set('webdriverio', `--spec="${currentFeatureFilePath}"`)
		// .set('cypress', `run -e GLOB="${currentFeatureFilePath}"`)
		.set('cucumberjs', getCucumberJsFeatureExecutable(cucumberQuickConfiguration, currentFeatureFilePath));

	console.log('toolCommands.get(tool):', toolCommands.get(cucumberQuickConfiguration.tool));

	if (currentFeatureFilePath === undefined && toolCommands.get(cucumberQuickConfiguration.tool) === undefined) {
		vscode.window.showErrorMessage(
			`un-supported tool found: ${cucumberQuickConfiguration.tool}.Cucumber-Quick configuration tool only accept: protractor/webdriverio/cypress/cucumberjs.`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
	return toolCommands.get(cucumberQuickConfiguration.tool);
};

const getCucumberJsFeatureExecutable = (
	cucumberQuickConfiguration: CucumberQuickConfiguration,
	currentFeatureFilePath: string | undefined
) => {
	const splitter = cucumberQuickConfiguration.script.split(' ');
	splitter[1] = `"${currentFeatureFilePath}"`;
	return splitter.join(' ');
};
