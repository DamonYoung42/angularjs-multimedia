//var app = angular.module("Multimedia", []);
var app = angular.module('Multimedia', []).config(function ($sceProvider) {
    $sceProvider.enabled(false);
});


    app.service('SearchiTunes', function ($http) {
        this.find = function (searchTerm) {
            return $http.jsonp('https://itunes.apple.com/search?term=' + formatCriteria(searchTerm) + '&media=music&callback=JSON_CALLBACK&limit=200');
        };
    });

    app.service('SearchYouTube', function ($http) {
        this.find = function (searchTerm) {
            return $http.jsonp('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&order=relevance&q=' + formatCriteria(searchTerm) + '&key=AIzaSyC9IcvsoIFHxGEkRcgGZWx48gDKmTe7muQ&callback=JSON_CALLBACK');
        };
    });



    app.controller('iTunesCtrl', function ($scope, SearchiTunes, SearchYouTube) {
        $scope.searchService = "iTunes";

        $scope.$watch('searchTerm', function () {
            $scope.callSearchiTunes($scope.searchTerm);
            $scope.callSearchYouTube($scope.searchTerm);
        });

        $scope.callSearchiTunes = function (searchTerm) {
            SearchiTunes.find(searchTerm).then(function (data) {
                //console.log('success', data);
                $scope.iTunesResults = data.data.results;
                $scope.iTunesCurPage = 0;
                $scope.iTunesPageSize = 10;
                $scope.iTunesNumberOfPages = function () {
                    return Math.ceil($scope.iTunesResults.length / $scope.iTunesPageSize);
                };

            });
        };

        $scope.callSearchYouTube = function (searchTerm) {
            SearchYouTube.find(searchTerm).then(function (data) {
                $scope.YouTubeResults = data.data.items;
                $scope.YouTubeCurPage = 0;
                $scope.YouTubePageSize = 10;
                $scope.YouTubeNumberOfPages = function () {
                    return Math.ceil($scope.YouTubeResults.length / $scope.YouTubePageSize);
                };
            });
        };
    });

    app.controller('YouTubeCtrl', function ($scope, SearchYouTube) {

        $scope.callSearchYouTube = function (searchTerm) {
            SearchYouTube.find(searchTerm).then(function (data) {
                //console.log('success', data);
                $scope.results = data.data.items;
                $scope.curPage = 0;
                $scope.pageSize = 10;
                $scope.numberOfPages = function () {
                    return Math.ceil($scope.results.length / $scope.pageSize);
                };
            });
        };  
    });

    app.filter('pagination', function() {
        return function (input, start) {
            if (!input || !input.length) { return; }
            start = +start;
            return input.slice(start);
        };
    });

function formatCriteria(criteria) {
    return criteria.trim().replace(/ /g, "+");
}


