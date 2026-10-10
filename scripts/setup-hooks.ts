import { chmod, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const hooksDirectory = execFileSync("git", ["rev-parse", "--git-path", "hooks"], { encoding: "utf8" }).trim();
const hookPath = join(hooksDirectory, "pre-commit");
await copyFile(new URL("./pre-commit", import.meta.url), hookPath);
await chmod(hookPath, 0o755);
