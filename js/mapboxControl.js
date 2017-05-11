/**
 * Created by boyachen on 28/4/17.
 * File Name:   mapboxControl.js
 * Author:      Claude Chen
 * Description: Initiate the map and handle events
 *
 */
let colorStops_source = [
    [-1,    '#040605'],
    [0,    "#f05bff"],
    [1,    '#ffe600'],
];
let colorStops_time = [
    [-1,    '#040605'],
    [0,    "#ff6a87"],
    [1,    '#ffda6c'],
    [2,    '#7fff57'],
    [3,    '#60ecff'],
    [4,    '#be72ff']
];
let colorStops_topics = [
    [-1,    '#040605'],
    [0,    "#ff6a87"],
    [1,    '#ffda6c'],
    [2,    '#7fff57'],
    [3,    '#60ecff']
];
let colorStops_sentiment = [
    [-1,    '#040605'],
    [0.5,    "#a1afa1"],
    [0.6,    "#6400ff"],
    [0.7,    "#ff5e52"],
    [0.8,    '#fcff4a'],
    [0.85,    '#ff3aef'],
    [0.9,    '#4dffa3'],
    [0.95,    '#007eff']
];
// let colorStops_sentiment = [
//     [-1,    '#040605'],
//     [0.5,    "#af0029"],
//     [0.6,    "#ff4d48"],
//     [0.7,    "#ff7b80"],
//     [0.8,    '#d1fcff'],
//     [0.85,    '#70d3ff'],
//     [0.9,    '#00aaff'],
//     [0.95,    '#007eff']
// ];

let layerList = ["layer_source", "layer_time", "layer_topics", "layer_sent"];

function init(map){

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    // map.scrollZoom.disable();
    map.on('mousemove', function (e) {
        document.getElementById('info').style.display = 'block';
        let lng = e.lngLat.lng.toFixed(4);
        let lat = e.lngLat.lat.toFixed(4);
        document.getElementById('info').innerHTML = "<h3>Analysis of Tweets in Victoria</h3>" +
            '<div> ------------------------------ </div>' +
            "<div>"+ lng + "\t" + lat +"</div>"
        // console.log(e)
    });
    map.on('load', function () {

        let boundList = {
            "sa2": {
                'url': "../data/victoria_sa2.json",
                'index': "SA2_MAIN11",
                'name': "SA2_NAME11"
            },
            "lga": {
                'url': "../data/victoria_lga.json",
                'aurin_index': "lga_code06",
                'bound_index': "LGA_CODE11",
                'bound_name': "LGA_NAME11",
                'aurin_name': "lga_name06"
            }
        };

        // Setting the url for the Topic 1
        let viewUrl = "http://admin:admin@130.56.249.106:8080/sa_lga_tweets_db/_design/view_tweets_activities_sa/_view/new-view?reduce=true&group=true";
        let aurinUrl = "http://130.56.249.106:8080/aurin_data_sa/_all_docs?include_docs=true&conflicts=true";
        let boundType = "sa2";
        let boundUrl = boundList[boundType]['url'];
        let boundIndex = boundList[boundType]['index'];
        let boundName = boundList[boundType]['name'];

        $.get(viewUrl, function (view) {
            $.get(aurinUrl, function (aurin_sa2) {
                $.getJSON(boundUrl, function (bound_features) {

                    // console.log(view_sent);
                    // console.log(view);
                    // console.log(bound_features);

                    // 1 - READ AND REFORMAT VIEW DATA
                    let viewObj = {};
                    let viewRows = view.rows;
                    viewRows.forEach(function (row) {
                        viewObj[row.key] = row.value;
                    });


                    // 2 - LOAD AURIN DATA
                    let aurinSa2Obj = {};
                    aurin_sa2.rows.forEach(function (row) {
                        aurinSa2Obj[row.doc.sa_code] = row.doc;
                    });
                    // console.log(aurinSa2Obj);

                    // Insert data from Other sources into the Boundaries Geojson
                    bound_features.forEach(function (feat) {
                        let code = feat['properties'][boundIndex];
                        // Get Value from View Data
                        // Insert View Data

                        // 'Source'
                        feat.properties['source_ins'] = viewObj.hasOwnProperty(code) ? viewObj[code].source['Instagram'] : null;
                        feat.properties['source_and'] = viewObj.hasOwnProperty(code) ? viewObj[code].source['Twitter for Android'] : null;
                        feat.properties['source_iph'] = viewObj.hasOwnProperty(code) ? viewObj[code].source['Twitter for iPhone'] : null;
                        feat.properties['source_a_i'] = feat.properties['source_and'] + feat.properties['source_iph'];
                        feat.properties['source_sum'] = viewObj.hasOwnProperty(code) ? getMaxIndex(
                            [feat.properties['source_ins'],feat.properties['source_a_i'] ]
                        ) : -1;

                        // 'Time'
                        feat.properties['time_5_10'] = viewObj.hasOwnProperty(code) ? viewObj[code].time['5 am - 10 am'] : null;
                        feat.properties['time_10_15'] = viewObj.hasOwnProperty(code) ? viewObj[code].time['10 am - 3 pm'] : null;
                        feat.properties['time_15_20'] = viewObj.hasOwnProperty(code) ? viewObj[code].time['3 pm - 8 pm'] : null;
                        feat.properties['time_8_0'] = viewObj.hasOwnProperty(code) ? viewObj[code].time['8 pm - 12 am'] : null;
                        feat.properties['time_0_5'] = viewObj.hasOwnProperty(code) ? viewObj[code].time['12 am - 5 am'] : null;
                        feat.properties['time_sum'] = viewObj.hasOwnProperty(code) ? getMaxIndex(
                            [feat.properties['time_5_10'], feat.properties['time_10_15'], feat.properties['time_15_20'],
                                feat.properties['time_8_0'], feat.properties['time_0_5']]
                        ) : -1;

                        // 'Topics'
                        feat.properties['topic_acc'] = viewObj.hasOwnProperty(code) ? viewObj[code].topics['accident'] : null;
                        feat.properties['topic_oth'] = viewObj.hasOwnProperty(code) ? viewObj[code].topics['others'] : null;
                        feat.properties['topic_par'] = viewObj.hasOwnProperty(code) ? viewObj[code].topics['party'] : null;
                        feat.properties['topic_tou'] = viewObj.hasOwnProperty(code) ? viewObj[code].topics['tourism'] : null;
                        feat.properties['topic_tra'] = viewObj.hasOwnProperty(code) ? viewObj[code].topics['transportation'] : null;
                        feat.properties['topic_sum'] = viewObj.hasOwnProperty(code) ? getMaxIndex(
                            [feat.properties['topic_acc'], feat.properties['topic_par'],
                                feat.properties['topic_tou'], feat.properties['topic_tra']]
                        ) : -1;

                        // 'Sentiment'
                        feat.properties['sent_pos'] = viewObj.hasOwnProperty(code) ? viewObj[code].sentiment.positive : null;
                        feat.properties['sent_neg'] = viewObj.hasOwnProperty(code) ? viewObj[code].sentiment.negative : null;
                        feat.properties['sent_sum'] = feat.properties['sent_pos']+feat.properties['sent_neg'] > 0 ? feat.properties['sent_pos']/(feat.properties['sent_pos']+feat.properties['sent_neg']) : -1;

                        // ----------------- AURIN DATA --------------------
                        feat.properties['aurin_cs'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Community Strength']['percentage'] : null;
                        //
                        feat.properties['aurin_da'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Deaths Australia'] : null;
                        //
                        feat.properties['aurin_lsi3g_lt60'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Life Satisfaction In 3 Groups']['< 60'] : null;
                        feat.properties['aurin_lsi3g_eq70'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Life Satisfaction In 3 Groups']['= 70'] : null;
                        feat.properties['aurin_lsi3g_gt80'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Life Satisfaction In 3 Groups']['> 80'] : null;
                        //
                        feat.properties['autin_mottwbs_bike'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Method Of Travel To Work By Sex']['bike'] : null;
                        feat.properties['autin_mottwbs_bus'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Method Of Travel To Work By Sex']['bus'] : null;
                        feat.properties['autin_mottwbs_car'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Method Of Travel To Work By Sex']['car'] : null;
                        //
                        feat.properties['aurin_rms'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Registered Marital Status']['married_percentage'] : null;
                        //
                        feat.properties['aurin_rwblt_lt200'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Rent Weekly By Landlord Type']['<200'] : null;
                        feat.properties['aurin_rwblt_200_450'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Rent Weekly By Landlord Type']['200~450'] : null;
                        feat.properties['aurin_rwblt_gt450'] = aurinSa2Obj.hasOwnProperty(code) ? aurinSa2Obj[code]['Rent Weekly By Landlord Type']['> 450'] : null;


                    });
                    // console.log(bound_features);

                    let layerList = ["layer_source", "layer_time", "layer_topics", "layer_sent"];


                    //////////////////////////////////////////////////
                    // Layer 1 "Sources of Tweets"
                    //////////////////////////////////////////////////
                    // Layer Name: topic1_source
                    map.addLayer({
                        'id': layerList[0],
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': bound_features
                            }
                        },
                        'layout': {
                            'visibility': 'visible',
                        },
                        'paint': {
                            // 'fill-color': 'rgba(20,150,0,0.8)',
                            'fill-color': {
                                property: 'source_sum',
                                type: 'categorical',
                                stops: colorStops_source
                            },
                            'fill-outline-color': '#232623',
                            'fill-opacity': 0.6
                        }
                    });

                    // Interaction Setting
                    map.on('mousemove', layerList[0], function (e) {
                        document.getElementById('info').style.display = 'block';
                        let feature = e.features[0];
                        let lng = e.lngLat.lng.toFixed(4);
                        let lat = e.lngLat.lat.toFixed(4);
                        document.getElementById('info').innerHTML = "<h4>"+feature.properties[boundName]+"</h4>" +
                            '<div> Instagram: ' + feature.properties['source_ins'] + " </div>" +
                            '<div> Android: ' + feature.properties['source_and'] + " </div>" +
                            '<div> iPhone: ' + feature.properties['source_iph'] + " </div>" +
                            '<div> iPhone&Android: ' + feature.properties['source_a_i'] + " </div>" +
                            '<div> ------------------------------ </div>' +
                            "<div>"+ lng + "\t" + lat +"</div>"
                        // console.log(e)
                    });
                    map.on('click', layerList[0], function (e) {
                        let feature = e.features[0];
                        let lng = e.lngLat.lng.toFixed(4);
                        let lat = e.lngLat.lat.toFixed(4);
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<h4>"+feature.properties[boundName]+"</h4>" +
                                '<div> ------------------------------ </div>' +
                                '<div><b> Community Strength: </b>' + feature.properties['aurin_cs'] + " %</div>" +
                                '<div><b> Death Rate: </b>' + feature.properties['aurin_da'] + " %</div>" +
                                '<h5>Life Satisfaction in 3 Groups</h5>' +
                                '<div><b> < 60: </b>' + feature.properties['aurin_lsi3g_lt60'] + " %</div>" +
                                '<div><b> = 70: </b>' + feature.properties['aurin_lsi3g_eq70'] + " %</div>" +
                                '<div><b> > 80: </b>' + feature.properties['aurin_lsi3g_gt80'] + " %</div>" +
                                '<h5>Method Of Travel To Work</h5>' +
                                '<div><b> bike: </b>' + feature.properties['autin_mottwbs_bike'] + " %</div>" +
                                '<div><b> bus: </b>' + feature.properties['autin_mottwbs_bus'] + " %</div>" +
                                '<div><b> car: </b>' + feature.properties['autin_mottwbs_car'] + " %</div>" +
                                '<div><h5> Registered Marital Rate: </h5>' + feature.properties['aurin_rms'] + " %</div>" +
                                '<h5>Weekly Rent</h5>' +
                                '<div><b> < $200: </b>' + feature.properties['aurin_rwblt_lt200'] + " %</div>" +
                                '<div><b> $200 ~ $450: </b>' + feature.properties['aurin_rwblt_200_450'] + " %</div>" +
                                '<div><b> > $450: </b>' + feature.properties['aurin_rwblt_gt450'] + " %</div>")
                            .addTo(map);
                    });
                    map.on('mouseout', layerList[0], function (e) {
                        document.getElementById('info').innerHTML = '';
                        document.getElementById('info').style.display = 'none';
                        // console.log(e)
                    });


                    //////////////////////////////////////////////////
                    // Layer 2 "Time of Tweets"
                    //////////////////////////////////////////////////
                    // Layer Name: topic1_source
                    map.addLayer({
                        'id': layerList[1],
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': bound_features
                            }
                        },
                        'layout': {
                            'visibility': 'none',
                        },
                        'paint': {
                            // 'fill-color': 'rgba(20,150,0,0.8)',
                            'fill-color': {
                                property: 'time_sum',
                                type: 'categorical',
                                stops: colorStops_time
                            },
                            'fill-outline-color': '#232623',
                            'fill-opacity': 0.6
                        }
                    });

                    // Interaction Setting
                    map.on('mousemove', layerList[1], function (e) {
                        document.getElementById('info').style.display = 'block';
                        let feature = e.features[0];
                        let lng = e.lngLat.lng.toFixed(4);
                        let lat = e.lngLat.lat.toFixed(4);
                        document.getElementById('info').innerHTML = "<h4>"+feature.properties[boundName]+"</h4>" +
                            '<div> 5 AM ~ 10 AM: ' + feature.properties['time_5_10'] + " </div>" +
                            '<div> 10 AM ~ 3 PM: ' + feature.properties['time_10_15'] + " </div>" +
                            '<div> 3 PM ~ 8 PM: ' + feature.properties['time_15_20'] + " </div>" +
                            '<div> 8 PM ~ 12 AM: ' + feature.properties['time_8_0'] + " </div>" +
                            '<div> 12 AM ~ 6 AM: ' + feature.properties['time_0_5'] + " </div>" +
                            '<div> ------------------------------ </div>' +
                            "<div>"+ lng + "\t" + lat +"</div>"
                        // console.log(e)
                    });
                    map.on('click', layerList[1], function (e) {
                        let feature = e.features[0];
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<h4>"+feature.properties[boundName]+"</h4>" +
                                '<div> ------------------------------ </div>' +
                                '<div><b> Community Strength: </b>' + feature.properties['aurin_cs'] + " %</div>" +
                                '<div><b> Death Rate: </b>' + feature.properties['aurin_da'] + " %</div>" +
                                '<h5>Life Satisfaction in 3 Groups</h5>' +
                                '<div><b> < 60: </b>' + feature.properties['aurin_lsi3g_lt60'] + " %</div>" +
                                '<div><b> = 70: </b>' + feature.properties['aurin_lsi3g_eq70'] + " %</div>" +
                                '<div><b> > 80: </b>' + feature.properties['aurin_lsi3g_gt80'] + " %</div>" +
                                '<h5>Method Of Travel To Work</h5>' +
                                '<div><b> bike: </b>' + feature.properties['autin_mottwbs_bike'] + " %</div>" +
                                '<div><b> bus: </b>' + feature.properties['autin_mottwbs_bus'] + " %</div>" +
                                '<div><b> car: </b>' + feature.properties['autin_mottwbs_car'] + " %</div>" +
                                '<div><h5> Registered Marital Rate: </h5>' + feature.properties['aurin_rms'] + " %</div>" +
                                '<h5>Weekly Rent</h5>' +
                                '<div><b> < $200: </b>' + feature.properties['aurin_rwblt_lt200'] + " %</div>" +
                                '<div><b> $200 ~ $450: </b>' + feature.properties['aurin_rwblt_200_450'] + " %</div>" +
                                '<div><b> > $450: </b>' + feature.properties['aurin_rwblt_gt450'] + " %</div>")
                            .addTo(map);
                    });
                    map.on('mouseout', layerList[1], function (e) {
                        document.getElementById('info').innerHTML = '';
                        document.getElementById('info').style.display = 'none';
                        // console.log(e)
                    });

                    //////////////////////////////////////////////////
                    // Layer 3 "Topics of Tweets"
                    //////////////////////////////////////////////////
                    // Layer Name: topic1_source
                    map.addLayer({
                        'id': layerList[2],
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': bound_features
                            }
                        },
                        'layout': {
                            'visibility': 'none',
                        },
                        'paint': {
                            // 'fill-color': 'rgba(20,150,0,0.8)',
                            'fill-color': {
                                property: 'topic_sum',
                                type: 'categorical',
                                stops: colorStops_topics
                            },
                            'fill-outline-color': '#232623',
                            'fill-opacity': 0.6
                        }
                    });

                    // Interaction Setting
                    map.on('mousemove', layerList[2], function (e) {
                        document.getElementById('info').style.display = 'block';
                        let feature = e.features[0];
                        let lng = e.lngLat.lng.toFixed(4);
                        let lat = e.lngLat.lat.toFixed(4);
                        document.getElementById('info').innerHTML = "<h4>"+feature.properties[boundName]+"</h4>" +
                            '<div> Accident: ' + feature.properties['topic_acc'] + " </div>" +
                            '<div> Party: ' + feature.properties['topic_par'] + " </div>" +
                            '<div> Tourism: ' + feature.properties['topic_tou'] + " </div>" +
                            '<div> Transportation: ' + feature.properties['topic_tra'] + " </div>" +
                            '<div> ------------------------------ </div>' +
                            "<div>"+ lng + "\t" + lat +"</div>"
                    });
                    map.on('click', layerList[2], function (e) {
                        let feature = e.features[0];
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<h4>"+feature.properties[boundName]+"</h4>" +
                                '<div> ------------------------------ </div>' +
                                '<div><b> Community Strength: </b>' + feature.properties['aurin_cs'] + " %</div>" +
                                '<div><b> Death Rate: </b>' + feature.properties['aurin_da'] + " %</div>" +
                                '<h5>Life Satisfaction in 3 Groups</h5>' +
                                '<div><b> < 60: </b>' + feature.properties['aurin_lsi3g_lt60'] + " %</div>" +
                                '<div><b> = 70: </b>' + feature.properties['aurin_lsi3g_eq70'] + " %</div>" +
                                '<div><b> > 80: </b>' + feature.properties['aurin_lsi3g_gt80'] + " %</div>" +
                                '<h5>Method Of Travel To Work</h5>' +
                                '<div><b> bike: </b>' + feature.properties['autin_mottwbs_bike'] + " %</div>" +
                                '<div><b> bus: </b>' + feature.properties['autin_mottwbs_bus'] + " %</div>" +
                                '<div><b> car: </b>' + feature.properties['autin_mottwbs_car'] + " %</div>" +
                                '<div><h5> Registered Marital Rate: </h5>' + feature.properties['aurin_rms'] + " %</div>" +
                                '<h5>Weekly Rent</h5>' +
                                '<div><b> < $200: </b>' + feature.properties['aurin_rwblt_lt200'] + " %</div>" +
                                '<div><b> $200 ~ $450: </b>' + feature.properties['aurin_rwblt_200_450'] + " %</div>" +
                                '<div><b> > $450: </b>' + feature.properties['aurin_rwblt_gt450'] + " %</div>")
                            .addTo(map);
                    });
                    map.on('mouseout', layerList[2], function (e) {
                        document.getElementById('info').innerHTML = '';
                        document.getElementById('info').style.display = 'none';
                        // console.log(e)
                    });
                    //////////////////////////////////////////////////
                    // Layer 4 "Sentiments of Tweets"
                    //////////////////////////////////////////////////
                    map.addLayer({
                        'id': layerList[3],
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': bound_features
                            }
                        },
                        'layout': {
                            'visibility': 'none',
                        },
                        'paint': {
                            // 'fill-color': 'rgba(20,150,0,0.8)',
                            'fill-color': {
                                property: 'sent_sum',
                                type: 'interval',
                                stops: colorStops_sentiment
                            },
                            'fill-outline-color': '#232623',
                            'fill-opacity': 0.6
                        }
                    });

                    // Interaction Setting
                    map.on('mousemove', layerList[3], function (e) {
                        document.getElementById('info').style.display = 'block';
                        let feature = e.features[0];
                        let lng = e.lngLat.lng.toFixed(4);
                        let lat = e.lngLat.lat.toFixed(4);
                        document.getElementById('info').innerHTML = "<h4>"+feature.properties[boundName]+"</h4>" +
                            '<div> Positive: ' + feature.properties['sent_pos'] + " </div>" +
                            '<div> Negative: ' + feature.properties['sent_neg'] + " </div>" +
                            '<div> Positive Ratio:'+feature.properties['sent_sum']+'</div>'+
                            '<div> ------------------------------ </div>' +
                            "<div>"+ lng + "\t" + lat +"</div>"
                    });
                    map.on('click', layerList[3], function (e) {
                        let feature = e.features[0];
                        new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML("<h4>"+feature.properties[boundName]+"</h4>" +
                                '<div> ------------------------------ </div>' +
                                '<div><b> Community Strength: </b>' + feature.properties['aurin_cs'] + " %</div>" +
                                '<div><b> Death Rate: </b>' + feature.properties['aurin_da'] + " %</div>" +
                                '<h5>Life Satisfaction in 3 Groups</h5>' +
                                '<div><b> < 60: </b>' + feature.properties['aurin_lsi3g_lt60'] + " %</div>" +
                                '<div><b> = 70: </b>' + feature.properties['aurin_lsi3g_eq70'] + " %</div>" +
                                '<div><b> > 80: </b>' + feature.properties['aurin_lsi3g_gt80'] + " %</div>" +
                                '<h5>Method Of Travel To Work</h5>' +
                                '<div><b> bike: </b>' + feature.properties['autin_mottwbs_bike'] + " %</div>" +
                                '<div><b> bus: </b>' + feature.properties['autin_mottwbs_bus'] + " %</div>" +
                                '<div><b> car: </b>' + feature.properties['autin_mottwbs_car'] + " %</div>" +
                                '<div><h5> Registered Marital Rate: </h5>' + feature.properties['aurin_rms'] + " %</div>" +
                                '<h5>Weekly Rent</h5>' +
                                '<div><b> < $200: </b>' + feature.properties['aurin_rwblt_lt200'] + " %</div>" +
                                '<div><b> $200 ~ $450: </b>' + feature.properties['aurin_rwblt_200_450'] + " %</div>" +
                                '<div><b> > $450: </b>' + feature.properties['aurin_rwblt_gt450'] + " %</div>")
                            .addTo(map);
                    });
                    map.on('mouseout', layerList[3], function (e) {
                        document.getElementById('info').innerHTML = '';
                        document.getElementById('info').style.display = 'none';
                        // console.log(e)
                    });


                });
            });
        });
    });

    // Display the legend
}

function getMaxIndex(list){
    return Math.max(...list) > 0 ? list.indexOf(Math.max(...list)) : -1
}

/*
 * Functions Definations
 *
 * */

function propertiesToHtml(properties, showList){
    let html = "";
    showList.forEach(function (item) {
        html += '<div> '+item+': ' + properties[item] + " </div>"
    });
    return html;
}

function cursorChange(layerID){
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', layerID, function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', layerID, function () {
        map.getCanvas().style.cursor = '';
    });
}

function toggleBound(flag){
    if(flag === 0){
        map.setLayoutProperty(layerList[0], 'visibility', 'visible');
        map.setLayoutProperty(layerList[1], 'visibility', 'none');
        map.setLayoutProperty(layerList[2], 'visibility', 'none');
        map.setLayoutProperty(layerList[3], 'visibility', 'none');
    }else if(flag === 1){
        map.setLayoutProperty(layerList[0], 'visibility', 'none');
        map.setLayoutProperty(layerList[1], 'visibility', 'visible');
        map.setLayoutProperty(layerList[2], 'visibility', 'none');
        map.setLayoutProperty(layerList[3], 'visibility', 'none');
    }else if(flag === 2){
        map.setLayoutProperty(layerList[0], 'visibility', 'none');
        map.setLayoutProperty(layerList[1], 'visibility', 'none');
        map.setLayoutProperty(layerList[2], 'visibility', 'visible');
        map.setLayoutProperty(layerList[3], 'visibility', 'none');
    }else{
        map.setLayoutProperty(layerList[0], 'visibility', 'none');
        map.setLayoutProperty(layerList[1], 'visibility', 'none');
        map.setLayoutProperty(layerList[2], 'visibility', 'none');
        map.setLayoutProperty(layerList[3], 'visibility', 'visible');
    }
    toggleLegend(flag);
}

function toggleLegend(flag){
    if(flag === 0){
        $(function() {
            // Handler for .ready() called.
            $(".legend").html("<h4>Major Source</h4>" +
                "<div><span style='background-color: "+colorStops_source[1][1]+"'></span>Instagram</div>"+
                "<div><span style='background-color: "+colorStops_source[2][1]+"'></span>Android*iPhone</div>");
        });
    }else if(flag === 1){
        $(function() {
            // Handler for .ready() called.
            $(".legend").html("<h4>Major Time</h4>" +
                "<div><span style='background-color: "+colorStops_time[1][1]+"'></span>5 AM ~ 10 AM</div>"+
                "<div><span style='background-color: "+colorStops_time[2][1]+"'></span>10 AM ~ 3 PM</div>"+
                "<div><span style='background-color: "+colorStops_time[3][1]+"'></span>3 PM ~ 8 PM</div>"+
                "<div><span style='background-color: "+colorStops_time[4][1]+"'></span>8 PM ~ 12 AM</div>"+
                "<div><span style='background-color: "+colorStops_time[5][1]+"'></span>12 AM ~ 5 AM</div>");
        });
    }else if(flag === 2){
        $(function() {
            // Handler for .ready() called.
            $(".legend").html("<h4>Major Topics</h4>" +
                "<div><span style='background-color: "+colorStops_topics[1][1]+"'></span>Accident</div>"+
                "<div><span style='background-color: "+colorStops_topics[2][1]+"'></span>Party</div>"+
                "<div><span style='background-color: "+colorStops_topics[3][1]+"'></span>Tourism</div>"+
                "<div><span style='background-color: "+colorStops_topics[4][1]+"'></span>Transportation</div>");
        });
    }else{
        $(function() {
            // Handler for .ready() called.
            $(".legend").html("<h4>Tweets Positve Rate</h4>" +
                "<div><span style='background-color: "+colorStops_sentiment[7][1]+"'></span>>95%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[6][1]+"'></span>90%~95%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[5][1]+"'></span>85%~90%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[4][1]+"'></span>80%~85%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[3][1]+"'></span>70%~80%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[2][1]+"'></span>60%~70%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[1][1]+"'></span>50%~60%</div>"+
                "<div><span style='background-color: "+colorStops_sentiment[0][1]+"'></span><50%</div>");
        });
    }
}

function flyIn() {
    map.flyTo({
        center: [144.9631, -37.8136],
        curve: 1.4,
        pitch: 30,
        duration: 2000,
        zoom: 10
    })
}

function flyOut() {
    map.flyTo({
        center: [145.2117, -36.7828],
        curve: 1.4,
        pitch: 0,
        duration: 2000,
        zoom: 6.5
    })
}
