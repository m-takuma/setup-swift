import * as core from "@actions/core";
import * as exec from "@actions/exec";
export const PLATFORM = process.platform;
export const ARCH = process.arch;
export const IS_WINDOWS = process.platform === "win32";
export const IS_MAC = process.platform === "darwin";
export const IS_LINUX = process.platform === "linux";
export const IS_AARCH64 = process.arch === "arm64";
export const IS_X64 = process.arch === "x64";

export async function getLinuxOsRelease(): Promise<{ [key: string]: string }> {
  if (!IS_LINUX) {
    core.setFailed(
      "This Faild is Logic Failures. Please Send Issue This Repository's Owner.",
    );
  }
  const { stdout: osReleaseOut } = await exec.getExecOutput("cat", [
    "/etc/os-release",
  ]);
  const osRelease = osReleaseOut.split("\n").reduce(
    (acc, line) => {
      const [key, value] = line.split("=");
      if (typeof value === "string") {
        acc[key] = value.replace(/"/g, "");
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as { [key: string]: string },
  );
  return osRelease;
}
