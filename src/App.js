import "./styles.css";

import WasmTerminal, { fetchCommandFromWAPM } from "@wasmer/wasm-terminal";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

// Let's write handler for the fetchCommand property of the WasmTerminal Config.
const fetchCommandHandler = async ({ args }) => {
  let commandName = args[0];
  // Let's return a "CallbackCommand" if our command matches a special name
  if (commandName === "callback-command") {
    const callbackCommand = async (options, wasmFs) => {
      return `Callback Command Working! Options: ${options}, fs: ${wasmFs}`;
    };
    return callbackCommand;
  }

  // Let's fetch a wasm Binary from WAPM for the command name.
  const wasmBinary = await fetchCommandFromWAPM({ args });

  // lower i64 imports from Wasi Modules, so that most Wasi modules
  // Can run in a Javascript context.
  return await lowerI64Imports(wasmBinary);
};

// Let's create our Wasm Terminal
const wasmTerminal = new WasmTerminal({
  // Function that is run whenever a command is fetched
  fetchCommand: fetchCommandHandler
});

// Let's print out our initial message
wasmTerminal.print("Hello World!");

// Let's bind our Wasm terminal to it's container
const containerElement = document.querySelector("#root2");
wasmTerminal.open(containerElement);
wasmTerminal.fit();
wasmTerminal.focus();

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
