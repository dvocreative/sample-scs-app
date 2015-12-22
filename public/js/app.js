(function(
    root,
    _A,
    _M,
    _AppRouter,
    _SomeAPI
){

    var App = _A.define({
        api : {
            storeInitializer : function() {
                return M.createStore();
            },
            renderer : AppRender,
            runner : AppBootstrap
        },
        services : {
            router : _AppRouter,
            api : _SomeAPI
        }
    });

    root['App'] = App;

})(
    this,
    A,
    M,
    AppRouter,
    SomeAPI
);