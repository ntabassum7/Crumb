const Client = require('ssh2').Client;
const scp2   = require('scp2');
const Node = require('./node');
const fs = require('fs');

class Remote extends Node {
    constructor(sshConfig,cwd,saver) {
        super();
        this.sshConfig = sshConfig;
        this.cwd = cwd;
        this.saver = saver;
    }

    async init()
    {
        await Remote.sshExec(`cd ${this.cwd} && mkdir -p ${this.saver.store}`, this.sshConfig, true);
    }

    name()
    {
        return `remote node: ${this.sshConfig.hostname}:${this.sshConfig.port}`;
    }

    async execute(step, id, verbose)
    {
        return Remote.sshExec(`cd ${this.cwd} && ${step} > ${this.saver.store}/${id}.crumb`, this.sshConfig, verbose);
    }

    static async sshExec (cmd, sshConfig, verbose) {
        return new Promise((resolve, reject) => {            
            var c = new Client();
            c
                .on('ready', function() {
                    c.exec(cmd, function(err, stream) {
                        if (err){
                            print.error(err);
                        }
                        stream
                            .on('close', function(code, signal) {
                                c.end();
                                resolve();
                            })
                            .on('data', function(data) {
                                if( verbose )
                                {
                                    console.log('STDOUT: ' + data);
                                }
                            })
                            .stderr.on('data', function(data) {
                                console.log('STDERR: ' + data);
                                reject();
                            });
                    });
                })
                .connect({
                    host: '127.0.0.1',
                    port: sshConfig.port,
                    username: sshConfig.user,
                    privateKey: fs.readFileSync(sshConfig.private_key)
                });
        });
    }

    static async copyFromHostToVM (src, dest, destSSHConfig, chmod_=true) {
        return new Promise((resolve, reject) => {
            scp2.scp(
                src,
                {
                    host: '127.0.0.1',
                    port: destSSHConfig.port,
                    username: destSSHConfig.user,
                    privateKey: fs.readFileSync(destSSHConfig.private_key, 'utf8'),
                    path: dest
                },
                async function(err) {
                    if (err) {
                        print.error(`Failed to configure ssh keys: ${err}`);
                        reject();
                    }
                    else {
                        if(chmod_) {
                            await Ssh.chmod(dest, destSSHConfig)
                        }
                        resolve();
                    }
                }
            );
        });
    }
}


module.exports = Remote;