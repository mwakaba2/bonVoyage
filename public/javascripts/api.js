app.factory("Api", function ($http) {
    return {
        test: function(param) {
            return "Hello, " + param;
        }
    };
});