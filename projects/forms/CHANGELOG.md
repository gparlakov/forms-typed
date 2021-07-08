# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.3] - 2021-07-09

### Fixed
-   missing support for `getRawValue()` on `TypedFormGroup`
-   incorrect install instructions in README "Getting Started" section

## [1.1.2] - 2021-07-07

### Fixed
-   missing support for `ValidatorFn[]` and `AsyncValidatorFn[]` for `typedFormControl`
-   missing support for `getRawValue()` on `TypedFormGroup`
-   incorrect install instructions in README "Getting Started" section

## [1.1.1] - 2021-06-05
### Fixed
-   the form.keys was mistakenly an `Array` while advertised as a `Record<keyof T, string>`

## [1.1.0] - 2021-05-29
### Added
-   allow `emitModelToViewChange?: boolean;` and `emitViewToModelChange?: boolean;` in the method options (e.g. `setValue`)
-   add `keys` to the `typedFormControl` return type to hold all keys of the form group
### Fixed
-   typedFormArray takes the item type first vs the array type first i.e. `typedFormArray<string>` vs `typedFormArray<string[], string>`

## [1.0.8] - 2020-12-12
### Fixed
-   allow `AbstractControlOptions` in the `typedFormControl` helper function


## [1.0.7] - 2020-09-20
### Fixed
-   allow alternative formsControl with value and disabled state object (thanks to @zy2ba)

### Added
-   semantic-release for releasing automatically
-   commitlint to make sure the commits follow the standard
-   husky to run commitlint

## [1.0.6] - 2020-09-05
### Fixed
-   Actually published the --prod build version of the library (issue #31)

## [1.0.5] - 2020-08-14
### Fixed
-   To support Ivy bump up the package peer dependencies to allow for any version of Angular after and including 2.0.0
-   fixed a couple of typos

## [1.0.4] - 2020-05-05
### Fixed
-   fixed link to homepage in npmjs.com package page

## [1.0.3] - 2020-04-04
### Added
-   Use the github repository provided images (rollback 1.0.2 and 1.0.1)

## [1.0.2] - 2020-03-14
### Added
-   Include images for readme.md

## [1.0.1] - 2020-03-14
### Fixed
-   Fix Readme.md image links

## [1.0.0] - 2020-03-14
### Added
-   Initial stable release - includes TypedFormControl, ControlValueAccessorConnector and forEachControlIn

## [1.0.0-rc.4] - 2020-03-14
### Added
-   Add documentation README.md and CHANGELOG.md

## [1.0.0-rc.3] - 2020-03-14
### Fixed
-   Small fixes

## [1.0.0-rc.2] - 2020-03-14
### Added
-   Small fixes

## [1.0.0-rc.1] - 2020-03-14
### Added
-   Initial release - includes TypedFormControl, ControlValueAccessorConnector and forEachControlIn
