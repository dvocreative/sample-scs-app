var AppComponentApp = M.createClass({

    getInitialState : function () {
        return {
            hash : this.props.state.get('hash')
        };
    },

    componentDidMount: function() {
        var self = this;
        this.props.state.subscribe('hash', function(){
            self.setState({hash : self.props.state.get('hash')});
        });
    },

    render : function() {

        return M.createElement("div", null, "My App - Current location: " + this.state.hash);

    }

});