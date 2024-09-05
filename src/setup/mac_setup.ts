import * as core from "@actions/core";
import * as toolCache from "@actions/tool-cache";
import path from "path";
import { getSemverSwiftVersion } from "../utils/version";

export async function mac_setup(swiftVersion: string) {
  const { platformName, pkgName } = await getPakage(swiftVersion);
  core.debug(`${platformName} ${pkgName}`);
  let toolPath = toolCache.find("swift", getSemverSwiftVersion(swiftVersion));
  if (!toolPath) {
    const url = await getDownloadURL(swiftVersion, platformName, pkgName);
    const { downloadPath } = await downloadSwift(url);
    const extractPath = await unpack(downloadPath, pkgName);
    toolPath = await toolCache.cacheDir(
      extractPath,
      "swift",
      getSemverSwiftVersion(swiftVersion),
    );
  }
  const binPath = `${toolPath}/usr/bin`;
  core.addPath(binPath);
  core.info(`Swift Installed`);
}

async function getPakage(swiftVersion: string) {
  const platformName = "xcode";
  const pkgName = `swift-${swiftVersion}-RELEASE-osx`;
  return { platformName: platformName, pkgName: pkgName };
}

async function getDownloadURL(
  swiftVersion: string,
  platformName: string,
  pkgName: string,
) {
  const url = `https://download.swift.org/swift-${swiftVersion}-release/${platformName}/swift-${swiftVersion}-RELEASE/${pkgName}.pkg`;
  return url;
}

async function downloadSwift(url: string) {
  const downloadPath = await toolCache.downloadTool(url);
  return { downloadPath: downloadPath };
}

async function unpack(downloadPath: string, pkgName: string) {
  const unpackedPath = await toolCache.extractXar(downloadPath);
  const extractPath = await toolCache.extractTar(
    path.join(unpackedPath, `${pkgName}-package.pkg`, "Payload"),
  );
  core.debug(`Extracted to ${extractPath}`);
  return extractPath;
}
