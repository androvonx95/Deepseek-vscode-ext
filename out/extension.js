"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
// let conv:{ user: string , AI: string}[]=[];
// vscode.window.
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "deepseek-ext" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    // const disposable = vscode.commands.registerCommand('deepseek-ext.helloWorld', () => {
    // 	// The code you place here will be executed every time your command is executed
    // 	// Display a message box to the user
    // 	vscode.window.showInformationMessage('This is a test run and I hope it works.... from deepseek-ext!');
    // });
    // context.subscriptions.push(disposable);
    const disposable = vscode.commands.registerCommand('deepseek-ext.helloWorld', () => {
        const panel = vscode.window.createWebviewPanel("deepChat", "Deep Seek Chat", vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === "chat") {
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const streamResponse = await ollama_1.default.chat({
                        model: 'deepseek-r1:1.5b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true
                    });
                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        // conv.push( {user : userPrompt , AI : responseText})  // adding the conversation objects to history
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                    panel.webview.postMessage({ command: 'chatResponseReceived', text: responseText });
                }
                catch (err) {
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error : ${err}` });
                    vscode.window.showInformationMessage(`Error : ${err}`);
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>

            <style>
               body {
					font-family: 'Arial', sans-serif;  /* Clean sans-serif font */
					margin: 1rem;
					background-color:rgb(0, 0, 0);  /* Soft background color for better contrast */
					color: white;  /* Darker text for better readability */
				}
			#chatUI{

				overflow-y:scroll;
			
			}
			#prompt {
				width: 100%;
				box-sizing: border-box;
				border-radius: 10px;  /* Rounded corners */
				overflow-y: auto;
				padding: 10px;
				font-size: 16px;
				border: 1px solid #ccc;
				background-color: #fff;
				transition: all 0.3s ease;  /* Smooth transition for height changes */
				resize: none;  /* Disable manual resizing */
				line-height: 1.5;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);  /* Subtle shadow effect */
			}

			#prompt:focus {
				outline: none;
				border-color: #007bff;  /* Blue border on focus */
			}

			#response {
				border: 1px solid #ddd;
				margin-top: 1rem;
				padding: 15px;
				border-radius: 8px;  /* Rounded corners for the response container */
				background-color: #fff;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);  /* Soft shadow for response area */
				font-size: 16px;
			}

			.message {
				margin-bottom: 12px;
				line-height: 1.6;  /* More readable line height */
			}

			.user-message {
				border: 1px solid #007bff;
				background-color:rgb(83, 86, 87);  /* Soft light blue background */
				padding: 12px 16px;
				font-weight: bold;
				margin-top: 1rem;
				border-radius: 18px;
				font-size: 16px;
				max-width: 80%;
				box-shadow: 0 2px 4px rgba(0, 123, 255, 0.1);  /* Light shadow for user messages */
				word-wrap: break-word;  /* Ensure long words break properly */
			}

			.ai-message {
				border: 1px solid #ccc;
				background-color:rgb(83, 78, 78);  /* Light gray background for AI messages */
				padding: 12px 16px;
				font-style: italic;
				margin-top: 1rem;
				border-radius: 18px;
				font-size: 16px;
				max-width: 80%;
				box-shadow: 0 2px 4px rgba(173, 161, 161, 0.1);  /* Light shadow for AI messages */
				word-wrap: break-word;  /* Ensure long words break properly */
			}

			/* Button styles */
			button {
				padding: 10px 20px;
				background-color: #007bff;
				color: white;
				border: none;
				border-radius: 25px;  /* Rounded button corners */
				font-size: 16px;
				cursor: pointer;
				transition: all 0.3s ease;
			}

			button:hover {
				background-color: #0056b3;  /* Darker blue on hover */
				transform: translateY(-2px);  /* Slight lifting effect */
			}

			button:focus {
				outline: none;
			}
				

			/* Small margin for button spacing */
			button + #prompt {
				margin-top: 10px;
			}

            </style>
        </head>

        <body>
            <h2>DeepSeek VS Codium Ext</h2>


            <div id="chatUI">
			
			</div>

			<textarea id="prompt" rows="3" placeholder="type something.."></textarea>
            <button id="askBtn">Ask</button>
            <script>
                let conv = [];
                let userText = '';

                function msgPair(userText, AI_Text) {
                    return \`
                        <div class="message">
                            <div class="user-message">You : \${userText}</div>
                            <div class="ai-message">DeepSeek : \${AI_Text}</div>
                        </div>
                    \`;
                }

                function convo(conv) {
                    let chatUIHTML = '';
                    for (let i = 0; i < conv.length; i++) {
                        chatUIHTML += msgPair(conv[i].user, conv[i].AI);
                    }
                    document.getElementById("chatUI").innerHTML = chatUIHTML;
                }

                const vscode = acquireVsCodeApi();

                document.addEventListener('DOMContentLoaded', () => {
                    conv = []; // Reset the conversation on load
                });


				document.getElementById('prompt').addEventListener( "input" , (event)=>{

					
					if( document.getElementById('prompt').clientHeight < document.getElementById('prompt').scrollHeight  ){

						if (document.getElementById('prompt').scrollHeight > 500) {
							document.getElementById('prompt').style.height = '500px';
						}
						
						else{
							document.getElementById('prompt').style.height = document.getElementById('prompt').scrollHeight + 'px' ;						
						}

					}
	
					else{
						document.getElementById('prompt').style.height='auto';
					}
				});

				document.getElementById('prompt').addEventListener( "keydown" , (event)=>{
					if(event.key=="Enter"  && !event.shiftKey ){
						event.preventDefault();
						userText = document.getElementById('prompt').value;
						document.getElementById('prompt').value = '';
						conv.push({ user: userText, AI: '' }); // Add the user prompt to the conversation
						convo(conv); // Update the UI immediately with the new user message
						vscode.postMessage({ command: 'chat', text: userText });
					}
				});

                document.getElementById('askBtn').addEventListener('click', () => {
                    userText = document.getElementById('prompt').value;
                    document.getElementById('prompt').value = '';
                    conv.push({ user: userText, AI: '' }); // Add the user prompt to the conversation
                    convo(conv); // Update the UI immediately with the new user message
                    vscode.postMessage({ command: 'chat', text: userText });
                });

                window.addEventListener("message", (event) => {
                    const { command, text } = event.data;

                    if (command === "chatResponse") {
                        // Append the new response part progressively as a stream
                        conv[conv.length - 1].AI = text;
                        convo(conv); // Update the UI as each new part is received
                    } else if (command === "chatResponseReceived") {
                        // The final response, mark the conversation as complete
                        conv[conv.length - 1].AI = text;
                        convo(conv); // Update the UI with the final response
                    }
                });

            </script>  
        </body>
        </html>
    `;
    return html;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map