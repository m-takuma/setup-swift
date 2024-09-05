import * as core from "@actions/core";
import * as runner from "src/utils/platform";
import * as exec from "@actions/exec";
import { linux_setup } from "./setup/linux_setup";
import { mac_setup } from "./setup/mac_setup";

export async function run() {
  try {
    const swiftVersion = core.getInput("swift-version");
    core.debug(`swiftVersion: ${swiftVersion}`);
    if (runner.IS_MAC) {
      await mac_setup(swiftVersion);
    } else if (runner.IS_LINUX) {
      await linux_setup(swiftVersion);
    } else if (runner.IS_WINDOWS) {
      core.setFailed(
        `not found OS {platform: ${runner.PLATFORM}, arch: ${runner.ARCH}}`,
      );
    } else {
      core.setFailed(
        `not found OS {platform: ${runner.PLATFORM}, arch: ${runner.ARCH}}`,
      );
    }
    const { stdout: swiftVersionOut } = await exec.getExecOutput("swift", [
      "--version",
    ]);
    const { stdout: swiftPathOut } = await exec.getExecOutput("which", [
      "swift",
    ]);
    core.debug(`swift-version: ${swiftVersionOut}`);
    core.debug(`swift-path: ${swiftPathOut}`);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
