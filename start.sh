#!/bin/bash

echo -e "Starting backend"
./gradlew bootRun &
BACKEND_PID=$!

echo -e "Starting frontend"
cd liquidity-manager-ui
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "Press Ctrl+C to shutdown the service"

shutdown() {
    echo -e "Shutting down"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap shutdown INT TERM

wait