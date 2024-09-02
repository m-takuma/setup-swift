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
  const swift_version = core.getInput('swift-version');
  if (IS_MAC) {
    core.info('Setting up Swift on macOS');
    core.debug('Setting up Swift on macOS');
    await setup_swift_on_mac(swift_version);
  } else if (IS_LINUX) {
    core.info('Setting up Swift on Linux');
    core.debug('Setting up Swift on Linux');
    await setup_swift_on_linux(swift_version);
  } else if (IS_WINDOWS) {
    core.debug('Setting up Swift on Windows');
    core.setFailed('Windows is not supported');
  } else {
    core.debug('Unsupported OS');
    core.setFailed('Unsupported OS');
  }
  const { stdout: swift_version_out } = await exec.getExecOutput('swift', ['--version']);
  const { stdout: which_swift_out } = await exec.getExecOutput('which', ['swift']);
  core.setOutput('swift-version', swift_version_out);
  core.info(`swift --version: ${swift_version_out}`);
  core.setOutput('swift-path', which_swift_out);
  core.info(`which swift: ${which_swift_out}`);
}

run();
