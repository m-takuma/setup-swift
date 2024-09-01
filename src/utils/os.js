const IS_WINDOWS = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
const IS_LINUX = process.platform === "linux";
const IS_AARCH64 = process.arch === "arm64";
const IS_X64 = process.arch === "x64";

module.exports = {
    IS_WINDOWS,
    IS_MAC,
    IS_LINUX,
    IS_AARCH64,
    IS_X64
};