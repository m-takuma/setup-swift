"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.linux_setup = linux_setup;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const toolCache = __importStar(require("@actions/tool-cache"));
const runner = __importStar(require("../utils/platform"));
async function linux_setup(swiftVersion) {
  const { platformName, pkgName } = await getPakage(swiftVersion);
  let toolPath = toolCache.find(pkgName, swiftVersion);
  if (!toolPath) {
    const url = await getDownloadURL(swiftVersion, platformName, pkgName);
    const { downloadPath, signaturePath } = await downloadSwift(url);
    await verifySwift(downloadPath, signaturePath);
    const extractPath = await unpack(downloadPath, pkgName);
    toolPath = await toolCache.cacheDir(extractPath, pkgName, swiftVersion);
  }
  const binPath = `${toolPath}/usr/bin`;
  core.addPath(binPath);
  core.info(`Swift Installed`);
}
async function getPakage(swiftVersion) {
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
async function getDownloadURL(swiftVersion, platformName, pkgName) {
  const url = `https://download.swift.org/swift-${swiftVersion}-release/${platformName}/swift-${swiftVersion}-RELEASE/${pkgName}.tar.gz`;
  return url;
}
async function downloadSwift(url) {
  const downloadPath = await toolCache.downloadTool(url);
  const signaturePath = await toolCache.downloadTool(`${downloadPath}.sig`);
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
async function verifySwift(pkgPath, signaturePath) {
  // Good signature example:
  // gpg: Good signature from "Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>"
  // THIS WARNING IS HARMLESS:
  // WARNING: This key is not certified with a trusted signature
  await import_pgp_keys();
  await refresh_keys();
  await exec.exec("gpg", ["--verify", signaturePath, pkgPath]);
}
async function unpack(pkgPath, pkgName) {
  const extractPath = await toolCache.extractTar(pkgPath);
  return extractPath;
}
//# sourceMappingURL=linux_setup.js.map
