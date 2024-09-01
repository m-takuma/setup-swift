const tool_cache = require('@actions/tool-cache');
const core = require('@actions/core');

async function download_swift_on_mac(swift_version) {
    const url = `https://download.swift.org/swift-${swift_version}-release/xcode/swift-${swift_version}-RELEASE/swift-${swift_version}-RELEASE-osx.pkg`
    const pkg_path = await tool_cache.downloadTool(url);
    return pkg_path;
}

async function install_swift_on_mac(pkg_path) {
    const pkg_extracted_path = tool_cache.extractTar(pkg_path);
    core.addPath(`${pkg_extracted_path}/usr/bin`);
}

async function setup_swift_on_mac(swift_version) {
    const pkg_path = await download_swift_on_mac(swift_version);
    await install_swift_on_mac(pkg_path);
}

module.exports = {
    setup_swift_on_mac
};