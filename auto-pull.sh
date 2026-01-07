#!/data/data/com.termux/files/usr/bin/bash

cd devspace-bot
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE"  ]; then
	echo "New commit detected. Pulling..."
	git pull origin main
else
	echo "No updates."
fi
