import { get_swift_pkg_url } from './utils/swift_pkg'
import * as core from '@actions/core';
import * as tool_cache from '@actions/tool-cache';

export async function setup_swift_on_linux(swift_version) {
    const pkg_path = await download_swift_on_linux(swift_version);
    return
    await install_swift_on_linux(pkg_path);
}

async function download_swift_on_linux(swift_version) {
    const url = await get_swift_pkg_url(swift_version);
    return
    const pkg_path = tool_cache.downloadTool(url);
    return pkg_path;
}

async function install_swift_on_linux(pkg_path) {
    const pkg_extracted_path = tool_cache.extractTar(pkg_path);
    core.addPath(`${pkg_extracted_path}/usr/bin`);
    return swift_path;
}

