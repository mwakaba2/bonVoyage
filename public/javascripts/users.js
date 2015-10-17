app.controller('UserCtrl', function ($scope, $routeParams, $location, user, UserApp) {
	user.getCurrent().then(function(currentUser) {
	    $scope.currentUser = currentUser;
	});

});

app.controller('EditUserCtrl', function ($scope, $routeParams, $location, user, UserApp) {
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
