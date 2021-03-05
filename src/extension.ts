// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';
import * as vscode from 'vscode';




// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider(
			{scheme: "file", language: "vcl"},
			new VCLDocumentSymbolProvider()
		)
	);

	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "vcl-extension" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('vcl-extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Sup VS Code!');
	// });

	// context.subscriptions.push(disposable);
}

class VCLDocumentSymbolProvider implements vscode.DocumentSymbolProvider{
	private format(cmd: string): string{
		return cmd.substr(1).toLowerCase().replace(/^\w/, c => c.toUpperCase());
	}

	public provideDocumentSymbols(
		document: vscode.TextDocument,
		token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[]>
		{
			return new Promise((resolve, reject) =>
			{
				let symbols: vscode.DocumentSymbol[] = [];
				let nodes = [symbols];
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
								console.log("User variable");
								nodes[nodes.length - 1].push(new vscode.DocumentSymbol(tokens[j], 'User Variable', vscode.SymbolKind.Variable, line.range, line.range));
							}
							else if(showPUsers && j <= tokens.length - 3 && tokens[j+1].toUpperCase().normalize() === "EQUALS" && /^(P_USER\d\d\d|P_USER\d\d|P_USER\d)/.test(tokens[j+2].toUpperCase().normalize())){
								console.log("P User Variable");
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
								console.log(fileName);

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
