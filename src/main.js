const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

const is_windows = process.platform === "win32";
const is_mac = process.platform === "darwin";
const is_linux = process.platform === "linux";

function run () {
  if (is_mac) {
    console.log('Setting up Swift on macOS');
    core.debug('Setting up Swift on macOS');
    // macosの場合、シェルスクリプトを実行してOSバージョンを取得する
    let os_version = '';
    exec.exec('sw_vers', ['-productVersion'], {
      listeners: {
        stdout: (data) => {
          os_version += data.toString();
        }
      }
    }).then(() => {
      console.log('OS Version:', os_version);
      core.debug('OS Version:', os_version);
    });
  } else if (is_linux) {
    console.log('Setting up Swift on Linux');
    core.debug('Setting up Swift on Linux');
    // linuxの場合、シェルスクリプトを実行してOSバージョンとディストリビューションを取得する
    let os_version = '';
    let os_distribution = '';
    exec.exec('cat', ['/etc/os-release'], {
      listeners: {
        stdout: (data) => {
          const lines = data.toString().split('\n');
          for (const line of lines) {
            if (line.startsWith('VERSION_ID=')) {
              os_version = line.replace('VERSION_ID=', '').replace(/"/g, '');
            } else if (line.startsWith('ID=')) {
              os_distribution = line.replace('ID=', '').replace(/"/g, '');
            }
          }
        }
      }
    }).then(() => {
      console.log('OS Version:', os_version);
      console.log('OS Distribution:', os_distribution);
      core.debug('OS Version:', os_version);
      core.debug('OS Distribution:', os_distribution);
    });
  } else if (is_windows) {
    console.log('Setting up Swift on Windows');
    core.debug('Setting up Swift on Windows');
    // windowsの場合、エラーで終了する
    core.setFailed('Windows is not supported');
  }
}

run();