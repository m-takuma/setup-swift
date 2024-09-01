const { get_swift_pkg_url } = require('./utils/swift_pkg');
const core = require('@actions/core');
const tool_cache = require('@actions/tool-cache');

async function setup_swift_on_linux(swift_version) {
    const pkg_path = await download_swift_on_linux(swift_version);
    await install_swift_on_linux(pkg_path);
}

async function download_swift_on_linux(swift_version) {
    const url = await get_swift_pkg_url(swift_version);
    core.info(`Downloading Swift package from ${url}`);
    const pkg_path = tool_cache.downloadTool(url);
    core.info(`Downloaded Swift package to ${pkg_path}`);
    return pkg_path;
}

async function install_swift_on_linux(pkg_path) {
    core.info(`Installing Swift from ${pkg_path}`);
    const pkg_extracted_path = tool_cache.extractTar(pkg_path);
    core.info(`Extracted Swift to ${pkg_extracted_path}`);
    core.addPath(`${pkg_extracted_path}/usr/bin`);
    core.info('Swift installed');
}

module.exports = {
    setup_swift_on_linux
};
