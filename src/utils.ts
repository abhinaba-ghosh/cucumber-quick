import * as vscode from 'vscode';
import * as fs from 'fs';
import { startProcess } from './executeCommand';

const workspaceFolder: vscode.Uri | any = vscode.window.activeTextEditor?.document.uri;

interface CucumberQuickConfiguration {
	tool: string;
	script: string;
}

/**
 * Collect cucumber-quick configuration object from .vscode/settings.json
 */
export const getCucumberQuickObject = (): CucumberQuickConfiguration => {
	let quickConfiguration: CucumberQuickConfiguration;
	console.log('workspaceFolder:', vscode.workspace.getWorkspaceFolder(workspaceFolder));
	try {
		quickConfiguration = JSON.parse(
			fs.readFileSync(
				`${vscode.workspace.getWorkspaceFolder(workspaceFolder)?.uri.fsPath}/.vscode/settings.json`,
				'utf8'
			)
		)['cucumber-quick'];
	} catch (err) {
		vscode.window.showErrorMessage('unable to read cucumber-quick configuration', err);
		throw new Error(err);
	}

	if (quickConfiguration) {
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
	// const terminal = getActiveTerminal();
	// terminal?.show();
	const executableCommand: string = tool === 'cucumberjs' ? `${command}` : `${script} ${command}`;

	if (tool === 'cypress') {
		const terminal = getActiveTerminal();
		terminal?.show();
		terminal.sendText('clear');
		terminal.sendText(executableCommand);
	} else {
		startProcess(executableCommand);
	}
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
	const selectedLine: string | undefined = vscode.window.activeTextEditor?.document.lineAt(
		vscode.window.activeTextEditor.selection.active.line
	).text;
	console.log('selectedLine:', selectedLine);

	if (selectedLine?.includes('Scenario')) {
		return selectedLine
			.replace(/(Scenario:|Scenario Outline:)/, '')
			.replace(/^\s\s*/, '')
			.replace(/\s\s*$/, '');
	} else if (selectedLine?.includes('@')) {
		return selectedLine.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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
	if (tool === 'cypress' && !scenarioName.includes('@')) {
		vscode.window.showErrorMessage(
			`Cypress cucumber preprocessor does not support running scenario by scenario name. Right click on the Tags and press 'Run Cucumber Scenario'`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
	const toolCommands: Map<any, any> = new Map()
		.set('protractor', `--cucumberOpts.name="${scenarioName}"`)
		.set('webdriverio', `--cucumberOpts.name="${scenarioName}"`)
		.set('cypress', `run -e TAGS="${scenarioName.split(/(\s+)/)[0]}"`)
		.set('cucumberjs', `--name "${scenarioName}"`);

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
	const currentRootFolderName: string | undefined = vscode.workspace.getWorkspaceFolder(workspaceFolder)?.name;

	const toolCommands = new Map()
		.set('protractor', `--specs="${currentFeatureFilePath}"`)
		.set('webdriverio', `--spec="${currentFeatureFilePath}"`)
		.set(
			'cypress',
			`run -e GLOB="${currentFeatureFilePath?.replace(new RegExp('.*' + currentRootFolderName), '').substr(1)}"`
		)
		.set('cucumberjs', getCucumberJsFeatureExecutable(cucumberQuickConfiguration, currentFeatureFilePath));

	// console.log('toolCommands.get(tool):', toolCommands.get(cucumberQuickConfiguration.tool));

	if (currentFeatureFilePath === undefined && toolCommands.get(cucumberQuickConfiguration.tool) === undefined) {
		vscode.window.showErrorMessage(
			`un-supported tool found: ${cucumberQuickConfiguration.tool}.Cucumber-Quick configuration tool only accept: protractor/webdriverio/cypress/cucumberjs.`
		);
		throw new Error('Scenario Name incorrect. Please select scenario');
	}
	return toolCommands.get(cucumberQuickConfiguration.tool);
};

/**
 *
 * @param cucumberQuickConfiguration
 * @param currentFeatureFilePath
 */
const getCucumberJsFeatureExecutable = (
	cucumberQuickConfiguration: CucumberQuickConfiguration,
	currentFeatureFilePath: string | undefined
) => {
	const splitter = cucumberQuickConfiguration.script.split(' ');
	splitter[1] = `"${currentFeatureFilePath}"`;
	return splitter.join(' ');
};
