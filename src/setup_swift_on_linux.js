const { get_swift_pkg_url } = require('./utils/swift_pkg');
const core = require('@actions/core');
const tool_cache = require('@actions/tool-cache');
const exec = require('@actions/exec');

async function setup_swift_on_linux(swift_version) {
    const { pkg_path, pkg_name } = await download_swift_on_linux(swift_version);
    await install_swift_on_linux(pkg_path, pkg_name, swift_version);
}

async function download_swift_on_linux(swift_version) {
    const { url, pkg_name } = await get_swift_pkg_url(swift_version);
    core.info(`Downloading Swift package from ${url}`);
    const pkg_path = await tool_cache.downloadTool(url);
    core.info(`Downloaded Swift package to ${pkg_path}`);
    return { pkg_path, pkg_name };
}

async function install_swift_on_linux(pkg_path, package_name, swift_version) {
    core.info(`Installing Swift from ${pkg_path}`);
    const pkg_extracted_path = await tool_cache.extractTar(pkg_path);
    core.info(`Extracted Swift to ${pkg_extracted_path}`);
    const {stdout} = await exec.getExecOutput('ll', [`${pkg_extracted_path}/`]);
    core.info(`stdout: ${stdout}`);
    core.addPath(`${pkg_extracted_path}/${package_name}/usr/bin`);
    core.info('Swift installed');
}

module.exports = {
    setup_swift_on_linux
};
