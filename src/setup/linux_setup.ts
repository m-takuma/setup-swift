import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as toolCache from "@actions/tool-cache";
import * as runner from "../utils/platform";
import path from "path";

export async function linux_setup(swiftVersion: string) {
  const { platformName, pkgName } = await getPakage(swiftVersion);
  core.info(`${platformName} ${pkgName}`);
  let toolPath = toolCache.find(pkgName, swiftVersion);
  core.info(`toolPath: ${toolPath}`);
  if (!toolPath) {
    const { pkgURL, signatureURL } = await getDownloadURL(
      swiftVersion,
      platformName,
      pkgName,
    );
    core.info(`Downloading Swift from ${pkgURL}`);
    const { downloadPath, signaturePath } = await downloadSwift(
      pkgURL,
      signatureURL,
    );
    await verifySwift(downloadPath, signaturePath);
    const extractPath = await unpack(downloadPath, pkgName);
    toolPath = await toolCache.cacheDir(extractPath, pkgName, swiftVersion);
  }
  core.info(`Swift Installed at ${toolPath}`);
  const binPath = path.join(toolPath, pkgName, "/usr/bin");
  core.info(`Adding ${binPath} to PATH`);
  core.addPath(binPath);
  core.info(`Swift Installed`);
}

async function getPakage(swiftVersion: string) {
  const osRelease = await runner.getLinuxOsRelease();
  const os = osRelease["ID"];
  const osVersion = osRelease["VERSION_ID"];
  const arch_suffix = runner.IS_AARCH64 ? "-aarch64" : "";
  if (os === "amzn" && osVersion === "2") {
    const platformName = `amazonlinux${osVersion.replace(".", "")}${arch_suffix}`;
    const pkgName = `swift-${swiftVersion}-RELEASE-amazonlinux${osVersion}${arch_suffix}`;
    return { platformName: platformName, pkgName: pkgName };
  } else if (
    os === "ubuntu" ||
    os === "fedora" ||
    os === "debian" ||
    os === "centos"
  ) {
    const platformName = `${os}${osVersion.replace(".", "")}${arch_suffix}`;
    const pkgName = `swift-${swiftVersion}-RELEASE-${os}${osVersion}${arch_suffix}`;
    return { platformName: platformName, pkgName: pkgName };
  } else {
    throw new Error(`Unsupported OS: ${os} ${osVersion}`);
  }
}

async function getDownloadURL(
  swiftVersion: string,
  platformName: string,
  pkgName: string,
) {
  const base = `https://download.swift.org/swift-${swiftVersion}-release/${platformName}/swift-${swiftVersion}-RELEASE/${pkgName}`;
  const pkgURL = `${base}.tar.gz`;
  const signatureURL = `${pkgURL}.sig`;
  return { pkgURL: pkgURL, signatureURL: signatureURL };
}

async function downloadSwift(pkgURL: string, signatureURL: string) {
  const downloadPath = await toolCache.downloadTool(pkgURL);
  const signaturePath = await toolCache.downloadTool(signatureURL);
  return { downloadPath: downloadPath, signaturePath: signaturePath };
}

async function import_pgp_keys() {
  const keys_path = await toolCache.downloadTool(
    "https://swift.org/keys/all-keys.asc",
  );
  await exec.exec("gpg", ["--import", keys_path]);
}

async function refresh_keys() {
  // gpg --keyserver hkp://keyserver.ubuntu.com --refresh-keys Swift
  await exec.exec("gpg", [
    "--keyserver",
    "hkp://keyserver.ubuntu.com",
    "--refresh-keys",
    "Swift",
  ]);
}

async function verifySwift(pkgPath: string, signaturePath: string) {
  // Good signature example:
  // gpg: Good signature from "Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>"
  // THIS WARNING IS HARMLESS:
  // WARNING: This key is not certified with a trusted signature
  await import_pgp_keys();
  await refresh_keys();
  await exec.exec("gpg", ["--verify", signaturePath, pkgPath]);
}

async function unpack(pkgPath: string, pkgName: string) {
  const extractPath = await toolCache.extractTar(pkgPath);
  return extractPath;
}
