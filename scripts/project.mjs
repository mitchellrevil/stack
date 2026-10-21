// All paths come from this file, so commands work from a checkout with spaces.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, copyFileSync, constants } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(root, "backend");
const frontend = join(root, "frontend");
const windows = process.platform === "win32";
const python = join(
  backend,
  ".venv",
  windows ? "Scripts/python.exe" : "bin/python",
);

function run(command, args, cwd) {
  // npm gives us its JS entry point. Calling it with Node avoids a Windows
  // shell and keeps paths with spaces out of command-string parsing.
  if (command === "npm") {
    if (!process.env.npm_execpath) {
      throw new Error("Use npm run setup, npm run dev or npm run check.");
    }

    args = [process.env.npm_execpath, ...args];
    command = process.execPath;
  }
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed. Fix the error above and try again.`,
    );
  }
}

function setup() {
  // Check prerequisites before downloading anything. Do not change global tools.
  const systemPython = windows ? "python" : "python3";
  run(
    systemPython,
    [
      "-c",
      'import sys; assert sys.version_info >= (3, 11), "Python 3.11 or later is required"',
    ],
    root,
  );
  run("npm", ["ci"], root);
  if (!existsSync(python)) {
    run(systemPython, ["-m", "venv", join(backend, ".venv")], root);
  }

  run(python, ["-m", "pip", "install", "-r", "requirements-dev.txt"], backend);
  run("npm", ["ci"], frontend);
  if (!existsSync(join(backend, ".env"))) {
    copyFileSync(
      join(backend, ".env.example"),
      join(backend, ".env"),
      constants.COPYFILE_EXCL,
    );
  }
  console.log(
    "\nSetup complete. Run npm run dev, then open http://localhost:5173.",
  );
}

function dev() {
  // Spawn actual executables rather than an npm shell so Ctrl+C can stop both.
  // Uvicorn runs without a reload subprocess; restart after backend edits.
  const children = [
    spawn(
      python,
      [
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
      ],
      { cwd: backend, stdio: "inherit" },
    ),
    spawn(
      process.execPath,
      ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
      { cwd: frontend, stdio: "inherit" },
    ),
  ];

  let stopping = false;

  function stop(code = 0) {
    if (stopping) {
      return;
    }

    stopping = true;
    process.exitCode = code;
    for (const child of children) {
      child.kill();
    }
  }

  process.on("SIGINT", () => stop());
  process.on("SIGTERM", () => stop());
  for (const child of children) {
    child.on("error", (error) => {
      console.error(error.message);
      stop(1);
    });
    child.on("exit", (code) => stop(code ?? 1));
  }
}

try {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 12)) {
    throw new Error("Install Node.js 22.12 or later first.");
  }

  switch (process.argv[2]) {
    case "setup":
      setup();
      break;
    case "dev":
      dev();
      break;
    case "check":
      run("npm", ["run", "check"], frontend);
      run(python, ["-m", "ruff", "check", "."], backend);
      run(python, ["-m", "ruff", "format", "--check", "."], backend);
      break;
    default:
      throw new Error("Use setup, dev or check.");
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
