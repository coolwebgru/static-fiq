(function () {
    'use strict';

    var m = angular.module('NewsBlogCtrl', []);

    var newsBlogControllerFunction = function ($location, $rootScope, $scope, $route) {

        $scope.init = function () {
            $scope.watchNowFlag = true;

            if (!$rootScope.videoId) {
                $rootScope.videoId = 194855444;
            }

            $('html, body').animate({
                scrollTop: 0
            }, 500);
        };

        $scope.onSelectVideo = function(videoId) {
            console.log(videoId);
            $rootScope.videoId = videoId;
            $route.reload();
        }

        $scope.slides = [
            {
                id: 194855444,
                image: "images/video_194855444.png",
                content: "IQ's Lane on Markets"
            },
            {
                id: 193382729,
                image: "images/video_193382729.png",
                content: "IQ's Lane on best and worst sectors"
            },
            {
                id: 193387065,
                image: "images/video_193387065.png",
                content: "IQ's Lane US Market review"
            },
            {
                id: 200395322,
                image: "images/video_200395322.png",
                content: "IQ's Lane - IQ Strategy Session"
            },
            {
                id: 215897968,
                image: "images/video_215897968.png",
            },
            {
                id: 216063962,
                image: "images/video_216063962.png",
                content: "IQ's Lane on Markets"
            },
            {
                id: 193731952,
                image: "images/video_193731952.png",
            },
            {
                id: 193392712,
                image: "images/video_193392712.png",
            },
            {
                id: 193389545,
                image: "images/video_193389545.png",
            },
        ];

        // $scope.slides = [
        //     "images/video_216063962.png",
        //     "images/video_215897968.png",
        //     "images/video_200395322.png",
        //     "images/video_194855444.png",
        //     "images/video_193731952.png",
        //     "images/video_193392712.png",
        //     "images/video_193389545.png",
        //     "images/video_193387065.png",
        //     "images/video_193382729.png",
        // ];



        $scope.init();

    };

    m.controller('NewsBlogController', [
        "$location",
        "$rootScope",
        "$scope",
        "$route",
        newsBlogControllerFunction
    ]);
})();
