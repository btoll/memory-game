# Memory Card Game

[![npm](https://img.shields.io/npm/v/memory-game.svg)](https://www.npmjs.com/package/memory-game)

Demo: https://benjamintoll.com/memory-game/

## Install and Build

```
$ git clone git@github.com:btoll/memory-game.git
$ cd memory-game
$ npm install
$ npm run build
```

This will run the `babel` and `browserify` packages to prepare this for the browser.  Everything is written to the `./build` directory.

Better yet, use `systemd-nspawn` as your container manager!

```
$ sudo systemd-nspawn --quiet --bind $(pwd):/build --machine npm-build
```

All that is needed to run the application is a web server that serves files out of a directory with the following structure:

```
./memory-game
├── index.html
└── build/

## Screenshots

![ScreenShot](https://raw.github.com/btoll/i/master/memory-game/memory_game.png)

## License

[GPLv3](COPYING)

## Author

Benjamin Toll

