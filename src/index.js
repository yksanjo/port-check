#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const net = require('net');

const program = new Command();

program
  .name('port-check')
  .description('Quick port availability checker with health checks')
  .version('1.0.0');

/**
 * Check if port is available
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Check if port is responding
 */
function isPortResponding(port, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, '127.0.0.1');
  });
}

program
  .command('check')
  .description('Check if port is available')
  .argument('<port>', 'Port number')
  .action(async (port) => {
    const portNum = parseInt(port);
    const available = await isPortAvailable(portNum);
    
    if (available) {
      console.log(chalk.green(`✅ Port ${portNum} is available`));
    } else {
      console.log(chalk.red(`❌ Port ${portNum} is in use`));
    }
  });

program
  .command('health')
  .description('Health check - is port responding')
  .argument('<port>', 'Port number')
  .option('-t, --timeout <ms>', 'Timeout in milliseconds', '1000')
  .action(async (port, options) => {
    const portNum = parseInt(port);
    const responding = await isPortResponding(portNum, parseInt(options.timeout));
    
    if (responding) {
      console.log(chalk.green(`✅ Port ${portNum} is responding`));
    } else {
      console.log(chalk.red(`❌ Port ${portNum} is not responding`));
    }
  });

program
  .command('batch')
  .description('Check multiple ports')
  .argument('<ports...>', 'Port numbers')
  .action(async (ports) => {
    console.log(chalk.blue.bold('\n📊 Port Check Results\n'));
    
    for (const port of ports) {
      const portNum = parseInt(port);
      const available = await isPortAvailable(portNum);
      console.log(available 
        ? chalk.green(`  ${portNum}: ✅ Available`)
        : chalk.red(`  ${portNum}: ❌ In use`));
    }
    console.log();
  });

program.parse();
