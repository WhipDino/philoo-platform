import { execSync, spawn } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const port = process.env.PORT ?? "3000";
const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(root, "..");
const lockFile = join(projectRoot, ".next", "dev", "lock");

function killPortWindows(targetPort) {
  try {
    const output = execSync(`netstat -ano | findstr :${targetPort}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const pids = new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim().split(/\s+/).at(-1))
        .filter((pid) => pid && /^\d+$/.test(pid) && pid !== "0"),
    );
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped PID ${pid} on port ${targetPort}`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    console.log(`No process found on port ${targetPort}`);
  }
}

if (process.platform === "win32") {
  killPortWindows(port);
} else {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore" });
  } catch {
    console.log(`No process found on port ${port}`);
  }
}

if (existsSync(lockFile)) {
  unlinkSync(lockFile);
  console.log("Removed .next/dev/lock");
}

console.log(`Starting dev server on port ${port}...`);
const child = spawn("npm", ["run", "dev"], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PORT: port },
});

child.on("exit", (code) => process.exit(code ?? 0));
