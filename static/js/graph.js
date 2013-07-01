var chart; //global chart object
/**
 * Request data from the server, add it to the graph and set a timeout to request again
 */
var reading_count =0;

function requestData() {
    $.ajax({
        url: '/api/v1/reading/?node__name=primary_node&limit=20&order_by=-time&format=json',
        success: function(response) {
            var series = chart.series[0],
                shift = series.data.length > 5; // shift if the series is longer than 20
            response.objects.reverse();
            for(var i=0; i<response.objects.length; i++){
                var current = response.objects[i];
                var actual_point = {
                    x: (new Date(current.time)).getTime(),
                    y: current.temperature,
                };
                // add the point
                chart.series[0].addPoint(actual_point, true, shift);
            }
            var timestamp = response.objects[response.objects.length-1].time
            timestamp = encodeURI(timestamp);
            setTimeout(function (){subsequentRequests(timestamp)}, 3000);
        },
        cache: false
    });
    function subsequentRequests(timestamp){
        $.ajax({
            url: '/api/v1/reading/?node__name=primary_node&time__gt='+timestamp+'&format=json',
            success: function(response) {
                if(response.objects.length > 0){
                    var series = chart.series[0],
                        shift = series.data.length > 5; // shift if the series is longer than 20
                        for(var i=0; i<response.objects.length; i++){
                            var current = response.objects[i];
                            var actual_point = {
                                x: (new Date(current.time)).getTime(),
                                y: current.temperature,
                            };
                            // add the point
                            chart.series[0].addPoint(actual_point, true, shift);
                    }
                    var latestTimestamp = response.objects[response.objects.length-1].time
                    latestTimestamp = encodeURI(latestTimestamp);
                    setTimeout(function (){subsequentRequests(latestTimestamp)}, 4000);
                }else{
                    setTimeout(function (){subsequentRequests(timestamp)}, 4000);
                }
            },
            cache: false
        });
    }
}

$(document).ready(function() {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graph_container',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live temperature data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [{
            name: 'Temperature readings over time interval',
            data: []
        }]
    });
});
