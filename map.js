/*global google, $, console*/
(function () {
    "use strict";
    
    var url = "http://api.geonames.org/wikipediaSearch?maxRows=10&username=goodmorningtoyou&type=json",
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        }),
        bounds = new google.maps.LatLngBounds(),
        markers = [],
        infoWindow = new google.maps.InfoWindow({
            maxWidth: 200
        });
    
    
    /*function createmarker(loc, title, summary, wikipediaUrl) {
        var marker = new google.maps.Marker({
                position: loc,
                map: map,
                title: title,
                animation: google.maps.Animation.DROP
            });
       
        marker.addListener('click', function () {
            infoWindow.setContent(summary + '<br><a href="http://' + wikipediaUrl + '" target="_blank">wikipedia article</a>');
            infoWindow.open(map, marker);
            //marker.setAnimation(google.maps.Animation.BOUNCE);
        });
        
        
        
        markers.push(marker);
    }*/
    
    
    
    $("#search").click(function () {
        $.getJSON(url, {q: $('#data').val()}, function (allData) {
            allData.geonames.forEach(function (oneData) {
                var loc = new google.maps.LatLng(oneData.lat, oneData.lng),
                    picture,
                    html,
                    show = false,
                    marker = new google.maps.Marker({
                        position: loc,
                        map: map,
                        title: oneData.title,
                        animation: google.maps.Animation.DROP
                    });

                marker.addListener('click', function () {
                    infoWindow.setContent(oneData.summary + '<br><a href="http://' +
                                          oneData.wikipediaUrl + '" target="_blank">wikipedia article</a>');
                    infoWindow.open(map, marker);
                    //marker.setAnimation(google.maps.Animation.BOUNCE);
                });

                markers.push(marker);
    
                
                
                picture = oneData.thumbnailImg || "smile.jpg";
                html = '<li class="listedData">' + oneData.title + '<p>' + oneData.summary +
                    '<br> <img src="' + picture + '"> <a href="http://' + oneData.wikipediaUrl +
                    '" target="_blank">wikipedia article</a></p> </li>';
                
                $(html).appendTo($("#list ul")).click(function () {
                    map.panTo(loc);
                    map.setZoom(10);
                    
                    if (!show) {
                        $(this).find('p').slideDown('slow');
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        show = true;
                    } else {
                        $(this).find('p').slideUp('slow');
                        marker.setAnimation(null);
                        show = false;
                        map.fitBounds(bounds);
                    }
                });
                

                //createmarker(loc, oneData.title, oneData.summary, oneData.wikipediaUrl);
                
                bounds.extend(loc);
            });
            map.fitBounds(bounds);
        });
    });
    
    $("#clear").click(function () {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        $("#list ul").empty();
    });
    
    $('#sidebar').resizable({
        handles: 'e',
        resize: function (event, ui) {
            google.maps.event.trigger(map, 'resize');
        }
    });
    
}());
