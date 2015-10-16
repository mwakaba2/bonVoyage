app.controller('UserCtrl', function ($scope, $resource, $routeParams, $location, user, UserApp) {
	var currentUser = user.current;
	user.getCurrent().then(function(currentUser) {
	    $scope.currentUser = currentUser;
	});

});

app.controller('EditUserCtrl', function ($scope, $resource, $routeParams, $location, user, UserApp) {
	var currentUser = user.current;
	user.getCurrent().then(function(currentUser) {
	    $scope.currentUser = currentUser;
	});
	$scope.save = function () {
		UserApp.User.save({	
			"user_id": "self",
		    "properties": {
		        "about_me": {
		            "value": $scope.currentUser.properties['about_me'].value,
		            "override": true
		        }
		    }
		}, function(error, result){
	    	// Handle error/result
		});
		$location.path('/user');
	}
});
