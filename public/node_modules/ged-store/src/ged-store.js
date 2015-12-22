/*

DISCLAIMER: NOT FOR ENTERPRISE

The getter/setter is mindnumbingly inefficient and will surely bust your app
when the store gets large.

Future versions will address this, for now I don't care.

 */

(function(root, factory){

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root['GEDStore'] = factory();
    }

})(this, function() {

    var Store = function() {

        this._storage = {};
        this._subscriptions = {};

    };

    Store.prototype = {

        get : function(key) {
            var retVal = '';
            if (key) {
                if (this._storage[key] === '!ARR') {
                    retVal = [];
                    for (storageKey in this._storage) {
                        if (storageKey.indexOf(key) === 0) {
                            var sstr = storageKey.substr(key.length);
                            if (sstr.length) {
                                var parts = sstr.split('/');
                                if (parts.length === 2) {
                                    retVal.push(this.get(key + '/' + parts[1]));
                                }
                            }
                        }
                    }
                } else if (this._storage[key] === '!OBJ') {
                    retVal = {};
                    for (storageKey in this._storage) {
                        if (storageKey.indexOf(key) === 0) {
                            var sstr = storageKey.substr(key.length);
                            if (sstr.length) {
                                var parts = sstr.split('/');
                                if (parts.length === 2) {
                                    retVal[parts[1]] = this.get(key + '/' + parts[1]);
                                }
                            }
                        }
                    }
                } else {
                    retVal = this._storage[key];
                }
            }
            return retVal;
        },

        set : function(key, val) {

            if (Array.isArray(val)) {
                this._storage[key] = '!ARR';
                for (var i = 0; i < val.length; i++) {
                    this.add(key, val[i]);
                }
            } else if (typeof val === 'object' && typeof val !== 'null') {
                this._storage[key] = '!OBJ';
                for (objKey in val) {
                    if (val.hasOwnProperty(objKey)) {
                        this.set(key + '/' + objKey, val[objKey]);
                    }
                }
            } else {
                this._storage[key] = val;
            }

            this.dispatch(key);

        },

        unset : function(key) {
            delete this._storage[key];
        },

        stem : function(key) {
            return new StoreStem(key, this);
        },

        add : function(key, val) {
            if (this._storage[key] === '!ARR') {
                var maxKey = 0;
                for (storageKey in this._storage) {
                    var validCount = 0;
                    if (storageKey.indexOf(key) === 0) {
                        var sstr = storageKey.substr(key.length);
                        if (sstr.length) {
                            var parts = sstr.split('/');
                            if (parts[1]) {
                                maxKey = Math.max(maxKey, parseInt(parts[1]));
                                validCount++;
                            }
                        }
                    }
                }
                this.set(key + '/' + ((validCount > 0) ? (maxKey + 1) : maxKey), val);
            }
        },

        subscribe : function(key, cb) {
            if (!this._subscriptions[key]) {
                this._subscriptions[key] = [];
            }
            this._subscriptions[key].push(cb);
        },

        dispatch : function(key) {
            if (this._subscriptions[key]) {
                for (var i = 0; i < this._subscriptions[key].length; i++) {
                    this._subscriptions[key][i]();
                }
            }
        }

    };

    var StoreStem = function(baseKey, Store) {
        this._store = Store;
        this.baseKey = baseKey;
    };

    StoreStem.prototype = {
        _refineKey : function(key) {
            var rkey = '';
            if (key !== '' && typeof key !== 'undefined') {
                if (typeof key === 'string') {
                    var parts = key.split('/'),
                        newParts = [],
                        baseParts = this.baseKey.split('/');
                    if (parts.length > 0) {
                        var backAmt = 0;
                        for (var i = 0; i < parts.length; i++) {
                            if (parts[i] === '..') {
                                backAmt++;
                            } else {
                                newParts.push(parts[i]);
                            }
                        }
                        if (backAmt > 0 && backAmt <= baseParts.length) {
                            for (var i = 0; i < backAmt; i++) {
                                baseParts.pop();
                            }
                            rkey = baseParts.join('/') + ((baseParts.length > 0) ? '/' : '') + newParts.join('/');
                        } else {
                            rkey = this.baseKey + '/' + key;
                        }
                    } else {
                        rkey = this.baseKey + '/' + key;
                    }
                } else {
                    rkey = this.baseKey + '/' + key;
                }
            } else {
                rkey = this.baseKey;
            }
            return rkey;
        },
        get : function(key) {
            key = this._refineKey(key);
            return this._store.get.apply(this._store, [key]);
        },
        set : function(key, val) {
            key = this._refineKey(key);
            this._store.set.apply(this._store, [key, val]);
        },
        subscribe : function(key, cb) {
            key = this._refineKey(key);
            this._store.subscribe.apply(this._store, [key, cb]);
        },
        stem : function(key) {
            key = this._refineKey(key);
            return this._store.stem.apply(this._store, [key]);
        }
    };

    return Store;

});

