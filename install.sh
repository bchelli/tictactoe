#!/bin/bash

# create folder
mkdir bchelli-tictactoe

# enter folder
cd bchelli-tictactoe

# clone the repository
git clone https://github.com/bchelli/tictactoe.git .

# install frontend dependencies
bower install

# open in a browser
open index.html
