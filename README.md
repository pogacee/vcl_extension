
# VCL_extension
This extension adds syntax highlighting for Curtis Instruments VCL Code and several useful code snippets.

(I'm leaving this bit in to remember how to do it later when I add images)
For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)


## Extension Settings

This extension contributes the following settings:

* `vcl_extension.enable`: enable/disable this extension

## Known Issues

* There may be some issues with syntax highlighting colors



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



## VCL_Extension Snippets

### **Revision Line**
#### *Prefix*
```
rev, revision
```
#### *Output*
```vcl
;	08/03/2020 - firstInitial. lastName - V1.ver		desc
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
if(conditional) {

}
```
### **Else-If Statement**
#### *Prefix*
```vcl
elif, elseif
```
#### *Output*
```vcl
else if(conditional) {

}
```
### **Else Statement**
#### *Prefix*
```vcl
else, el
```
#### *Output*
```vcl
else {

}
```
### **If Else Block**
#### *Prefix*
```vcl
ifelse, ifel
```
#### *Output*
```vcl
if(conditional) {

}
else {

}
```
### **If Else-If Else Block**
#### *Prefix*
```vcl
ifelseif, ifelif
```
#### *Output*
```vcl
if(conditional) {

}
else if(conditional) {

}
else {

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
;		ADRESS			addr
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