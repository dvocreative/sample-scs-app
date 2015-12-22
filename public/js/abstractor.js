(function(
    root,
    _React,
    _ReactDOM,
    _GEDStore
){

    var M = {

        render : function(el, container) {
            _ReactDOM.render(el, container);
        },

        createClass : function(classDef) {
            return _React.createClass(classDef);
        },

        createElement : function() {
            return _React.createElement.apply(this, arguments);
        },

        createStore : function () {
            return new _GEDStore();
        }

    };

    root['M'] = M;

})(
    this,
    React,
    ReactDOM,
    GEDStore
);