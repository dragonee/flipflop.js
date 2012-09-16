# flipflop.js

flipflop.js is a middleware between your JS logic and GUI.

By reference to flip-flops in electronics, which are simple logic
circuits that have two stable states, flipflop.js gives you objects that
translate simple events into more-complex behaviours of your GUI
controls, with changes in their internal states.

## Example

The following is the example of a counter object. It has two states,
`empty` and `non-empty`, which are called when the flipflop reaches zero
and non-zero count.

In `empty` state, the flipflop disables an input button. In `non-empty`
state, it reenables the input button, allowing the form to be submitted.

```javascript
var initial_count = 0

flipflop('counter').bind('add', function() {
    this.count++
}).bind('remove', function() {
    this.count--
}).change(function() {
    if(this.count == 0) {
        return 'empty'
    }

    return 'non-empty'
}).on('empty', function() {
    $('input[type=submit]').prop('disabled', true)
}).on('non-empty', function() {
    $('input[type=submit']).prop('disabled', false)
}).init({
    count: initial_count
})
```

Application logic needs only to know how to trigger add and remove
events on the flipflop object, leaving state updates and its
consequences to the object itself.

```javascript
flipflop('counter').trigger('add')
flipflop('counter').trigger('remove')
```

Visually, the flipflop above could be described in the following
diagram:

               flipflop
            ______________
       add |              | non-empty
    -------| c++      c>0 |---------- enable input
           |              |
    remove |              | empty
    -------| c--     c==0 |---------- disable input
           |              |
           `--------------'

## Installation and configuration

To install flipflop.js just include it in your code.

After that, you will have access to the `flipflop()` function. This
function is the only reserved keyword by flipflop.js in the global
space.

To get a flipflop, call this function with a `key` parameter - it will
return an existing flipflop object or create it for you if it does not
exist.

```javascript
flipflop('key') // returns a default flip-flop object
```

New flipflop objects need to be configured. In most cases you need to
provide four things to a flipflop object.

### Callbacks

```javascript
flipflop('key').on('state', function() {})
```

The `on()' function allows you to specify a callback that will be called
when the flipflop will reach this state. Put here all changes that need
to be done in this state.

`this` for the callback function is an internal data object that is
used across all callback functions defined in a flipflop.

### Events

```javascript
flipflop('key').bind('event', function([data]) {})
flipflop('key').trigger('event'[, data])
```

The `bind()` function binds an event to the flipflop object. In this
function you change the `this` data object in any fashion.

The `trigger()` function triggers the event callback.

Optionally you can specify the data parameter where you can push custom
argument of any type to your callback.

### Change function

```javascript
flipflop('key').change(function([current_state]) {})
```

The `change()` function is called after every `trigger()` operation.
This function inspects the `this` data object and returns a string that
describes the state. If the state differs from the current
state, the callback defined by the `on()` function will be called. If
there is no callback for the new state, flipflop won't call any
function.

The optional parameter, `current_state` is a state name the flipflop
object is currently in. You can use it to create FSMs that depend on the
current state when choosing which state will be next.

### Initial data

```javascript
flipflop('key').init([data_object])
```

After setting all callbacks and the change function, call `init()` to
set the initial state of the flipflop. The optional `data_object` is
used to populate internal data object with initial values. After that,
it calls the `change()` function, sets the state and calls related
`on()` callback function.

You can call .init() any times you want, especially when reloading data
because of an exception or other condition in your underlying logic.

## Other functions

```javascript
flipflop('key').reject_events()
flipflop('key').accept_events()
```

If you need to temporarily drop all events passed to the flipflop, use
these two functions. This function affects only the `trigger()`
function, so the `init()` function can still update the state.

It comes in handy in time when your initialization logic triggers many
events and you don't want your GUI to recompute data every time a item
is added to the datastore.

Remember to re`init()` your flipflop after you start accepting events,
because the flipflop can have outdated information stored inside. 

<!-- vim: set tw=72: -->
