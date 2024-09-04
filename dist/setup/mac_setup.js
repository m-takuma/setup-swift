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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.mac_setup = mac_setup;
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const path_1 = __importDefault(require("path"));
async function mac_setup(swiftVersion) {
  const { platformName, pkgName } = await getPakage(swiftVersion);
  let toolPath = toolCache.find(pkgName, swiftVersion);
  if (!toolPath) {
    const url = await getDownloadURL(swiftVersion, platformName, pkgName);
    const { downloadPath } = await downloadSwift(url);
    const extractPath = await unpack(downloadPath, pkgName);
    toolPath = await toolCache.cacheDir(extractPath, pkgName, swiftVersion);
  }
  const binPath = `${toolPath}/usr/bin`;
  core.addPath(binPath);
  core.info(`Swift Installed`);
}
async function getPakage(swiftVersion) {
  const platformName = "xcode";
  const pkgName = `swift-${swiftVersion}-RELEASE-osx`;
  return { platformName: platformName, pkgName: pkgName };
}
async function getDownloadURL(swiftVersion, platformName, pkgName) {
  const url = `https://download.swift.org/swift-${swiftVersion}-release/${platformName}/swift-${swiftVersion}-RELEASE/${pkgName}.pkg`;
  return url;
}
async function downloadSwift(url) {
  const downloadPath = await toolCache.downloadTool(url);
  return { downloadPath: downloadPath };
}
async function unpack(downloadPath, pkgName) {
  const unpackedPath = await toolCache.extractXar(downloadPath);
  const extractPath = await toolCache.extractTar(
    path_1.default.join(unpackedPath, `${pkgName}-package.pkg`, "Payload"),
  );
  return extractPath;
}
//# sourceMappingURL=mac_setup.js.map
