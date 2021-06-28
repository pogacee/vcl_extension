'use strict';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	// Register Symbol provider for VCL
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({scheme: "file", language: "vcl"}, new VCLDocumentSymbolProvider()));


	// Below: commands to toggle visibility of variables, subroutine declarations/calls, include statements in the VS Code outline

	// Include statements

	let workspaceConfig = vscode.workspace.getConfiguration('vcl-extension.VS Code Outline');
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowIncludes', () => {
		let showIncludesStatus = workspaceConfig.get('showIncludes');
		workspaceConfig.update('showIncludes', !showIncludesStatus, 1);
		vscode.window.showInformationMessage('VCL: Include Statement Outline Visibility: ' + workspaceConfig.get('showIncludes'));
		
	}));

	// P_User variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowPUsers', () => {
		let showPUsersStatus = workspaceConfig.get('showPUsers');
		workspaceConfig.update('showIncludes', !showPUsersStatus, 1);
		vscode.window.showInformationMessage('VCL: P_User Variable Outline Visibility: ' + workspaceConfig.get('showPUsers'));
		
	}));

	// User variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowUsers', () => {
		let showUsersStatus = workspaceConfig.get('showUsers');
		workspaceConfig.update('showUsers', !showUsersStatus, 1);
		vscode.window.showInformationMessage('VCL: User Variable Outline Visibility: ' + workspaceConfig.get('showUsers'));
		
	}));

	// NVUser variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowNVUsers', () => {
		let showNVUsersStatus = workspaceConfig.get('showNVUsers');
		workspaceConfig.update('showNVUsers', !showNVUsersStatus, 1);
		vscode.window.showInformationMessage('VCL: NVUser Variable Outline Visibility: ' + workspaceConfig.get('showNVUsers'));
		
	}));

	// Modules
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowModules', () => {
		let showModulesStatus = workspaceConfig.get('showModules');
		workspaceConfig.update('showModules', !showModulesStatus, 1);
		vscode.window.showInformationMessage('VCL: Module Outline Visibility: ' + workspaceConfig.get('showModules'));
		
	}));

	// Bit variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowBits', () => {
		let showBitsStatus = workspaceConfig.get('showBits');
		workspaceConfig.update('showBits', !showBitsStatus, 1);
		vscode.window.showInformationMessage('VCL: Bit Variable Outline Visibility: ' + workspaceConfig.get('showBits'));
		
	}));

	// Autouser variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowAutousers', () => {
		let showAutousersStatus = workspaceConfig.get('showAutousers');
		workspaceConfig.update('showBits', !showAutousersStatus, 1);
		vscode.window.showInformationMessage('VCL: Autouser Variable Outline Visibility: ' + workspaceConfig.get('showAutousers'));
		
	}));

	// Constant variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowConstants', () => {
		let showConstantsStatus = workspaceConfig.get('showConstants');
		workspaceConfig.update('showConstants', !showConstantsStatus, 1);
		vscode.window.showInformationMessage('VCL: Constant Variable Outline Visibility: ' + workspaceConfig.get('showConstants'));
		
	}));

	// Subroutine calls
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowSubroutineCalls', () => {
		let showSubroutineCallsStatus = workspaceConfig.get('showSubroutineCalls');
		workspaceConfig.update('showSubroutineCalls', !showSubroutineCallsStatus, 1);
		vscode.window.showInformationMessage('VCL: Subroutine Call Outline Visibility: ' + workspaceConfig.get('showSubroutineCalls'));
		
	}));

	// Subroutine declarations
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowSubroutineDeclarations', () => {
		let showSubroutineDeclarationsStatus = workspaceConfig.get('showSubroutineDeclarations');
		workspaceConfig.update('showSubroutineDeclarations', !showSubroutineDeclarationsStatus, 1 );
		vscode.window.showInformationMessage('VCL: Subroutine Declaration Outline Visibility: ' + workspaceConfig.get('showSubroutineDeclarations'));
		
	}));


	/*
	Below: Code completion
		We only need to parse the file once on function activation, so this occurs outside of the function.
	*/
	
	// Grab CSV file with functions/help text.
	const functionsSifCSVFilePath = context.asAbsolutePath(path.join('resources', 'functions.sif.csv'));

	let completionItems: vscode.CompletionItem[] = [];
	let functions: String[][] = [[]];
	let functionNames: String[] = [];

	fs.readFileSync(functionsSifCSVFilePath).toString().split('\n').forEach((element: string) => { // Read file, convert to string, split by line, iterate through each line
		let splitLine: String[] = [];
		let insideItem: boolean = false;
		var substringStart = 0;

		// Iterate through the length of the line (string)
		for(var i = 0; i < element.length; i++){

			if(element.charAt(i) === '"'){ // Toggle on/off if we're inside a quoted section
				if(i < element.length && element.charAt(i + 1) === '"'){
					i++; // skip escaped quote
				}
				else{
					insideItem = !insideItem;
				}
			}
			else if(element.charAt(i) === "," && !insideItem){ // Split on commas (assuming we're not inside a quoted section)
				splitLine.push(element.substring(substringStart, i));
				substringStart = i + 1;
			}
		}

		// Deal with quotes that wrap strings, also convert escaped quotes to regular quotes ("" ==> ")
		for(var i = 0; i < splitLine.length; i++){
			// Cut off starting quote if it exists
			if(splitLine[i].length > 1 && splitLine[i].startsWith('"') && !(splitLine[i].charAt(1) === '"')){
				splitLine[i] = splitLine[i].substring(1);
			}
			// Cut off end quote if it exists
			if(splitLine[i].length > 1 && splitLine[i].endsWith('"') && !(splitLine[i].charAt(splitLine[i].length - 2) === '"')){
				splitLine[i] = splitLine[i].substring(0, splitLine[i].length - 1);
			}
			splitLine[i] = splitLine[i].replace(/""/g, '"');
			splitLine[i] = splitLine[i].trim();
		}

		functions.push(splitLine); // Push each line split up as an array to functions. Each line is an array of values (function name, number of args, desc, etc.)
		functionNames.push(splitLine[0].toUpperCase()); // Push each line's first item (functionName) into a separate list for ease of access later
		//completionItems.push(new vscode.CompletionItem(splitLine[0].concat("()"))); // We put a "()" at the end of the functionName before creating a CompletionItem and pushing it onto the list of CompletionItems.
		const snippetCompletion = new vscode.CompletionItem(String(splitLine[0]));
		snippetCompletion.insertText = new vscode.SnippetString(splitLine[0].concat("($1)"));
		snippetCompletion.documentation = new vscode.MarkdownString(String(splitLine[4]));
		completionItems.push(snippetCompletion);
	});
	completionItems.shift(); // Remove the first CompletionItem because it's just column titles.

	const VCLCompletionItemProvider = vscode.languages.registerCompletionItemProvider(
		'vcl',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				return completionItems;
			}
		},
		'' // trigger on anything
	);
	context.subscriptions.push(VCLCompletionItemProvider);

	const VCLHoverProvider = vscode.languages.registerHoverProvider(
		'vcl',
		{
			provideHover(document, position, token) {
				const range = document.getWordRangeAtPosition(position);
				const word = document.getText(range).toUpperCase();
				var wordIndex = functionNames.indexOf(word) + 1;
				if(wordIndex > 0){ // If word is present in the list of function names. We do > 0 instead of >= 0 because functionName at index 0 is a column title.

					// If the number of args/returns/errors is a non-blank field, return the parsed int. Otherwise just return 0.
					const numArgs = ((functions[wordIndex][2]) ? (parseInt(String(functions[wordIndex][2]), 10)) : 0);
					const numReturns = ((functions[wordIndex][39]) ? (parseInt(String(functions[wordIndex][39]), 10)) : 0);
					const numErrors = ((functions[wordIndex][48]) ? (parseInt(String(functions[wordIndex][48]), 10)) : 0);

					let functionName: vscode.MarkdownString = new vscode.MarkdownString("**" + functions[wordIndex][0] + "**" + "(");
					let functionFeatureArea: vscode.MarkdownString = new vscode.MarkdownString(String(functions[wordIndex][3]));
					let functionShortComment: vscode.MarkdownString = new vscode.MarkdownString(String(functions[wordIndex][4]));
					let functionDescription: vscode.MarkdownString = new vscode.MarkdownString(String(functions[wordIndex][5]));
					let functionNotes: vscode.MarkdownString = new vscode.MarkdownString(String(functions[wordIndex][6]));
					let functionArgHelpsMarkdown: vscode.MarkdownString = new vscode.MarkdownString("#### Arguments (" + numArgs + ")\n\n");
					let functionReturnsMarkdown: vscode.MarkdownString = new vscode.MarkdownString("#### Returns (" + numReturns + ")\n\n");
					let functionErrorsMarkdown: vscode.MarkdownString = new vscode.MarkdownString("#### Errors (" + numErrors + ")\n\n");

					// Function Arguments
					for(var i = 7; i < 7 + numArgs * 2; i += 2){

						let currentArgName = functions[wordIndex][i].trim();
						let currentArgHelp = functions[wordIndex][i + 1].trim();
						functionName.appendMarkdown((currentArgName) ? "*" + currentArgName + "*": "*Arg" + (i - 6) + "*"); // if there's an arg name, put it in. Otherwise just do generic "Arg#"
						functionArgHelpsMarkdown.appendMarkdown((currentArgName) ? ("*" + String(currentArgName) + "*\n\n> ") : ("\n\n> "));
						functionArgHelpsMarkdown.appendMarkdown(currentArgHelp ? String(currentArgHelp) : "*Arg" + (i - 6) + ": Argument name not provided. Check Sysinfo for information.*");
						if(i < 5 + numArgs * 2){
							functionName.appendMarkdown(", ");
							functionArgHelpsMarkdown.appendMarkdown("\n\n");
						}
					}
					functionName.appendMarkdown(")");

					//Function Returns
					for(var i = 40; i < 40 + numReturns * 2; i += 2){
						let currentReturnName = functions[wordIndex][i];
						let currentReturnHelp = functions[wordIndex][i + 1];

						functionReturnsMarkdown.appendMarkdown("*");
						functionReturnsMarkdown.appendMarkdown((currentReturnName) ? String(currentReturnName): "Ret" + (i - 39) + ": Return name not provided. Check Sysinfo for information.");
						functionReturnsMarkdown.appendMarkdown("*\n\n> ");
						functionReturnsMarkdown.appendMarkdown((currentReturnHelp) ? String(currentReturnHelp) : "Return help text not provided. Check Sysinfo for information.");

						if(i < 38 + numReturns * 2){
							functionReturnsMarkdown.appendMarkdown("\n\n");
						}
					}
					
					//Function Errors
					for(var i = 49; i < 49 + numErrors * 2; i += 2){
						let currentErrorName = functions[wordIndex][i];
						let currentErrorHelp = functions[wordIndex][i + 1];

						functionErrorsMarkdown.appendMarkdown("*");
						functionErrorsMarkdown.appendMarkdown((currentErrorName) ? String(currentErrorName) : "Err" + (i - 48) + "Error name not provided. Check Sysinfo for information.");
						functionErrorsMarkdown.appendMarkdown("*\n\n> ");
						functionErrorsMarkdown.appendMarkdown((currentErrorHelp) ? String(currentErrorHelp) : "Error help text not provided. Check Sysinfo for information.");

						if(i < 38 + numReturns * 2){
							functionErrorsMarkdown.appendMarkdown("\n\n");
						}
					}

					return {
						contents: [functionName, functionFeatureArea, functionShortComment, functionDescription, functionNotes, functionArgHelpsMarkdown, functionReturnsMarkdown, functionErrorsMarkdown]
					};
				}
			}
		}
	);
	context.subscriptions.push(VCLHoverProvider);
	
}

class VCLDocumentSymbolProvider implements vscode.DocumentSymbolProvider{
	public provideDocumentSymbols(
		document: vscode.TextDocument,
		token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]> {
			return new Promise((resolve, reject) =>
			{
				let symbols: vscode.DocumentSymbol[] = [];
				let nodes = [symbols];

				// booleans for toggling visibility
				// not sure if this is the best way to go about showing/hiding different symbols, because VS doesn't seem to update the outline unless the code has been edited
				var showIncludes, showPUsers, showUsers, showNVUsers, showBits, showAutousers, showConstants, showSubroutineCalls, showSubroutines, showModules;
				showIncludes = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showIncludes');
				showPUsers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showPUsers');
				showNVUsers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showNVUsers');
				showUsers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showUsers');
				showBits = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showBits');
				showAutousers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showAutousers');
				showConstants = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showConstants');
				showSubroutineCalls = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showSubroutineCalls');
				showSubroutines = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showSubroutines');
				showModules = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showModules');
				
				// For putting things as children in the tree view
				let inside_subroutine = false;
				let inside_module_definition = false;

				for(var i = 0; i < document.lineCount; i++){ // Go line by line
					var line = document.lineAt(i);
					let tokens = new Array(); // A token is each "word" in the line, separated by whitespace or curly braces

					if(line.text.trim().startsWith(";")){} // If the entire line is a comment, skip the line
					else{
						if(line.text.includes(";")){ // Trim out any characters that show up after a semicolon, basically "remove" comments from the code
							/*
							Split lines based on whitespace or curly braces
							Split on curly braces because sometimes users like to put a call or something directly after a curly brace, such as below
								if(foo <> 1) {call Bar_Subroutine}
							*/
							line.text.substring(0, line.text.indexOf(";")).trim().split(/\s|{|}/).forEach(t => {
								if(t){
									tokens.push(t);
								}
							});
						}
						else{
							/*
							Split lines based on whitespace or curly braces
							Split on curly braces because sometimes users like to put a call or something directly after a curly brace, such as below
								if(foo <> 1) {call Bar_Subroutine}
							*/
							line.text.trim().split(/\s|{|}/).forEach(t => { 
								if(t){
									tokens.push(t);
								}
							});
						}
						
						// Go token by token
						for(var j = 0; j < tokens.length; j++){
							if(showModules && (j < tokens.length) && (tokens[j].toUpperCase().normalize() === ("BEGIN_MODULE"))){
								let module_symbol = new vscode.DocumentSymbol(tokens[j + 1], 'Module', vscode.SymbolKind.Module, line.range, line.range);
								nodes[nodes.length - 1].push(module_symbol);
								if(!inside_module_definition){
									nodes.push(module_symbol.children);
									inside_module_definition = true;
								}
							}
							else if(tokens[j].toUpperCase().normalize() === "END_MODULE"){
								if(inside_module_definition){
									nodes.pop();
									inside_module_definition = false;
								}
							}

							// Subroutine
							else if(showSubroutines && /w*:/.test(tokens[j])){
								let subroutine_symbol = new vscode.DocumentSymbol(tokens[j], 'Subroutine', vscode.SymbolKind.Constructor, line.range, line.range);
								nodes[nodes.length-1].push(subroutine_symbol);
								if(!inside_subroutine) {
									nodes.push(subroutine_symbol.children);
									inside_subroutine = true;
								}
							}
							else if(tokens[j].toUpperCase().match("GOTO") || tokens[j].toUpperCase().match("RETURN") || tokens[j].toUpperCase().match("RET")){
								if(inside_subroutine){
									nodes.pop();
									inside_subroutine = false;
								}
							}
							
							// Module Entry
							else if(showModules && tokens[j].toUpperCase().normalize() === "ENTER"){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j] + " " + tokens[j + 1], 'Module Entry', vscode.SymbolKind.Module, line.range, line.range));
							}

							// Subroutine Call
							else if(showSubroutineCalls && tokens[j].toUpperCase().normalize() === "CALL"){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j] + " " + tokens[j + 1], 'Subroutine Call', vscode.SymbolKind.Method, line.range, line.range));
							}

							// Autouser
							else if(showAutousers && j > 0 && tokens[j-1].toUpperCase().normalize() === "CREATE" && ((tokens[j+1].toUpperCase().normalize() === ("VARIABLE")) || (tokens[j+1].toUpperCase().normalize() === ("VAR")))){
								nodes[nodes.length -1].push(new vscode.DocumentSymbol(tokens[j], 'Autouser Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}

							// User var
							else if(showUsers && (j <= tokens.length - 3) && ((tokens[j+1].toUpperCase().normalize() === "EQUALS") || (tokens[j+1].toUpperCase().normalize() === "ALIAS")) && /^(USER\d\d\d|USER\d\d|USER\d)$/.test(tokens[j+2].toUpperCase())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'User Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}

							// P User var
							else if(showPUsers && j <= tokens.length - 3 && ((tokens[j+1].toUpperCase().normalize() === "EQUALS") || (tokens[j+1].toUpperCase().normalize() === "ALIAS")) && /^(P_USER\d\d\d|P_USER\d\d|P_USER\d)/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push( new vscode.DocumentSymbol(tokens[j], 'P_User Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}

							//NV User var
							else if(showNVUsers && j <= tokens.length - 3 && ((tokens[j+1].toUpperCase().normalize() === "EQUALS") || (tokens[j+1].toUpperCase().normalize() === "ALIAS")) && /^(NVUSER\d\d\d|NVUSER\d\d|NVUSER\d)/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push( new vscode.DocumentSymbol(tokens[j], 'NVUser Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}

							// Constant
							else if(showConstants && j <= tokens.length - 3 && tokens[j+1].toUpperCase().normalize() === "CONSTANT" && /^\w*/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'Constant', vscode.SymbolKind.Constant, line.range, line.range));
							}

							// Bit
							else if(showBits && j <= tokens.length - 3 && tokens[j + 1].toUpperCase().normalize() === "BIT" && /\w*/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'Bit', vscode.SymbolKind.Boolean, line.range, line.range));
							}

							// Include
							else if(showIncludes && j <= tokens.length - 2 && tokens[j].toUpperCase().normalize() === "INCLUDE" && tokens[j + 1].toUpperCase().normalize().startsWith("\"")){
								var fileName = line.text.substring(line.text.indexOf("\"") + 1, line.text.indexOf("\"",line.text.indexOf("\"") + 1)).trim();
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j] + " \"" + fileName + "\"", 'Include', vscode.SymbolKind.File, line.range, line.range));
							}
						}	
					}
				}
				resolve(symbols);
			});
		}
}

// this method is called when your extension is deactivated
export function deactivate() {}
