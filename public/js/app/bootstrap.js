(function(root){

    root['AppBootstrap'] = function() {

        var self = this,
            env = this.getEnvironmentService();

        self.setData('hash', env.root.location.hash);

        env.root.onhashchange = function() {
            self.setData('hash', env.root.location.hash);
        };

    };

})(this);