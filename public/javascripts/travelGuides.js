app.controller('TravelGuideCtrl', function ($scope, $resource, $routeParams) {
    var travelGuide = $resource(
        '/api/travelGuides/:id',
        {id: $routeParams.id},
        {query: {isArray: false}}
    );
    travelGuide.query(function (result) {
        $scope.travelGuide = result;
        var city = $resource(
		        '/api/cities/:id',
		        {id: $scope.travelGuide.city_id},
		        {query: {isArray: false}}
		    );
		    city.query(function (result){
		    	$scope.city = result;
		    })
		    var currentUser = UserApp.User.get({
    			"user_id": travelGuide.user_id,
				}, function(error, result){
    			$scope.user = result;
				});
    });
   
});

app.controller('AddTravelGuideCtrl', function($scope, $resource, $routeParams) {
	$scope.city_id = $routeParams.city_id;
	$scope.user_id = user.user_id;
	$scope.save = function(){
     var new_travel_guide = $resource('/api/travelGuides');
     new_travel_guide.city_id = $scope.city_id;
     new_travel_guide.user_id = $scope.user_id;
     new_travel_guide.save($scope.travel_guide, function(){
     		//$location.path('/');
     });
 };
});
