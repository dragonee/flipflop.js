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

<!-- vim: set tw=72: -->
