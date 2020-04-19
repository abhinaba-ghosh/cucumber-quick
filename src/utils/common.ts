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
 * this method reads the gherkin-easy-execution specific configuration from .vscode/launch.json file
 * gherkin-easy-execution configuration should be named as 'execute.gherkin'
 * this method throws error if the configuration is not found
 */
export const getExistingDebugConfiguration = () => {
	const executableConfiguration: Configuration = vscode.workspace
		.getConfiguration('launch')
		.configurations.find((config: Configuration) => config.name === 'execute.gherkin');

	if (executableConfiguration) {
		return executableConfiguration;
	} else {
		vscode.window.showErrorMessage('Executable configuration not found in launch.json');
		throw new Error('Executable configuration not found in launch.json');
	}
};

/**
 * this method deletes the run-time appended args in configuration
 * @param debugConfig
 */
export const decomposeExecutableScenarioConfiguration = (debugConfig: Configuration) => {
	debugConfig.args = removeArgs(debugConfig.args, 2);
	return debugConfig;
};

/**
 * this method helps to remove the args by native array.splice method
 * @param arr
 * @param n
 */
const removeArgs = (arr: any[], n: number) => {
	arr.splice(arr.length - n, arr.length);
	return arr;
};
