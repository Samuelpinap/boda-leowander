#!/bin/sh
set -e

echo "===================="
echo "Container starting..."
echo "===================="
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "PORT: ${PORT:-3000}"
echo "HOSTNAME: ${HOSTNAME:-0.0.0.0}"
echo "NODE_ENV: ${NODE_ENV}"
echo "===================="
echo "Files in current directory:"
ls -la
echo "===================="
echo "Checking if server.js exists..."
if [ -f "server.js" ]; then
    echo "✓ server.js found"
else
    echo "✗ server.js NOT found!"
    exit 1
fi
echo "===================="
echo "Starting Next.js server..."
exec node server.js
