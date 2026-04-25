const { spawn } = require("child_process");

// Try multiple python commands — works on Windows, Mac, Linux
const PYTHON_COMMANDS = ["python", "py", "python3"];

function runPython(args) {
  return new Promise((resolve, reject) => {
    let commandIndex = 0;

    function tryNext() {
      if (commandIndex >= PYTHON_COMMANDS.length) {
        reject(new Error("Python not found. Install Python from python.org and make sure it is on PATH."));
        return;
      }

      const cmd = PYTHON_COMMANDS[commandIndex++];
      const process = spawn(cmd, args);
      let output = "";
      let errorOutput = "";

      process.stdout.on("data", (d) => (output += d.toString()));
      process.stderr.on("data", (d) => (errorOutput += d.toString()));

      process.on("close", (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          // If it failed because command not found, try next
          if (errorOutput.includes("not recognized") || errorOutput.includes("not found") || errorOutput.includes("No such file")) {
            tryNext();
          } else {
            reject(new Error(errorOutput || `Python exited with code ${code}`));
          }
        }
      });

      process.on("error", () => {
        // Command not found — try next
        tryNext();
      });
    }

    tryNext();
  });
}

module.exports = { runPython };