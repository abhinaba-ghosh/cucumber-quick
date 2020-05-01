# Cucumber Quick

Cucumber-Quick helps you to run cucumber scenario and features directly from vscode editor. You can simply right click on any feature file and choose the option from the context menu to run a specific scenario or the whole feature file.

## Supported Tools

Currently we support:

- Protractor Cucumber
- WebDriverIo Cucumber
- Cypress Cucumber Pre-processor
- Native CucumberJS
- Serenity-JS

## Setup Run Configuration

The extension needs to understand what tool you are using and what ae the different parameters specific to your test execution. Follow the steps below:

1. create settings.json file under .vscode folder (ignore if already created)
2. create cucumber-quick option for the specific tool you are using. The configuration structure is shown below:

```ts
// .vscode > settings.json

{
  // rest of the configuration
  "cucumber-quick": {
		"tool": "tool-name", // supported- protrator/webdriverio/cypress/cucumberjs
		"script": "npx tool-name relative-path/to/configurations" // the script you naturally run to kick-start the execution
	}
}


```

#### Protractor-Cucumber/ SerenityJS Configuration

```ts
// .vscode > settings.json

{
  "cucumber-quick": {
		"tool": "protractor",
		"script": "npx protractor relative-path/to/protractor.conf.js"
	}
}

```

#### WebDriverIO Configuration

- Make sure the WebDriverIO-cucumber setup uses wdio-test-runner, that means, it should have cucumberOpts enabled. Remember, the cucumber-boilerplate provided by WebDriverIO uses yadda as cucumber framework. In that case, this extension will not work. But once you switch to wdio-test-runner, this extension will work like magic!

```ts
// .vscode > settings.json

{
  "cucumber-quick": {
		"tool": "webdriverio",
		"script": "npx wdio relative-path/to/wdio.conf.js"
	}
}

```

#### Cypress-Cucumber-Preprocessor Configuration

- Cypress cucumber preprocessor currently support ruining specific features. Running specific scenario by scenario name is still not supported by cypress-cucumber-preprocessor. It supports to run specific scenario by TAGS. You need to right-click on the Tags name in this case.

- Cucumber-Quick only support Cypress-Cucumber-Preprocessor V 2.1.0 or higher.

- For other tools, execution happens in VSCode Output terminal, but for Cypress, execution happens in Integrated terminal.

```ts
// .vscode > settings.json
{
	"cucumber-quick": {
		"tool": "cypress",
		"script": "npx cypress-tags"
	}
}


```

#### Native Cucumber-JS Configuration

> Note that: in scripts section, place the all features location as shown in the example configuration below:

```ts
// .vscode > settings.json

{
	"cucumber-quick": {
    "tool": "cucumberjs",
    "script": "npx cucumber-js relative-path/to/**/*.feature --require relative-path/to/**/*.js"
  }
}

```

## Run Scenarios and Features

- Navigate to a specific .feature file
- Right click on any scenario name/ scenario outline name
- You can choose two options from the context menu - _Run Cucumber Scenario_ and _Run Cucumber Feature_
- If _Run Scenario_ is selected, only that specific scenario will be executed
- If _Run Feature_ is selected, the complete feature file will be executed
- The test execution will be performed in debug mode, so if can debug certain codes using breakpoints as well.

## Log Issues

Log your issues and feature request [here](https://github.com/abhinaba-ghosh/cucumber-quick/issues)

#### Thank you

If this plugin was helpful for you, you can give it a ★ Star on [GitHub](https://github.com/abhinaba-ghosh/cucumber-quick)

_Copyright &copy; 2020- [Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)_
