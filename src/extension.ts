'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// Register Symbol provider for VCL
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({scheme: "file", language: "vcl"}, new VCLDocumentSymbolProvider()));


	// Below: commands to toggle visibility of variables, subroutine declarations/calls, include statements in the VS Code outline

	// Include statements

	let workspaceConfig = vscode.workspace.getConfiguration('vcl-extension.VS Code Outline');
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowIncludes', () => {
		let showIncludesStatus = workspaceConfig.get('showIncludes');
		workspaceConfig.update('showIncludes', !showIncludesStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Include Statement Outline Visibility: ' + workspaceConfig.get('showIncludes'));
		
	}));

	// P_User variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowPUsers', () => {
		let showPUsersStatus = workspaceConfig.get('showPUsers');
		workspaceConfig.update('showIncludes', !showPUsersStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: P_User Variable Outline Visibility: ' + workspaceConfig.get('showPUsers'));
		
	}));

	// User variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowUsers', () => {
		let showUsersStatus = workspaceConfig.get('showUsers');
		workspaceConfig.update('showUsers', !showUsersStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: User Variable Outline Visibility: ' + workspaceConfig.get('showUsers'));
		
	}));

	// Bit variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowBits', () => {
		let showBitsStatus = workspaceConfig.get('showBits');
		workspaceConfig.update('showBits', !showBitsStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Bit Variable Outline Visibility: ' + workspaceConfig.get('showBits'));
		
	}));

	// Autouser variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowAutousers', () => {
		let showAutousersStatus = workspaceConfig.get('showAutousers');
		workspaceConfig.update('showAutousers', !showAutousersStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Autouser Variable Outline Visibility: ' + workspaceConfig.get('showAutousers'));
		
	}));

	// Constant variables
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowConstants', () => {
		let showConstantsStatus = workspaceConfig.get('showConstants');
		workspaceConfig.update('showConstants', !showConstantsStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Constant Variable Outline Visibility: ' + workspaceConfig.get('showConstants'));
		
	}));

	// Subroutine calls
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowSubroutineCalls', () => {
		let showSubroutineCallsStatus = workspaceConfig.get('showSubroutineCalls');
		workspaceConfig.update('showSubroutineCalls', !showSubroutineCallsStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Subroutine Call Outline Visibility: ' + workspaceConfig.get('showSubroutineCalls'));
		
	}));

	//Subroutine declarations
	context.subscriptions.push(vscode.commands.registerCommand('vcl-extension.toggleShowSubroutineDeclarations', () => {
		let showSubroutineDeclarationsStatus = workspaceConfig.get('showSubroutineDeclarations');
		workspaceConfig.update('showSubroutineDeclarations', !showSubroutineDeclarationsStatus, true);
		vscode.commands.executeCommand("workbench.action.reloadWindow");
		vscode.window.showInformationMessage('VCL: Subroutine Declaration Outline Visibility: ' + workspaceConfig.get('showSubroutineDeclarations'));
		
	}));


	
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
				var showIncludes, showPUsers, showUsers, showBits, showAutousers, showConstants, showSubroutineCalls, showSubroutines;
				showIncludes = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showIncludes');
				showPUsers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showPUsers');
				showUsers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showUsers');
				showBits = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showBits');
				showAutousers = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showAutousers');
				showConstants = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showConstants');
				showSubroutineCalls = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showSubroutineCalls');
				showSubroutines = vscode.workspace.getConfiguration("vcl-extension.VS Code Outline").get('showSubroutines');
				
				let inside_subroutine = false;
				for(var i = 0; i < document.lineCount; i++){
					var line = document.lineAt(i);
					let tokens = new Array();
					if(line.text.trim().startsWith(";")){}
					else{
						if(line.text.includes(";")){
							line.text.substring(0, line.text.indexOf(";")).trim().split(/\s/).forEach(t => {
								if(t){
									tokens.push(t);
								}
							});
						}
						else{
							line.text.trim().split(/\s/).forEach(t => {
								if(t){
									tokens.push(t);
								}
							});
						}
						for(var j = 0; j < tokens.length; j++){
							if(showSubroutines && /w*:/.test(tokens[j])){
								let subroutine_symbol = new vscode.DocumentSymbol(tokens[j], 'Subroutine', vscode.SymbolKind.Constructor, line.range, line.range);
								nodes[nodes.length-1].push(subroutine_symbol);
								if(!inside_subroutine) {
									nodes.push(subroutine_symbol.children);
									inside_subroutine = true;
								}
							}
							else if(tokens[j].toUpperCase().match("GOTO") || tokens[j].toUpperCase().match("RETURN")){
								if(inside_subroutine){
									nodes.pop();
									inside_subroutine = false;
								}
							}
							else if(showSubroutineCalls &&tokens[j].toUpperCase().normalize() === "CALL"){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j] + " " + tokens[j + 1], 'Subroutine Call', vscode.SymbolKind.Method, line.range, line.range));
							}
							else if(showAutousers && j > 0 && tokens[j-1].toUpperCase().normalize() === "CREATE" && tokens[j+1].toUpperCase().normalize() === ("VARIABLE")){
								nodes[nodes.length -1].push(new vscode.DocumentSymbol(tokens[j], 'Autouser Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}
							else if(showUsers && (j <= tokens.length - 3) && tokens[j+1].toUpperCase().normalize() === "EQUALS" && /^(USER\d\d\d|USER\d\d|USER\d)$/.test(tokens[j+2].toUpperCase())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'User Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}
							else if(showPUsers && j <= tokens.length - 3 && tokens[j+1].toUpperCase().normalize() === "EQUALS" && /^(P_USER\d\d\d|P_USER\d\d|P_USER\d)/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push( new vscode.DocumentSymbol(tokens[j], 'P_User Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}
							else if(showConstants && j <= tokens.length - 3 && tokens[j+1].toUpperCase().normalize() === "CONSTANT" && /^\w*/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'Constant', vscode.SymbolKind.Constant, line.range, line.range));
							}
							else if(showBits && j <= tokens.length - 3 && tokens[j + 1].toUpperCase().normalize() === "BIT" && /\w*/.test(tokens[j+2].toUpperCase().normalize())){
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'Bit', vscode.SymbolKind.Boolean, line.range, line.range));
							}
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
