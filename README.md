# Custom Property Analyzer

Custom Property Analyzer is a tool for gathering statistics and identifying errors in css custom properties.

## Table of Contents

1. [Installation and Usage](#installation-and-usage)
2. [Code of Conduct](#code-of-conduct)
3. [API](#api)
4. [Contributing](#contributing)
5. [Help](#help)

## <a name="installation-and-usage"></a>Installation and Usage

You can install using yarn or npm:

```
$ yarn add -D @shopify/custom-property-analyzer
```

```
$ npm install --save-dev @shopify/custom-property-analyzer
```

You can then run the executable:

```
$ ./node_modules/.bin/@shopify/custom-property-analyzer --pattern 'src/**/*.scss' -skip-errors true
```

## <a name="api"></a>API

### CLI options

| Option                         | Type                                      | Default      | Description                                                                                                                                                                               |
| ------------------------------ | ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -o, --output                   | string                                    |              | Output location.                                                                                                                                                                          |
| -e, --output-errors            | boolean                                   | true         | Include errors in output.                                                                                                                                                                 |
| -C, --output-custom-properties | boolean                                   | true         | Include custom properties in output.                                                                                                                                                      |
| -s, --output-stats             | boolean                                   | true         | Include stats in output.                                                                                                                                                                  |
| -i, --input                    | string                                    |              | Input directory for known custom properties. Expects an array of string.                                                                                                                  |
| -c, --custom-property-pattern  | string                                    |              | Regex to include custom properties.                                                                                                                                                       |
| -p, --pattern                  | string                                    | "\*_/_.css." | Glob pattern to find files                                                                                                                                                                |
| -l, --log-level                | "verbose" \| "info" \| "error" \| "never" | "verbose"    | Determines the errors displayed. `verbose` will display everything. `info` will display everything except errors. `error` will only display errors. And `never` will not display any logs |
| -S, --skip-errors              | boolean                                   | false        | Determines if error analysis will be executed.                                                                                                                                            |
| -v, --version                  |                                           |              | Output the current version                                                                                                                                                                |
| -h, --help                     |                                           |              | output usage information                                                                                                                                                                  |

### analyzeCustomProperties

```ts
// Default export
type AnalyzeCustomProperties = (
  options: Options,
) => Promise<[CustomPropertyMap, CustomPropertyMap, CustomPropertyStats]>;

interface Options {
  /**
   * List of properties that are expected to be found and used to filter properties that are found
   * @default []
   */
  knownCustomProperties?: string[];
  /**
   * Regular expression used to validate properties
   * @default undefined
   */
  customPropertyPattern?: string;
  /**
   * Glob pattern used to find files
   * css & scss files are supported
   * @default '**\/*.css.'
   */
  pattern?: string;
  /**
   * Determines the errors displayed. `verbose` will display everything. `info` will display everything except errors.
   * `error` will only display errors. And `never` will not display any logs
   * @default 'verbose'
   */
  logLevel?: LogLevel;
  /**
   * Determines if error analysis will be executed.
   * @default 'false'
   */
  skipErrors?: boolean;
}

interface CustomPropertyStats {
  uniqueCustomProperties: number;
  totalCustomProperties: number;
  fileCount: number;
}

interface InputStreamPosition {
  cursor: number;
  line: number;
  column: number;
}

interface Location {
  file: string;
  start: InputStreamPosition;
  end: InputStreamPosition;
}

interface CustomPropertyMap {
  [key: string]: {
    declaration: boolean;
    usedFromDeclaration: boolean;
    count: number;
    locations: Location[];
  };
}
```

## <a name="code-of-conduct"></a>Code of Conduct

Refer to the [Code of Conduct documentation](CODE_OF_CONDUCT.md).

## <a name="contributing"></a>Contributing

Refer to the [Contributing documentation](CONTRIBUTING.md).

### <a name="help"></a>Help

React out on slack or open an issue.
