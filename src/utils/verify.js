const core = require('@actions/core');
const exec = require('@actions/exec');
const tool_cache = require('@actions/tool-cache');


async function import_pgp_keys() {
    const keys_path = await tool_cache.downloadTool('https://swift.org/keys/all-keys.asc')
    await exec.exec('gpg', ['--import', keys_path]);
}

async function refresh_keys() {
    // gpg --keyserver hkp://keyserver.ubuntu.com --refresh-keys Swift
    await exec.exec('gpg', ['--keyserver', 'hkp://keyserver.ubuntu.com', '--refresh-keys', 'Swift']);
}

async function verifySwift(pkgPath, signaturePath) {
    // EXAMPLE
    // gpg --verify swift-<VERSION>-<PLATFORM>.tar.gz.sig
    //   ...
    //   gpg: Good signature from "Swift Automatic Signing Key #4 <swift-infrastructure@forums.swift.org>"
    await import_pgp_keys();
    await refresh_keys();
    await exec.exec('gpg', ['--verify', signaturePath]);
}

module.exports = {
    verifySwift
};