"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_X64 = exports.IS_AARCH64 = exports.IS_LINUX = exports.IS_MAC = exports.IS_WINDOWS = exports.ARCH = exports.PLATFORM = void 0;
exports.getLinuxOsRelease = getLinuxOsRelease;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
exports.PLATFORM = process.platform;
exports.ARCH = process.arch;
exports.IS_WINDOWS = process.platform === "win32";
exports.IS_MAC = process.platform === "darwin";
exports.IS_LINUX = process.platform === "linux";
exports.IS_AARCH64 = process.arch === "arm64";
exports.IS_X64 = process.arch === "x64";
async function getLinuxOsRelease() {
    if (!exports.IS_LINUX) {
        core.setFailed('This Faild is Logic Failures. Please Send Issue This Repository\'s Owner.');
    }
    const { stdout: osReleaseOut } = await exec.getExecOutput('cat', ['/etc/os-release']);
    const osRelease = osReleaseOut.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (typeof value === 'string') {
            acc[key] = value.replace(/"/g, '');
        }
        else {
            acc[key] = value;
        }
        return acc;
    }, {});
    return osRelease;
}
//# sourceMappingURL=platform.js.map