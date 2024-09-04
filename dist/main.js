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
exports.run = run;
const core = __importStar(require("@actions/core"));
const runner = __importStar(require("src/utils/platform"));
const exec = __importStar(require("@actions/exec"));
const linux_setup_1 = require("./setup/linux_setup");
const mac_setup_1 = require("./setup/mac_setup");
async function run() {
    try {
        const swiftVersion = core.getInput('swift-version');
        core.debug(`swiftVersion: ${swiftVersion}`);
        if (runner.IS_MAC) {
            await (0, mac_setup_1.mac_setup)(swiftVersion);
        }
        else if (runner.IS_LINUX) {
            await (0, linux_setup_1.linux_setup)(swiftVersion);
        }
        else if (runner.IS_WINDOWS) {
            core.setFailed(`not found OS {platform: ${runner.PLATFORM}, arch: ${runner.ARCH}}`);
        }
        else {
            core.setFailed(`not found OS {platform: ${runner.PLATFORM}, arch: ${runner.ARCH}}`);
        }
        const { stdout: swiftVersionOut } = await exec.getExecOutput('swift', ['--version']);
        core.debug(`swift-version: ${swiftVersionOut}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
//# sourceMappingURL=main.js.map