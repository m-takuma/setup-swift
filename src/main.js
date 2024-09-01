const { setup_swift_on_mac } = require('./setup_swift_on_mac');
const { setup_swift_on_linux } = require('./setup_swift_on_linux');
const {
  IS_WINDOWS,
  IS_MAC,
  IS_LINUX,
} = require('./utils/os');
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run () {
  core.info(`Platform: ${process.platform}`);
  core.info(`Arch: ${process.arch}`);
  core.info(`OS Release: ${process.release.name}`);
  core.info(`IS_WINDOWS: ${IS_WINDOWS}`);
  core.info(`IS_MAC: ${IS_MAC}`);
  core.info(`IS_LINUX: ${IS_LINUX}`);
  if (IS_MAC) {
    console.log('Setting up Swift on macOS');
    core.debug('Setting up Swift on macOS');
    setup_swift_on_mac('5.10.1');
  } else if (IS_LINUX) {
    console.log('Setting up Swift on Linux');
    core.debug('Setting up Swift on Linux');
    setup_swift_on_linux('5.10.1');
  } else if (IS_WINDOWS) {
    console.log('Setting up Swift on Windows');
    core.debug('Setting up Swift on Windows');
    core.setFailed('Windows is not supported');
  } else {
    core.info("ここに来ている")
    console.log('Unsupported OS');
    core.debug('Unsupported OS');
    core.setFailed('Unsupported OS');
  }
  // swift --version
  const {stdout} = await exec.getExecOutput('swift', ['--version']);
  core.info(stdout);
}


run();