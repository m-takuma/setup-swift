const { get_swift_pkg } = require('./utils/swift_pkg');
const core = require('@actions/core');
const tool_cache = require('@actions/tool-cache');
const exec = require('@actions/exec');
const { verifySwift } = require('./utils/verify');

async function setup_swift_on_linux(swift_version) {
    const { url, pkg_name } = await get_swift_pkg(swift_version);
    let toolPath = tool_cache.find(pkg_name, swift_version);
    if (!toolPath) {
        const { pkg_path, signature_path } = await download_swift_on_linux(url);
        await verifySwift(pkg_path, signature_path);
        toolPath = await install_swift_on_linux(pkg_path, pkg_name, swift_version);
    }
    const binPath = `${toolPath}/${pkg_name}/usr/bin`;
    core.debug(`Adding ${binPath} to PATH`);
    core.addPath(binPath);
    core.info('Swift installed');
}

async function download_swift_on_linux(url) {
    core.debug(`Downloading Swift package from ${url}`);
    const pkg_path = await tool_cache.downloadTool(url);
    const signature_path = await tool_cache.downloadTool(`${url}.sig`);
    core.debug(`Downloaded Swift package to ${pkg_path}`);
    return { pkg_path, signature_path };
}

async function install_swift_on_linux(pkg_path, pkg_name, swift_version) {
    core.debug(`Installing Swift from ${pkg_path}`);
    const pkg_extracted_path = await tool_cache.extractTar(pkg_path);
    toolPath = await tool_cache.cacheDir(pkg_extracted_path, pkg_name, swift_version);
    core.debug(`Extracted Swift to ${pkg_extracted_path}`);
    core.debug(`Cached Swift to ${toolPath}`);
    return toolPath;
}

module.exports = {
    setup_swift_on_linux
};
