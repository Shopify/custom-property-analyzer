import glob from 'glob';
import chalk from 'chalk';

import {VarParser, BaseLocation, CustomProperty} from './parser';

interface ONCheck {
  [key: string]: boolean;
}

interface Location {
  file: string;
  start: BaseLocation;
  end: BaseLocation;
}

interface CustomPropertyMetaData extends Location {
  value: string;
  declaration: boolean;
}

interface CustomPropertyStats {
  uniqueCustomProperties: number;
  totalCustomProperties: number;
  fileCount: number;
}

interface CustomPropertyMap {
  [key: string]: {
    declaration: boolean;
    usedFromDeclaration: boolean;
    count: number;
    locations: Location[];
  };
}

type PartialIndex<T, F extends string> = {
  [K in keyof T]: Omit<T[K], F>;
};

type TableCustomProperty = PartialIndex<CustomPropertyMap, 'locations'>;

type LogLevel = 'verbose' | 'info' | 'error' | 'never';

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
   * Determines the errors displayed. `verbose` will display everything. `info` will display everything except errors. `error` will only display errors. And `never` will not display any logs
   * @default 'verbose'
   */
  logLevel?: LogLevel;
  /**
   * Determines if error analysis will be executed.
   * @default 'false'
   */
  skipErrors?: boolean;
  /**
   * A glob pattern or array of glob patterns to exclude matches.
   */
  ignore?: string | string[];
}

export function analyzeCustomProperties({
  pattern = '**/*.css',
  customPropertyPattern,
  knownCustomProperties = [],
  logLevel = 'verbose',
  skipErrors = false,
  ignore,
}: Options): Promise<
  [CustomPropertyMap, CustomPropertyMap, CustomPropertyStats]
> {
  return new Promise((resolve, reject) => {
    const ignorePattern =
      ignore &&
      typeof ignore === 'string' &&
      ignore.startsWith('[') &&
      ignore.endsWith(']')
        ? JSON.parse(ignore)
        : ignore;
    glob(pattern, {ignore: ignorePattern}, function(err, files) {
      if (err) reject(err);
      const customProperties: CustomPropertyMap = {};
      const customPropertyDeclarations: ONCheck = {};
      const customPropertyStats: CustomPropertyStats = {
        uniqueCustomProperties: 0,
        totalCustomProperties: 0,
        fileCount: files.length,
      };

      const customPropertiesPromises: ReturnType<VarParser['walk']>[] = [];
      for (const file of files) {
        customPropertiesPromises.push(new VarParser(file).walk());
      }

      Promise.all(customPropertiesPromises)
        .then((properties) => {
          const flattenedProperties = ([] as CustomProperty[]).concat(
            ...properties,
          );

          for (const property of flattenedProperties) {
            addCustomProperty(
              property,
              customPropertyPattern,
              customProperties,
              customPropertyDeclarations,
              customPropertyStats,
            );
          }

          const customPropertyErrors: CustomPropertyMap = {};
          for (const property in customProperties) {
            if (
              !Object.prototype.hasOwnProperty.call(customProperties, property)
            ) {
              continue;
            }
            if (
              !customProperties[property].declaration &&
              customPropertyDeclarations[property]
            ) {
              customProperties[property].usedFromDeclaration = true;
            }

            if (
              !customProperties[property].declaration &&
              !customProperties[property].usedFromDeclaration &&
              !knownCustomProperties.includes(property) &&
              !skipErrors
            ) {
              customPropertyErrors[property] = customProperties[property];
            }
          }

          handleMessage(
            customProperties,
            customPropertyErrors,
            customPropertyStats,
            logLevel,
          );

          resolve([
            customProperties,
            customPropertyErrors,
            customPropertyStats,
          ]);
        })
        .catch(reject);
    });
  });
}

export function handleMessage(
  customProperties: CustomPropertyMap,
  customPropertyErrors: CustomPropertyMap,
  customPropertyStats: CustomPropertyStats,
  logLevel: LogLevel,
) {
  if (logLevel === 'never') return;
  if (logLevel === 'verbose' || logLevel === 'error') {
    for (const property in customPropertyErrors) {
      if (
        !Object.prototype.hasOwnProperty.call(customPropertyErrors, property)
      ) {
        continue;
      }
      let locations = '  ';
      for (const location of customPropertyErrors[property].locations) {
        const {start, file} = location;
        locations += `@ ${file}:${start.line}:${start.column}\n  `;
      }
      // eslint-disable-next-line no-console
      console.log(`${chalk.red(
        'error',
      )}: Unexpected custom property "${chalk.green(property)}" ${chalk.yellow(
        `${customPropertyErrors[property].count}`,
      )} times.
${locations}
    `);
    }
  }

  if (logLevel === 'verbose' || logLevel === 'info') {
    const customPropertiesForTable = Object.keys(customProperties).reduce<
      TableCustomProperty
    >((acc, key) => {
      const {declaration, usedFromDeclaration, count} = customProperties[key];
      acc[key] = {
        declaration,
        usedFromDeclaration,
        count,
      };

      return acc;
    }, {});
    // eslint-disable-next-line no-console
    console.log(chalk.underline.bold.magentaBright('Custom Properties'));
    // eslint-disable-next-line node/no-unsupported-features/node-builtins, no-console
    console.table(customPropertiesForTable);

    // eslint-disable-next-line no-console
    console.log(`${chalk.magenta(
      'Total',
    )} number of times custom properties are used: ${chalk.yellow(
      `${customPropertyStats.totalCustomProperties}`,
    )}.
Number of ${chalk.cyan('unique')} custom properties: ${chalk.yellow(
      `${customPropertyStats.uniqueCustomProperties}`,
    )}
${chalk.yellow(customPropertyStats.fileCount)} files have been ${chalk.green(
      'parsed',
    )}.`);
  }
}

function addCustomProperty(
  {value, start, end, declaration, file}: CustomPropertyMetaData,
  customPropertyPattern: string | undefined,
  customProperties: CustomPropertyMap,
  customPropertyDeclarations: ONCheck,
  customPropertyStats: CustomPropertyStats,
) {
  if (customPropertyPattern && !new RegExp(customPropertyPattern).test(value)) {
    return;
  }
  customPropertyStats.totalCustomProperties += 1;
  customPropertyDeclarations[value] = declaration;
  if (!customProperties[value]) {
    customProperties[value] = {
      declaration,
      usedFromDeclaration: false,
      count: 0,
      locations: [],
    };
    customPropertyStats.uniqueCustomProperties += 1;
  }
  customProperties[value].count += 1;
  customProperties[value].locations.push({
    start,
    end,
    file,
  });
}
