Skissa & Gissa (client)
=======================

[![Travis CI Build Status](https://travis-ci.org/lrc-se/bth-sg-client.svg?branch=master)](https://travis-ci.org/lrc-se/bth-sg-client)
[![Scrutinizer Build Status](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/build.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/?branch=master)
[![Scrutinizer Code Coverage](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/?branch=master)


This is the server part of a JavaScript-based re-implementation of the Swedish game **Skissa & Gissa**.

[Go to server](https://github.com/lrc-se/bth-sg-server)


Overview
--------

Skissa & Gissa is a classic game where contestants are given words to draw, while the other players try to guess what the word is. 
In this version of the game for the modern web, gameplay is handled by a central server offering one or more games ("game servers") 
for presumptive players to connect to, with (possibly) varying conditions, such as allotted time for drawing/guessing, number of players, and the wordlist used. 
Players connect through a client frontend in the form of a standalone webpage, in which they are given a graphical interface for drawing, chatting and guessing.


### Client structure

The S&G client is an HTML/JavaScript application using [Vue](https://vuejs.org/) as a frontend framework for constructing and updating the GUI, 
which in turn depends heavily on [webpack](https://webpack.js.org/), [Babel](https://babeljs.io/) and, underneath it all, [Node](https://nodejs.org/) 
to compile/transpile it into a distributable format. The client relies on an S&G server for initial data retrieval through a simple JSON-based API, 
and all subsequent gameplay-related communication is handled via Web Sockets using a custom, S&G-specific protocol (also JSON-based).

See the [technical discussion section](#technical-discussion) for more in-depth descriptions of the constituent parts.


#### Limitations

- Neither the client nor the server supports user identification, so high scores are only tied to nicknames repeat occurrences of which may or may not belong to the same person. 
  There is therefore also no guarantee that a specific person's favorite nickname is available at a specific time, since there is no way to restrict its use.
- The set of available drawing tools is fairly limited, but should offer sufficient possibilities to draw most if not all things encountered.
- The drawing panel does not include a general color picker, so the drawer is limited to a smallish set of predefined colors. Again, they should suffice most of the time to get the job done.
- Countdown resolution is whole seconds, which means that if a player connects between ticks, his or her *local* countdown will be out of sync with that of the server.
  In any event it is the server-side countdown that provides the *actual* timing governing game flow, so the local countdowns are always approximate.
- The client is not responsive and requires a certain screen size to be used properly. If necessary, use the browser's zoom function to compensate.
- The distribution-ready client application uses the Canvas and native Web Sockets features, which together put a lower limit on which browsers are able to run it.
  In development mode, ES6 syntax is heavily used -- including in the dependencies -- which in turn puts a lower limit on which versions of Node can be used for running/building the application.


### Server structure

See [server repo](https://github.com/lrc-se/bth-sg-server).


Installation
------------

Clone the repo and then proceed to install dependencies:

    npm install


Configuration
-------------

The default values used by the client application can be configured by editing the file *src/defaults.js*, 
which exports the following properties:

```javascript
{
    // default server address to display in connection panel
    // (can be either a string literal or an expression that evaluates to a string at runtime)
    server: String,
    
    // default server port to display in connection panel
    // (can be either a numerical literal or an expression that evaluates to a number at runtime)
    port: Number
}
```

This file also sets the global timeout for AJAX requests using the `axios` module, to ensure that API calls are terminated.

The *build* and *config* directories contain additional configuration files, 
but these are used by the development environment and are not part of the application per se.


Development
-----------

When all dependencies have been installed, the application can either be launched with webpack's development server, 
enabling so-called hot reload (recompilation and reintegration) of source files, or be built for production. 
The latter action will produce a distributable collection of static files in the *dist* directory, 
which can be uploaded to and served from any webhost.

```bash
# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


Tests
-----

A test suite using [Node Tap](http://www.node-tap.org/) is included, together with [ESLint](https://eslint.org/) for linting.

```bash
# run linter
npm run lint

# run test suite
npm run unit

# both of the above, in sequence
npm test
```


### Coverage

The standard test commands will generate a coverage report in HTML format in *build/coverage*. To get a Clover report instead, run:

    npm run unit-clover


Technical discussion
--------------------

TBD


About
-----

**Type:** School project @[BTH](https://www.bth.se/)  
**License:** MIT  
**Author:** [LRC](mailto:kabc16@student.bth.se)
