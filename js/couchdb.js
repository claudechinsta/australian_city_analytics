// let url = "http://admin:admin@130.56.251.115:5984/preprocess_tweets_db";
// let localJson = "melbStationsGeo.json";
//
// $.get(url+"/_all_docs?include_docs=true", function (data) {
//     let rows = data['rows'];
//     let features=[];
//     rows.forEach(function (item) {
//         let newFeat = {
//             "type": "Feature",
//             "properties": {
//                 "id": item['doc']['_id'],
//                 "sentiment": item['doc']['sentiment']
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": item['doc']['geometry']['coordinates']
//             }
//         };
//         features.push(newFeat);
//     });
//     let geoJson = {
//         "type": "FeatureCollection",
//         "features": features
//     };
// });