app.factory('DataVis', function() {
	return {
		getRandHexColor: function () {
			return '#'+Math.floor(Math.random()*16777215).toString(16);
		},
		getLink: function(base_url) {
			console.log("hello there");
		}
	};
});