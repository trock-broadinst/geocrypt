#!/bin/bash
npx playwright install
npx playwright install-deps
npx playwright test --update-snapshots