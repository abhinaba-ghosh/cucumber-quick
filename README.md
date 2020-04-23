# Cucumber Quick

Cucumber-Quick helps you to run cucumber scenario and features directly from vscode editor. You can simply right click on any feature file and choose the option from the context menu to run a specific scenario or the whole feature file.

## Supported Tools

Currently we support:

- Protractor Cucumber
- WendDriverIo Cucumber
- Native CucumberJS
- Serenity-JS

## Next Release Candidate:

- Add support for Cypress-Cucumber

## Setup Run Configuration

The extension needs to understand what tool you are using and what ae the different parameters specific to your test execution. Follow the steps below:

1. create settings.json file under .vscode folder (ignore if already created)
2. create cucumber-quick option for the specific tool you are using

#### Protractor-Cucumber/ SerenityJS Configuration

```ts
// .vscode > settings.json

{
  // rest of the configuration
  "cucumber-quick": {
		"tool": "protractor",
		"script": "./node_modules/.bin/protractor protractor.conf.js"
	}
}

```

#### WebDriverIO Configuration

> Make sure the WebDriverIO-cucumber setup uses wdio-test-runner, that means, it should have cucumberOpts enabled. Remember, the cucumber-boilerplate provided by WebDriverIO uses yadda as cucumber framework. In that case, this extension will not work. But once you switch to wdio-test-runner, this extension will work like magic!

```ts
// .vscode > settings.json

{
  // rest of the configuration
  "cucumber-quick": {
		"tool": "webdriverio",
		"script": "./node_modules/.bin/wdio wdio.conf.js"
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
    "script": "./node_modules/.bin/cucumber-js test/**/*.feature --require test/**/*.js"
  }
}

```

## Run Scenarios and Features

- Navigate to a specific .feature file
- right click on any scenario name/ scenario outline name
- You can choose two options from the context menu - _Run Scenario_ and _Run Feature_
- If _Run Scenario_ is selected, only that specific scenario will be executed
- If _Run Feature_ is selected, the complete feature file will be executed
- The test execution will be performed in Integrated Terminal.

## Log Issues

Log your issues and feature request [here](https://github.com/abhinaba-ghosh/cucumber-quick/issues)

#### Thank you

If this plugin was helpful for you, you can give it a ★ Star on [GitHub](https://github.com/abhinaba-ghosh/cucumber-quick)

_Copyright &copy; 2020- [Abhinaba Ghosh](https://www.linkedin.com/in/abhinaba-ghosh-9a2ab8a0/)_
