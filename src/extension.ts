import * as vscode from 'vscode';
import { generateExecutableScenarioConfiguration, getScenarioName } from './utils/scenario';
import { getExistingDebugConfiguration, decomposeExecutableScenarioConfiguration } from './utils/common';
import { generateExecutableFeatureConfiguration, getFeatureFilePath } from './utils/feature';

const workspaceFolder: any = vscode.window.activeTextEditor?.document.uri;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(runScenarioDisposable);
	context.subscriptions.push(runFeatureDisposable);
}

const runScenarioDisposable = vscode.commands.registerCommand('execute.scenario', async () => {
	vscode.debug
		.startDebugging(
			vscode.workspace.getWorkspaceFolder(workspaceFolder),
			generateExecutableScenarioConfiguration(getExistingDebugConfiguration(), getScenarioName(), getFeatureFilePath())
		)
		.then(
			() => {
				decomposeExecutableScenarioConfiguration(getExistingDebugConfiguration());
				vscode.window.showInformationMessage('Scenario execution started successfully');
			},
			(err) => {
				vscode.window.showInformationMessage('Error: ' + err.message);
			}
		);
});

const runFeatureDisposable = vscode.commands.registerCommand('execute.feature', async () => {
	vscode.debug
		.startDebugging(
			vscode.workspace.getWorkspaceFolder(workspaceFolder),
			generateExecutableFeatureConfiguration(getExistingDebugConfiguration(), getFeatureFilePath())
		)
		.then(
			() => {
				decomposeExecutableScenarioConfiguration(getExistingDebugConfiguration());
				vscode.window.showInformationMessage('Feature file execution started successfully');
			},
			(err) => {
				vscode.window.showInformationMessage('Error: ' + err.message);
			}
		);
});
