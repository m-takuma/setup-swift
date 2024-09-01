const  {
    IS_MAC,
    IS_LINUX,
    IS_AARCH64,
    IS_X64
} = require('./os');

const core = require('@actions/core');
const tool_cache = require('@actions/tool-cache');
const exec = require('@actions/exec');

async function get_swift_pkg_url(swift_version) {
    if (IS_MAC) {
        return `https://download.swift.org/swift-${swift_version}-release/xcode/swift-${swift_version}-RELEASE/swift-${swift_version}-RELEASE-osx.pkg`;
    }
    if (IS_LINUX) {
        return await get_swift_pkg_linux_url(swift_version);
    }
}

async function get_swift_pkg_linux_url(swift_version) {
    core.info('Getting Swift package URL for Linux');
    const { stdout } = await exec.getExecOutput('cat', ['/etc/os-release']);
    core.debug(`stdout: ${stdout}`);
    const os_release = stdout;
    const os_id = os_release.match(/^ID="(.*)"/);
    core.info(`os_id: ${os_id}`);
    const os_idTest = os_release.match(/\bID="(.*)"/);
    core.info(`os_idTest: ${os_idTest}`);
    const os_version_id = os_release.match(/VERSION_ID="(.*)"/);
    core.info(`os_version_id: ${os_version_id}`);
    core.setFailed('Failed to get OS information');
    const arch = IS_AARCH64 ? '-aarch64' : '';
    core.debug(`os_release: ${os_release}`);
    core.debug(`os_id: ${os_id}`);
    core.debug(`os_version_id: ${os_version_id}`);
    core.debug(`arch: ${arch}`);
    let platform_name = '';
    let pkg_name = '';
    if (os_id === 'ubuntu') {
        if (os_version_id in ['20.04', '22.04', '23.04', '24.04'] || os_version_id === '18.04' && IS_X64) {
            platform_name = 'ubuntu' + os_version_id.replace('.', '') + arch;
            pkg_name = `swift-${swift_version}-RELEASE-${os_id}${os_version_id}.tar.gz`;
        } else {
            core.error(`Unsupported Ubuntu version ${os_version_id}`);
        }
    } else if (os_id === 'amzn' && os_version_id === '2') {
        platform_name = 'amazonlinux2' + arch;
        pkg_name = `swift-${swift_version}-RELEASE-${platform_name}.tar.gz`;
    } else if (os_id === 'amzn' && os_version_id === '2023') {
        platform_name = 'fedora39' + arch;
        pkg_name = `swift-${swift_version}-RELEASE-${platform_name}.tar.gz`;
    } else {
        core.error(`Unsupported OS ${os_id} ${os_version_id}`);
    }
    core.debug(`platform_name: ${platform_name}`);
    core.debug(`pkg_name: ${pkg_name}`);
    const url = `https://download.swift.org/swift-${swift_version}-release/${platform_name}/swift-${swift_version}-RELEASE/${pkg_name}`;
    core.info(`Swift package URL: ${url}`);
    return url;
}

module.exports = {
    get_swift_pkg_url,
    get_swift_pkg_linux_url
};