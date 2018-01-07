Skissa & Gissa (client)
=======================

[![Travis CI Build Status](https://travis-ci.org/lrc-se/bth-sg-client.svg?branch=master)](https://travis-ci.org/lrc-se/bth-sg-client)
[![Scrutinizer Build Status](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/build.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/?branch=master)
[![Scrutinizer Code Coverage](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/lrc-se/bth-sg-client/?branch=master)


This is the client part of a JavaScript-based online re-implementation of the Swedish game **Skissa & Gissa**.

[Go to server](https://github.com/lrc-se/bth-sg-server)


Table of contents
-----------------

1. [**Overview**](#overview)
    - [Client structure](#client-structure)
        - [Limitations](#limitations)
    - [Server structure](#server-structure)
2. [**Installation**](#installation)
3. [**Configuration**](#configuration)
4. [**Development**](#development)
5. [**Testing**](#testing)
    - [Coverage](#coverage)
6. [**Technical discussion**](#technical-discussion)
    - [Framework](#framework)
    - [Architecture](#architecture)
        - [Components](#components)
        - [Event system](#event-system)
    - [Web Sockets](#web-sockets)
    - [Continuous integration services](#continuous-integration-services)
    - [Tests](#tests)
7. [**About**](#about)


Overview
--------

Skissa & Gissa is a classic game where contestants are given words to draw, while the other players try to guess what the word is. 
In this version of the game for the modern web, gameplay is handled by a central server offering one or more games ("game servers") 
for presumptive players to connect to, with (possibly) varying conditions, such as allotted time for drawing/guessing, number of players, and the wordlist used. 
Players connect through a client SPA in the form of a standalone webpage, in which they are given a graphical interface for drawing, chatting and guessing.

Note that all texts intended for players are in Swedish, even though English is used for all code, comments and internal log messages.


### Client structure

The S&G client is an HTML/JavaScript single-page application using [Vue](https://vuejs.org/) as a frontend framework for constructing and updating the GUI, 
which in turn depends heavily on [webpack](https://webpack.js.org/), [Babel](https://babeljs.io/) and, underneath it all, [Node](https://nodejs.org/) 
to compile/transpile it into a distributable format. The client relies on an S&G server for initial data retrieval through a simple JSON-based API, 
and all subsequent gameplay-related communication is handled via Web Sockets using a custom, S&G-specific protocol (also JSON-based).

See the [technical discussion section](#technical-discussion) for more in-depth descriptions of the constituent parts, and the separate 
[protocol specification](https://github.com/lrc-se/bth-sg-server/blob/master/protocol.md) in the server repo for more information on the protocol format.


#### Limitations

- Neither the client nor the server supports user identification, so high scores are only tied to nicknames repeat occurrences of which may or may not belong to the same person. 
  There is therefore also no guarantee that a specific person's favorite nickname is available at a specific time, since there is no way to restrict its use.

- The set of available drawing tools is fairly limited, but should offer sufficient possibilities to draw most if not all things encountered.

- The drawing panel does not include a general color picker, so the drawer is limited to a smallish set of predefined colors. Again, they should suffice most of the time to get the job done.

- Countdown resolution is whole seconds, which means that if a player connects between ticks, his or her *local* countdown will be out of sync with that of the server.
  In any event it is the server-side countdown that provides the *actual* timing governing game flow, so the local countdowns are always approximate.

- The standard browser alert and confirm dialogs currently employed are not very pretty and should be replaced by an in-application modal dialog component somewhere down the line.

- The client is not responsive and requires a certain screen size to be used properly; if necessary, use the browser's zoom function to compensate. 
  The drawing board is also based on mouse events, and therefore will not currently work on touch-only devices.

- The distribution-ready client application uses flexbox, HTML5 forms, Canvas and native Web Sockets features, which together put a lower limit on which browsers are able to run it.
  In development mode, ES6 syntax is heavily used – including in the dependencies – which in turn puts a lower limit on which versions of Node can be used for running, 
  building and testing the application.


### Server structure

See [server repo](https://github.com/lrc-se/bth-sg-server).


Installation
------------

Clone the repo and then proceed to install dependencies:

    npm install


Configuration
-------------

The default values used by the client application can be configured before building by editing the file *src/defaults.js*, 
which exports the following properties:

```javascript
{
    // default server address to display in connection panel
    // (can be either a string literal or an expression that evaluates to a string at runtime)
    server: String,
    
    // default server port to display in connection panel
    // (can be either a numerical literal or an expression that evaluates to a number at runtime)
    port: Number,
    
    // contact information to display in connection panel (optional)
    contact: {
        // title (optional)
        title: String,
        
        // e-mail address (optional)
        email: String,
        
        // website URL (optional)
        website: String
    }
}
```

This file also sets the global timeout for AJAX requests using the `axios` module, to ensure that API calls are terminated.

The *build* and *config* directories contain additional configuration files, 
but these are used by the development environment and are not part of the application per se.


Development
-----------

When all dependencies have been installed, the application can either be launched with webpack's development server, 
enabling so-called hot reload (recompilation and reintegration of source files), or be built for production. 
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


Testing
-------

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

The client application is wholly separate from its server counterpart and can be hosted on any web server, 
since it is a self-contained frontend entity that does not require any particular server features in its compiled form. 
At the same time there is nothing stopping a server owner to host and run the two applications together, but it is not *required* – 
any S&G client can connect to any S&G server, provided that the latter has enabled CORS when applicable.


### Framework

The client is enitrely built on the Vue frontend framework, which has been a very positive development experience. 
See the separate [Vue intro](./vue.md) for an extensive argument as to why this is so.


### Architecture

The client application is constructed around a central event dispatcher, a hierarchy of Vue components, 
and a couple of helper modules containing Canvas drawing functions and [default values](#configuration). 
A general, application-wide stylesheet is imported by the startup script, while component-specific style rules are distributed among the individual components.

#### Components

The presentational layer of the application is based entirely on Vue's single file components, which provide good encapsulation of component definition and behavior. 
Many of these components are themselves made up of other components, where the parent passes data down to its children through the use of tag attributes in the markup. 
In some cases – the drawing board, specifically – the parent also communicates directly with its descendants, 
triggering functionality on a *single* component instance which cannot be properly handled by the general event system described below.

In all cases except for direct Canvas manipulation, Vue's reactivity system is utilized in full, making GUI updates a breeze. 
The majority of visual changes are handled declaratively in the markup (e.g. selective rendering and the like), 
so that it is enough just to write to a registered data property to trigger a (partial) view redraw, 
which makes it very easy to perform such updates in response to the events outlined below.

#### Event system

At the heart of the application sits the `client` module, which is a `Vue` instance that serves as both the client-side Web Sockets listener and a central event bus. 
Specifically, it reacts to incoming protocol commands by emitting events that the components that make up the GUI handle however they see fit. 
This prevents tight two-way coupling between components without a parent-child relationship, as well as between the client module (backend) and the individual components (frontend), 
and facilitates separation of concerns. The client module need not be aware of what consequences its events have, or who (if anyone) listens to them in turn, 
and the GUI components can use the module to emit application-level events of their own, where the same conditions apply.

Taken together, this makes for a very simple architecture of loosely coupled components, where each constituent part is only directly responsible for its own state, 
and is very much in keeping with the asynchronous, event-driven nature of JavaScript.


### Web Sockets

The native Web Sockets API now available to browsers provides a perfect way for handling the realtime requirements of the game, 
completely removing the need for polling (long or otherwise) or other shaky push techniques. 
The client application needs to send and receive updates as soon as they occur – with regard to both drawing, chatting/guessing and game flow events – 
which the custom JSON protocol makes it easy to do in a uniform manner while still allowing the use of differing data formats *within* the payload. 
All in all, basing the game on Web Sockets has been very satisfactory.


### Continuous integration services

The client repo is tied to two external services: [Travis CI](https://travis-ci.com/), which handles automated tests with three different versions of Node, 
and [Scrutinizer](https://scrutinizer-ci.com/), which provides code quality analyses and code coverage stats. 
These services have been selected due to ease of use and provided functionality, plus the fact that both can use GitHub for login purposes, 
eliminating the need to register for yet another couple of online accounts. Scrutinizer also has the advantage that it can generate the code coverage report by itself, 
and does not require a connection with another service to do it.

Travis CI has mostly been rock solid and provides a simple way to ascertain that the application passes all tests, 
but at times its build process fails due to transient errors not related to the actual repo. Scrutinizer is the more valuable tool of the two, 
providing useful feedback for issues that may not directly impact the functioning of the code, but which are still to be considered bugs.

Still, Scrutinizer has a tendency to misfire at times, identifying issues which are not *actually* errors, but rather a result of the tool's not being aware of the larger picture – 
the implied presence of a browser environment, for example. There is also a blatant drawback for the S&G client specifically since only *.js* files are analyzed, 
thereby missing the Vue components entirely, which is a shame since large parts of the logic are located there. 
This appears to be a general limitation with other comparable services too, however, so it did not seem to be sufficient reason to leave Scrutinizer behind. 
Given these constraints, the code quality score awarded can only be described as highly sufficient.


### Tests

Node Tap has been chosen as the test runner for much the same reasons as the author of that tool outlines on its [start page](http://www.node-tap.org/), 
but this quote kind of says it all:

> *JavaScript tests should be JavaScript programs, not English-language poems with weird punctuation.*

It is also lightweight and quick and requires no external tools or transpilation, but can be augmented with things like custom assertion libraries if one wants to. 
Node Tap also comes with [Istanbul](https://istanbul.js.org/) (in the form of [`nyc`](https://www.npmjs.com/package/nyc)) included, 
so code coverage reporting is very simple to get up and running without any further ado.

The test cases rely on [`vue-test-utils`](https://vue-test-utils.vuejs.org/en/), together with its required dependencies, to provide a simple framework for mounting, 
mutating and verifying individual Vue components, facilitating things such as DOM traversal and simulated interactions without the need for a browser. 
As such, testing the simpler components in isolation is fairly easy, but things quickly get more complicated once the application-wide integrations begin to assert (NPI) themselves. 
As a consequence, only a subset of the components and application functions are covered by tests at this time, 
mostly because the time needed to produce a more extensive test suite has simply not been available.

The test environment has been set up *without* webpack, but *with* Babel, mostly because this was the simplest way to get it to work, but also to keep it as speedy as possible. 
This still requires a batch of setup code to handle the compilation of *.vue* files, but once in place it has worked rather well. Code coverage is a bit of hit and miss – 
the compilation steps seem to confuse the reporter somewhat, especially when it comes to `<style>` sections and files not under test, 
but the visualization of the main code paths and the values for branches, statements and functions appear to be correct. 
At least this is the case locally; Scrutinizer seems to get different ideas now and then, so its coverage reports should be taken with an even larger grain of salt.

It should also be mentioned that, in general, ensuring that all intended *functionality* is tested is more important than merely reaching a high coverage score. 
Just the fact that many or all *code paths* have been traversed does not necessarily mean that the application actually works as expected, 
since there are many, many possible combinations of internal state that may take much the same logic paths, 
but may equally well change the outcome depending on just what is contained in said state. In other words, 
high code coverage in tests in and of itself is not a guarantee for correct code and should not be taken as such – it's just a number.


About
-----

**Type:** School project @[BTH](https://www.bth.se/)  
**License:** CC-BY-NC-SA-4.0  
**Author:** [LRC](mailto:kabc16@student.bth.se)
