var flipflop = (function() {
    var flops = {}
    
    var flop = function(name) {
        this._name = name
    }

    flop.prototype = {
        _actions: {},
        _accept: true,
        _state_events: {},
        _change: function() { return null },
        _state: {},
        _current_state: null,

        bind: function(action, func) {
            this._actions[action] = func

            return this
        },

        accept_events: function() {
            this._accept = true
        },

        reject_events: function() {
            this._accept = false
        },

        change: function(func) {
            this._change = func

            return this
        },

        on: function(state, func) {
            this._state_events[state] = func

            return this
        },

        init: function(state_data) {
            state_data = state_data || {}

            this._state = state_data

            var new_state = this._change.call(this._state)

            if(new_state == this._current_state) {
                return this
            }
            
            this._current_state = new_state
            
            if(!(new_state in this._state_events)) {
                return this
            }

            this._state_events[new_state].call(this._state)

            return this
        },

        trigger: function(action, data) {
            if(!this._accept) {
                return this
            }

            if(!(action in this._actions)) {
                return this
            }

            this._actions[action].call(this._state, data)

            var new_state = this._change.call(this._state)

            if(new_state == this._current_state) {
                return this
            }

            this._current_state = new_state
            
            if(!(new_state in this._state_events)) {
                return this
            }

            this._state_events[new_state].call(this._state)

            return this
        }
    }

    return function(name) {
        if(name in flops) {
            return flops[name]
        }

        flops[name] = new flop(name)

        return flops[name]
    }
})()
