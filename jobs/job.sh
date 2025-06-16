#!/bin/bash
# Simulate success or failure (exit code 0 or 1)
sleep 2
RAND=$((RANDOM % 2))
exit $RAND
