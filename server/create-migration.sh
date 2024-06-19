#!/bin/bash

# This script exists because I could not figure out how to append a positional
# argument to an NPM script and I also don't want to remember the migration
# directory path every time I need to create one. Hohhoijjaa.
npm run typeorm migration:create src/database/migrations/$1
