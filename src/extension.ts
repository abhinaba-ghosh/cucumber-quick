import * as vscode from 'vscode';
import {
	getCucumberQuickObject,
	createCommandToExecuteFeature,
	executeCucumberQuickCommand,
	createCommandToExecuteScenario,
	getScenarioName,
	getCucumberQuickScript,
	getCucumberQuickTool,
} from './utils';
import { killActiveProcess } from './executeCommand';

export let commandOutput: vscode.OutputChannel | null = null;

export function activate(context: vscode.ExtensionContext) {
	commandOutput = vscode.window.createOutputChannel('CucumberQuickRunnerLog');
	context.subscriptions.push(commandOutput);
	context.subscriptions.push(runScenarioDisposable);
	context.subscriptions.push(runFeatureDisposable);
}

const runScenarioDisposable = vscode.commands.registerCommand('execute.scenario', () => {
	const cucumberQuickObject = getCucumberQuickObject();
	const cucumberQuickScript: string = getCucumberQuickScript(cucumberQuickObject);
	const currentScenarioName: string = getScenarioName();
	const toolUsed: string = getCucumberQuickTool(cucumberQuickObject);
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName, toolUsed);
	if (commandOutput) {
		executeCucumberQuickCommand(cucumberQuickScript, scenarioCommand, toolUsed);
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runFeatureDisposable = vscode.commands.registerCommand('execute.feature', () => {
	const cucumberQuickObject = getCucumberQuickObject();
	const cucumberQuickScript: string = getCucumberQuickScript(cucumberQuickObject);
	const featureCommand: string = createCommandToExecuteFeature(cucumberQuickObject);
	const toolUsed: string = getCucumberQuickTool(cucumberQuickObject);
	if (commandOutput) {
		executeCucumberQuickCommand(cucumberQuickScript, featureCommand, toolUsed);
	} else {
		logErrorIfOutputNotDefined();
	}
});

const logErrorIfOutputNotDefined = () => {
	vscode.window.showErrorMessage(
		`vs code output terminal not defined. Please ensure all required configuration. If npt solved, raise an issue here: https://github.com/abhinaba-ghosh/cucumber-quick/issues`
	);
	throw new Error('vs code output terminal not defined. Please ensure all required configuration.');
};
// This method is called when the extension is deactivated
export function deactivate() {
	if (commandOutput) {
		killActiveProcess(commandOutput);
	}
}
