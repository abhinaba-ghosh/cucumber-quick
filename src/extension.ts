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

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(runScenarioDisposable);
	context.subscriptions.push(runFeatureDisposable);
}

const runScenarioDisposable = vscode.commands.registerCommand('execute.scenario', () => {
	const cucumberQuickObject = getCucumberQuickObject();
	const cucumberQuickScript: string = getCucumberQuickScript(cucumberQuickObject);
	const currentScenarioName: string = getScenarioName();
	const toolUsed: string = getCucumberQuickTool(cucumberQuickObject);
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName, toolUsed);
	executeCucumberQuickCommand(cucumberQuickScript, scenarioCommand);
});

const runFeatureDisposable = vscode.commands.registerCommand('execute.feature', () => {
	const cucumberQuickObject = getCucumberQuickObject();
	const cucumberQuickScript: string = getCucumberQuickScript(cucumberQuickObject);
	const featureCommand: string = createCommandToExecuteFeature(cucumberQuickObject);
	const toolUsed: string = getCucumberQuickTool(cucumberQuickObject);
	executeCucumberQuickCommand(cucumberQuickScript, featureCommand, toolUsed);
});

// This method is called when the extension is deactivated
export function deactivate() {}
