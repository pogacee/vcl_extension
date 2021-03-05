# Change Log

All notable changes to the "vcl-extension" extension will be documented in this file.


## [0.5.1]

- Initial testing release

## [0.5.2]

- Added CAN variables and constants from VCL Common Functions document
- Hopefully from this point on it's only tweaking categories to change syntax highlight colors

## [0.5.3]

- Added categories to function line (comments inside function, etc)
- Changed around a few constants/variables

## [1.0.0]

- Added Snippets
    - See Readme for list of snippets (prefix and output)
- First "Full Release"

## [1.0.1]

- Small changes to snippets file to add some more prefixes that were not saved in the previous release

## [1.0.2]

- Small fixes

## [1.0.5]

- Added autouser variables to syntax highlighting

## [1.0.6]

- Fixed issue where OS variables/keywords like "Driver1" would still be highlighted if there were characters before it, such as when a user created variable is named "fooDriver1"

## [1.1.0]

### VS Code outline support has arrived!
- Added support for the VS Code Outline. This feature is very similar to the Function List in Notepad++. It is configurable so that the user has the option of showing: 
    - Subroutines
    - Subroutine Calls
    - User Variable Declarations
    - PUser Variable Declarations
    - Autouser Variable Declarations
    - Bit Variable Declarations
    - Constant Variable Declarations
    - Include Statements
- Each item can be toggled on/off in the settings or in the `settings.json` file.