# Port Check

Quick port availability checker with health checks.

## Installation

```bash
cd port-check
npm install
```

## Usage

```bash
npm start check 3000
npm start health 3000
npm start batch 3000 3001 8080
```

## Commands

- `check <port>` - Check if port is available
- `health <port>` - Health check if port is responding
- `batch <ports...>` - Check multiple ports
