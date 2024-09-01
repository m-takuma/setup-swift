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
    // 改行文字で区切って配列にする。=で区切ってDictionaryにする。
    const os_release = stdout.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (typeof value === 'string') {
            // "を削除
            acc[key] = value.replace(/"/g, '');
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
    const os_id = os_release['ID'];
    const os_version_id = os_release['VERSION_ID']
    const arch = IS_AARCH64 ? '-aarch64' : '';
    core.debug(`os_id: ${os_id}`);
    core.debug(`os_version_id: ${os_version_id}`);
    core.debug(`arch: ${arch}`);
    let platform_name = '';
    let pkg_name = '';
    if (os_id === 'ubuntu') {
        if (['20.04', '22.04', '23.04', '24.04'].includes(os_version_id) || os_version_id === '18.04' && IS_X64) {
            platform_name = 'ubuntu' + os_version_id.replace('.', '') + arch;
            pkg_name = `swift-${swift_version}-RELEASE-${os_id}${os_version_id}`;
        } else {
            core.error(`Unsupported Ubuntu version ${os_version_id}`);
        }
    } else if (os_id === 'amzn' && os_version_id === '2') {
        platform_name = 'amazonlinux2' + arch;
        pkg_name = `swift-${swift_version}-RELEASE-${platform_name}`;
    } else if (os_id === 'amzn' && os_version_id === '2023') {
        platform_name = 'fedora39' + arch;
        pkg_name = `swift-${swift_version}-RELEASE-${platform_name}`;
    } else {
        core.error(`Unsupported OS ${os_id} ${os_version_id}`);
    }
    core.debug(`platform_name: ${platform_name}`);
    core.debug(`pkg_name: ${pkg_name}`);
    const url = `https://download.swift.org/swift-${swift_version}-release/${platform_name}/swift-${swift_version}-RELEASE/${pkg_name}.tar.gz`;
    core.info(`Swift package URL: ${url}`);
    return { url, pkg_name };
}

module.exports = {
    get_swift_pkg_url,
    get_swift_pkg_linux_url
};