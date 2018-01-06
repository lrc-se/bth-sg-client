The case for Vue
================


![Vue](https://vuejs.org/images/logo.png)

[Vue](https://vuejs.org/) is the modern JavaScript frontend framework of choice when it comes to efficient development of single-page applications. How so? Let's find out.


Table of contents
-----------------

1. [**Introduction**](#introduction)
2. [**Features**](#features)
    - [Components](#components)
        - [Templates](#templates)
            - [View state](#view-state)
            - [View logic](#view-logic)
        - [Single file components](#single-file-components)
        - [Lifecycle and events](#lifecycle-and-events)
    - [Reactivity and the DOM](#reactivity-and-the-dom)
    - [Lightweight](#lightweight)
    - [Development tools](#development-tools)
3. [**Comparison to other frameworks**](#comparison-to-other-frameworks)
    - [AngularJS](#angularjs)
    - [React](#react)
    - [Mithril](#mithril)
4. [**Summary**](#summary)


Introduction
------------

The JavaScript ecosystem has for several years been a seething mass of competing frameworks and libraries, 
and the term "framework fatigue" has been banded about more than once. As of this writing some of the dust seems to have settled, 
and a clear tendency can be seen among the giants: React has grown swiftly, while Angular has stagnated. 
This is not merely due to subjective tastes, but the cause can be sought in the features, limitations and workflow of these frameworks, 
and how they relate to user satisfaction in the long term.

Along, then, comes Vue, which sits somewhere in the middle between Angular and React in the aforementioned regards. But do we really need *another* new framework, 
now that the industry has finally taken some steps, however small, towards making up its mind? The answer, I submit, is "yes" – when this framework is Vue.


Features
--------

The architecture and use of Vue should be familiar to users of both React and AngularJS, as it shares significant features with both of them – 
by the creators' own admission. What Vue has done, however, is take the *good* parts of those frameworks, while leaving the less attractive parts behind, 
combining them into a new whole that is greater than the sum of its parts.


### Components

Central to Vue is the concept of *composable components*, which are self-contained view units with associated internal state and behavior. 
Under the hood all components are `Vue` object instances and can in turn contain other components. Conceptually, 
components can be regarded as *view models*.

#### Templates

Tied to each component is, usually, a *template*, which is basically HTML markup with Vue-specific extensions. 
For the top level the template can be defined in the main *.html* file, and for child components the choices are literal strings or the 
[single file component system](#single-file-components).

##### View state

A component can have internal data properties (defined in the component), external data properties (defined in markup when the component is included in a template), 
and computed data properties (return values of functions), which are in turn available to both the component's method as instance properties, 
and to the template as variables. This makes it easy to construct views, since these variables can be placed more or less anywhere in the regular markup – 
and if needed, the full power of JavaScript expressions is available as well.

###### Example

```html
<p id="name">My name is {{ firstName + " " + lastName }}. What's yours?</p>
```

```javascript
var name = new Vue({
    el: "#name",
    data: {
        firstName: "John",
        lastName: "Doe"
    }
});
```

##### View logic

Moreover, templates support *selective rendering*, allowing the developer to decide which parts of the view should be visible at a given time based on the view's state, 
as well as *declarative iteration* for simple rendering of collections. CSS classes and inline styles can also be bound to template elements based on said state, 
making it easy to achieve presentational control that responds to user (or backend) interaction, such as selecting an element in a list or marking a message as unread.

###### Example

```html
<div id="scores">
    <table v-if="players.length">
        <tr><th>Player</th><th>Score</th></tr>
        <tr v-for="player of players" :class="{ winner: player.winner }">
            <td>{{ player.name }}</td>
            <td>{{ player.score || "–" }}</td>
        </tr>
    </table>
    <p v-else>No scores to show</p>
</div>
```

```javascript
var scores = new Vue({
    el: "#scores",
    data: {
        players: [
            { name: "Jane Doe", score: 47, winner: true },
            { name: "John Doe", score: 42 }
        ]
    }
});
```


#### Single file components

Reusable components normally need to have their template defined in a string literal, which puts severe limits on things like readability and syntax highlighting. 
To solve this Vue offers *single file components*, which define the template, script *and* style parts of a components in – you guessed it – a single file. 
This does, however, require a build step where this *.vue* file is compiled into a form that Vue can use.

The main advantages to this approach include clear separation of the constituent parts of the component, with accurate syntax highlighting for them all, 
while maintaining encapsulation for the component as a whole. The result is an entity that is more easily handled, 
especially when the size and complexity of the application under development starts to grow.

The subsequent examples all use single file components with ES6 syntax, which the build step can easily handle with tools like [Babel](https://babeljs.io/).


#### Lifecycle and events

Components go through a number of stages as they are created, updated, destroyed and added to/removed from the actual DOM. 
These stages are called *lifecycle events* and can be hooked into by developers to, for example, perform setup tasks at creation time, 
or cleanup tasks at removal time.

All Vue instances, and therefore all components, are also event emitters in their own right, meaning that other components can listen to them. 
This is useful mainly for child-to-parent communication, where the parent component listens to events emitted by the child component and reacts accordingly. 
Vue also offers shorthands for native events, such as clicks and keypresses.

###### Example

__users.vue__

```html
<template>
    <div id="users">
        <h2>Select a user</h2>
        <user-list :users="users" @selected="selectUser"></user-list>
        <p>
            Selected user:
            <a :href="'mailto:' + selectedUser.email" v-if="selectedUser">{{ selectedUser.name }}</a>
            <em v-else>(none)</em>
        </p>
    </div>
</template>

<script>
    import UserList from "./user";
    
    export default {
        name: "app",
        components: { "user-list": UserList },
        data() {
            return {
                users: [
                    { name: "Jane Doe", email: "jane@doe.org" },
                    { name: "John Doe", email: "john@doe.org" }
                ],
                selectedUser: null
            };
        },
        methods: {
            selectUser(user) {
                this.selectedUser = user;
            }
        }
    };
</script>
```

__user-list.vue__

```html
<template>
    <ul id="user-list">
        <li v-for="user of users" :key="user.name" @click="select(user)">{{ user.name }}</li>
    </ul>
</template>

<script>
    export default {
        name: "user-list",
        props: ["users"],
        methods: {
            select(user) {
                this.$emit("selected", user);
            }
        }
    };
</script>
```


### Reactivity and the DOM

Vue maintains a virtual DOM that corresponds to the real one provided by the browser, 
which enables it to minimize costly UI updates by determining the minimum action required to carry out the desired change. 
In other words, updates are applied to the in-memory virtual DOM first, and only as a last step is the *actual* DOM manipulated as far down the node tree as possible. 
Technically, this is achieved by compiling the component templates into *render functions* which generate virtual DOM trees.

Another core feature of Vue is its *reactivity system*, which enables it to react to changes in data without the developer's having to trigger redraw functions manually. 
It does this by creating transparent getters and setters for all registered data attributes and properties of a component, 
through which it can detect changes and determine what effects – if any – they will have on the DOM.

The reactivity system extends to all occurrences of the involved objects, meaning that changes propagate through whatever connections the developer has set up, 
so that other parts of the component – or of other, linked components – that depend on the same object in some way or other are *also* updated, 
including in computed properties. In other words, developers can rest assured that if they expect that a change *should* propagate, it *will* propagate, 
without their having to do anything about it other than make sure the appropriate data property is updated – Vue will take care of the rest.

Taken together, these two features – the reactive virtual DOM – make for a very efficient platform for managing view state, 
with regard to both coding requirements (or lack thereof) and rendering speed in the browser (which has a high impact on user experience).

###### Example

__app.vue__

```html
<template>
    <div id="app">
        <h1>App</h1>
        <label>Username: <input type="text" v-model="username"></label>
        <user :name="username.trim()"></user>
    </div>
</template>

<script>
    import User from "./user";
    
    export default {
        name: "app",
        components: { user: User },
        data() {
            return { username: "" };
        }
    };
</script>
```

__user.vue__

```html
<template>
    <p v-if="name">
        Hello, <strong>{{ name }}</strong>!
        <span v-if="slug">Your URL-friendly name is <code>{{ slug }}</code>.</span>
        <span v-else>A URL-friendly name could not be generated from your username.</span>
    </p>
</template>

<script>
    export default {
        name: "user",
        props: ["name"],
        computed: {
            slug() {
                let slug = this.name.trim().toLowerCase().replace(/[^a-z0-9\-]/g, "-");
                return slug.replace(/-+/g, "-").replace(/(^-|-$)/g, "");
            }
        }
    };
</script>
```

Whenever the text in the input field changes, so does the text in the child component, including the derived slug version of the username – 
and if there is no text entered, the child component will not render anything at all. Note that this is all handled declaratively, 
completely without developer intervention at runtime.


### Lightweight

Vue is lean by design, the core library weighing in at a mere 30 kB minified and gzipped, and therefore loads and parses very quickly. 
This does, however, come at the cost of not including complementary services in the framework itself, such as AJAX support, 
which must be imported separately. On the other hand, this enables developers to put together their own framework from components they know and prefer, 
instead of having to rely on a predetermined, monolithic set of tools they may not need.


### Development tools

Vue can be included as-is in the browser, and templates can be compiled on the fly, which makes it very quick to get going completely without build tools. 
This does, however, limit the expressive power of the components, and most medium-to-large projects will end up using a development environment with support for single file components.

As previously mentioned such components require compilation, the setup of which is non-trivial, but luckily there exist [official tools](https://github.com/vuejs/vue-cli) 
for bootstrapping new applications. The resulting environment allows for automatic compilation and local serving with live reload on save, 
which make development considerably more efficient.


Comparison to other frameworks
------------------------------

Vue has many similarities with other JavaScript frontend frameworks out there, but there also exist clear differences – 
otherwise there would be no point in having it in the first place. Here is my take on some of them.


### AngularJS

AngularJS developers will recognize large parts of Vue's template syntax, but the underlying structure of Vue (and by extension of a Vue app) 
is drastically simpler than that of AnuglarJS (and AngularJS apps), with a much shallower and *shorter* learning curve. 
Vue also offers considerably better performance than AngularJS, due to both core design decisions and the existence of the virtual DOM.

AngularJS's so-called digest cycle can also be quite unpredictable, making it difficult to know just when the view has actually finished rendering and can be safely accessed – 
a problem which Vue's reactivity system neatly solves.

Vue is significantly smaller than AngularJS, but the latter also includes much more functionality out of the box, such as AJAX helpers and filters. 
Vue core also lacks AngularJS's simple file-based template system, but single file components are comparable (although they require an extra build step). 
Finally, there is an extensive collection of AngularJS add-ons available online, since the framework has been around for quite some time.


### React

The virtual DOM, reactivity system and composable components are concepts that are shared by React and Vue, so they are necessarily quite similar – but not identical. 
For example, a clear advantage of React is its large ecosystem and selection of existing components.

Vue embraces standard HTML and CSS in its template system, whereas React relies on JSX, which is actually just a syntactic layer upon plain JavaScript. 
This makes Vue templates simpler to read and write, especially in single file component form, 
and especially to developers who are more comfortable with presentational code than JavaScript as such. That said, Vue supports JSX too, just in case.

On a technical level, Vue provides simpler (and automatic) dependency management between components, making it potentially more performant when triggering redraws due to state changes – 
or at least removes the burden of implementing optimization checks from the developer. React also lacks a simple option to be used *without* a build step, 
whereas Vue can be leveraged as-is in a browser, and the latter is also somewhat smaller in size.

All in all, Vue puts up lower thresholds to get started, especially in migration projects where older, framework-less code is to be brought into a shiny new structure, 
since in many cases things only need to be *added* to the existing code rather than *transforming* it into a new format.


### Mithril

This minimal framework also relies on components and a virtual DOM created by render functions, but in its basic setup puts the requirement to write the latter on the developer. 
JSX can be brought in to help, but when not available one is left with no choice but to build one's templates programmatically. 
This is often very cumbersome, and readability is very low, especially to people from an HTML/CSS background. 
It also severely hampers separation of concerns as there is no actual *view* – there is just JavaScript.

Despite its small size, Mithril includes both AJAX support and routing, which Vue does not.


Summary
-------

This introduction has only scratched the surface of what Vue is capable of, and I suggest delving into [the official guide](https://vuejs.org/v2/guide/) 
for more in-depth information and examples.

That said, I hope that your appetite has been whetted and that if you're gearing up to build a frontend web application of any sort and are looking for a suitable framework, 
you will consider going with Vue. You won't regret it.


---

*// __[LRC](mailto:kabc16@student.bth.se)__*  
*January 2018*
