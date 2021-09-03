
# VCL Extension
This VS Code extension adds syntax highlighting, outline support, hover support, and several useful code snippets for Curtis Instruments Vehicle Control Language (VCL) code.

## Extension Settings

This extension contributes the following settings:

* `vcl_extension.enable`: Enable/Disable this extension
* `vcl_extension.VS Code Outline.showIncludes`: Enable/Disable include statement visibility in Outline
* `vcl_extension.VS Code Outline.showPUsers`: Enable/Disable PUser variable declaration visibility in Outline
* `vcl_extension.VS Code Outline.showUsers`: Enable/Disable User variable declaration visibility in Outline
* `vcl_extension.VS Code Outline.showBits`: Enable/Disable Bit variable declaration visibility in Outline
* `vcl_extension.VS Code Outline.showAutousers`: Enable/Disable Autouser variable declaration visibility in Outline
* `vcl_extension.VS Code Outline.showConstants`: Enable/Disable Constant variable declaration visibility in Outline
* `vcl_extension.VS Code Outline.showSubroutineCalls`: Enable/Disable PUser Subroutine call statement visibility in Outline
* `vcl_extension.VS Code Outline.showSubroutines`: Enable/Disable Subroutine declaration visibility in Outline

## Known Issues

* There may be some issues with syntax highlighting colors or "categorization" of keywords/variables
* Sometimes the options to turn on/off certain outline features don't toggle correctly. Using the "Reload Window" usually helps update the extension.

## Release Notes

### 1.0.0

* Basic syntax highlighting complete
* Snippets for several common items added
    * Comment Lines
        * Using "=" and "-" characters
        * Single lines as well as enclosed blocks as well that place your cursor between two lines
    * Loops and other common conditional statements
        * While loop
        * Blocks for if, else-if, else, if else, if else-if else
    * Main loop and subroutines
    * Parameter generation
    * Revision line generation

### 1.0.2

* Bugfixes

### 1.0.3

* Updated Readme
* Added // line comment highlighting

### 1.0.4

* Updated Readme

### 1.0.5

* Added autouser variables

### 1.0.6

* Fixed issue where OS variables/keywords like "Driver1" would still be highlighted if there were characters before it, such as when a user created variable is named "fooDriver1"

### 1.1.0

* Added support for VS Code outline

### 1.1.1

* Added toggles for VS Code outline items (Found in both the settings and in the editor title bar [top right corner of editor])

### 1.1.2

* Changed default settings for VS Code outline visibility (include statements, subroutine declarations, subroutine calls only visible)

### 1.1.3

* Added "alias" keyword (equivalent to "equals)
* Added NVUser variables
* Added module support in the VS Code Outline

### 1.1.4

* Added Hover support
    * Hover the cursor over a VCL function and a box will display with information about that function.
* Added basic code completion for function names

### 1.1.5

* Updated function list and README

### 1.1.6

* Updated function hover and function suggestions.

### 1.1.7

* Added constants to hovers and suggestions.

### 1.1.8

* Fixed issue where putting certain OS variables in a subroutine name (or otherwise using the variable) with an underscore preceeding the variable would cause the variable name to still be highlighted.

### 1.1.9

* Added a subroutine header snippet. To use this snippet, type `shead`, `subrhead`, or `subroutinehead`.
* Changed the subroutine declaration icon in the VS Code Outline to more clearly be able to distiguish between subroutine declarations and calls.

## VCL_Extension Snippets

### **Revision Line**
#### *Prefix*
```
rev, revision
```
#### *Output*
```vcl
;	YYYY/MM/DD - firstInitial. lastName - V1.ver		desc
```
### **Equals Comment Line**
#### *Prefix*
```vcl
eql, eqline
```
#### *Output*
```vcl
;========================================================================
```
### **Dash Comment Line**
#### *Prefix*
```vcl
dashl, dashline, hyphl, hyphline, hyphenl, hyphenline
```
#### *Output*
```vcl
;------------------------------------------------------------------------
```
### **Equals Comment Line Enclosure**
#### *Prefix*
```vcl
eqlenc, eqlineencl
```
#### *Output*
```vcl
;========================================================================

;========================================================================
```
### **Dash Comment Line Enclosure**
#### *Prefix*
```vcl
dashlencl, dashlineencl, hyphlencl, hyphlineencl, hyphenlencl, hyphenlineencl
```
#### *Output*
```vcl
;------------------------------------------------------------------------

;------------------------------------------------------------------------
```
### **Main Loop**
#### *Prefix*
```vcl
main
```
#### *Output*
```vcl
mainLoop: 

goto mainLoop
```
### **Subroutine**
#### *Prefix*
```vcl
subr, subroutine
```
#### *Output*
```vcl
subroutineName:

return
```
### **Subroutine Header**
#### *Prefix*
```vcl
shead, subrhead, subroutinehead
```
#### *Output*
```vcl
;------------------------------------------------------------------------
;   Subroutine subroutineName
;------------------------------------------------------------------------
;   description
;------------------------------------------------------------------------

```
### **While Loop**
#### *Prefix*
```vcl
while
```
#### *Output*
```vcl
while(conditional) {

}
```
### **If Statement**
#### *Prefix*
```vcl
if
```
#### *Output*
```vcl
if(conditional)
{

}
```
### **Else-If Statement**
#### *Prefix*
```vcl
elif, elseif
```
#### *Output*
```vcl
else if(conditional)
{

}
```
### **Else Statement**
#### *Prefix*
```vcl
else, el
```
#### *Output*
```vcl
else
{

}
```
### **If Else Block**
#### *Prefix*
```vcl
ifelse, ifel
```
#### *Output*
```vcl
if(conditional)
{

}
else
{

}
```
### **If Else-If Else Block**
#### *Prefix*
```vcl
ifelseif, ifelif
```
#### *Output*
```vcl
if(conditional)
{

}
else if(conditional)
{

}
else
{

}
```
### **Parameter Level**
#### *Prefix*
```vcl
paraml, paramlevel
```
#### *Output*
```vcl
;PARAMETER_ENTRY	"name"
;		TYPE			type
;		LEVEL			level
;END
```
### **Parameter Entry**
#### *Prefix*
```vcl
param, paramentry
```
#### *Output*
```vcl
;PARAMETER_ENTRY			"name"
;		TYPE			type
;		ADDRESS			addr
;		WIDTH			width
;		MINDSP			mindsp
;		MAXDSP			maxdsp
;		MAXRAW			minraw
;		UNITS			units
;		DECIMALPOS		decimalpos
;		DEFAULT			default
;		STEP_SIZE		step_size
;		LAL_READ		lal_read
;		LAL_WRITE		lal_write
;		SIGNED			signed
;		HELP_HTML		"html"
;END
```

---
