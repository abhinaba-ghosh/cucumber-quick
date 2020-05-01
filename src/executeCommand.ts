'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { commandOutput } from './extension';
const spawnCmd = require('spawn-command');
const treeKill = require('tree-kill');
let process: any = null;

// starts the process of executing command in vs code output window
export const startProcess = (command: string) => {
	// Already running one?
	if (process) {
		const msg = 'There is a command running right now. Terminate it before executing a new command?';
		vscode.window.showWarningMessage(msg, 'Ok', 'Cancel').then((choice: any) => {
			if (choice === 'Ok' && commandOutput) {
				killActiveProcess(commandOutput);
			}
		});
		return;
	}

	// Show log window
	commandOutput?.show();
	// clears the window before running a new command
	// commandOutput?.;
	commandOutput?.appendLine(`> Running command: ${command}`);

	runShellCommand(command, vscode.workspace.rootPath)
		.then(() => {
			commandOutput?.appendLine(`> Command finished successfully.`);
		})
		.catch((reason: any) => {
			commandOutput?.appendLine(`> ERROR: ${reason}`);
		});
};

// Tries to kill the active process that is running a command.
export const killActiveProcess = (commandOutput: vscode.OutputChannel) => {
	if (!process) return;

	commandOutput.appendLine(`> Killing PID ${process.pid}...`);
	treeKill(process.pid, 'SIGTERM', (err: any) => {
		if (err) {
			commandOutput.appendLine('> ERROR: Failed to kill process.');
		} else {
			commandOutput.appendLine('> Process killed.');
			process = null;
		}
	});
};

// prints command output
const printOutputDelegate = (data: any) => {
	commandOutput?.append(data.toString());
};

// runs the shell command in output window
const runShellCommand = (cmd: string, cwd: string | undefined) => {
	return new Promise((accept, reject) => {
		var opts: any = {};
		if (vscode.workspace) {
			opts.cwd = cwd;
		}

		process = spawnCmd(cmd, opts);
		process?.stdout.on('data', printOutputDelegate);
		process?.stderr.on('data', printOutputDelegate);
		process?.on('close', (status: any) => {
			if (status) {
				reject(`Command exited with status code ${status}.`);
			} else {
				accept();
			}
			process = null;
		});
	});
};
