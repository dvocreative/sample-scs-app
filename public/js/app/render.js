(function(root, _M){

    root['AppRender'] = function(container) {

        var el = _M.createElement(AppComponentApp, {
            state : this.getStore()
        });
        _M.render(el, container);

    };

})(this, M);