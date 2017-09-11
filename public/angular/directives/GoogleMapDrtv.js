angular.module('GoogleMapDrtv', []).directive("appMap", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@",         // Map width in pixels.
            height: "@",        // Map height in pixels.
            zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@",     // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@",    // Whether to show a pan control on the map.
            zoomControl: "@",   // Whether to show a zoom control on the map.
            scaleControl: "@"   // Whether to show scale control on the map.
        },
        link: function (scope, element, attrs) {

            if (scope.width) element.width(scope.width);
            if (scope.height) element.height(scope.height);

            // get map options
            var options =
            {
                zoom: 14,
                center: new google.maps.LatLng(attrs.lat, attrs.lng),
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                scrollwheel: false,
                navigationControl: false,
                scaleControl: false,
                draggable: false,
                disableDoubleClickZoom: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // create the map
            map = new google.maps.Map(element[0], options);

            // update markers
            var infoWindow = new google.maps.InfoWindow();
            var loc = new google.maps.LatLng(42.325561, -71.252544);
            var mm = new google.maps.Marker({ position: loc, map: map, title: "IQ Headquarters" });
            mm.content = '<div class="infoWindowContent">' + 'IQ Headquarters' + '</div>';
            google.maps.event.addListener(mm, 'click', function(){
                infoWindow.setContent(mm.content);
                infoWindow.open(map, mm);
            });
                
            infoWindow.setContent(mm.content);
            infoWindow.open(map, mm);
        }
    };
});