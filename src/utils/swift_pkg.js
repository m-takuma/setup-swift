import * as core from '@actions/core';
import {
    IS_MAC,
    IS_LINUX,
    IS_AARCH64,
    IS_X64
} from './os';


export async function get_swift_pkg_url(swift_version) {
    if (IS_MAC) {
        return `https://download.swift.org/swift-${swift_version}-release/xcode/swift-${swift_version}-RELEASE/swift-${swift_version}-RELEASE-osx.pkg`;
    }
    if (IS_LINUX) {
        return await get_swift_pkg_linux_url(swift_version);
    }
}

async function get_swift_pkg_linux_url(swift_version) {
    const options = {};
    options.listeners = {
        stdout: (data) => {
            myOutput += data.toString();
        },
        stderr: (data) => {
            myError += data.toString();
        }
    };
    const os_release = await exec.exec('cat', ['/etc/os-release'], options);
    const os_id = os_release.match(/ID="(.*)"/)[1];
    const os_version_id = os_release.match(/VERSION_ID="(.*)"/)[1];
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
    return `https://download.swift.org/swift-${swift_version}-release/${platform_name}/swift-${swift_version}-RELEASE/${pkg_name}`;
}