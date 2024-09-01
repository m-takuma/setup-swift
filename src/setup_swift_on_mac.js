const tool_cache = require('@actions/tool-cache');

async function download_swift_on_mac(swift_version) {
    const url = `https://download.swift.org/swift-${swift_version}-release/xcode/swift-${swift_version}-RELEASE/swift-${swift_version}-RELEASE-osx.pkg`
    const pkg_path = await tool_cache.downloadTool(url);
    return pkg_path;
}

async function install_swift_on_mac(pkg_path) {
    const pkg_extracted_path = await tool_cache.extractTar(pkg_path);
    const pkg_extracted_path_bin = `${pkg_extracted_path}/usr/bin`;
    const swift_path = await tool_cache.cacheDir(pkg_extracted_path_bin, 'swift', '5.3.3');
    return swift_path;
}

export async function setup_swift_on_mac(swift_version) {
    return
    const pkg_path = await download_swift_on_mac(swift_version);
    const swift_path = await install_swift_on_mac(pkg_path);
    core.addPath(`${pkg_extracted_path}/usr/bin`);
    return swift_path;
}