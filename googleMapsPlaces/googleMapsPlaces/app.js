const axios = require('axios')
let response;

exports.lambdaHandler = async (event, context) => {
    //Get Variables from Events 
    let p = JSON.parse(event.body);
    let googleAPIKey = p["googleAPIKey"];
    let query = p["query"]; 

    //Initalize payload 
    payload = {
        "results":[]
    }


    try {
        //GET request

            let getIssues = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleAPIKey}`, {
                 params: {},
                 headers: { 
                 }
               }).then(function (response) {

                resultsReturned = response.data.results.length

                if (resultsReturned < 6){
                    resultsReturned = response.data.results.length
                }else if(resultsReturned = 0){
                    console.log("NO RESULTS")
                }else{
                    resultsReturned = 5
                }

                let i;
                for (i = 0; i < resultsReturned; i++) {
                    result = {}
                    //Only return the nodes that are used by Helpshift
                    result.name = response.data.results[i].name;
                    result.address = response.data.results[i].formatted_address;
                    result.place_id = response.data.results[i].place_id;
                    result.location = `${response.data.results[i].geometry.location.lat},${response.data.results[i].geometry.location.lng}`
                    result.streetaddress = response.data.results[i].formatted_address.split(',')[0];
                    //Add result to payload
                    payload.results.push(result);  
            }
          })
          .catch(function (error) {
            console.log("-----ERROR-----")
            console.log(error);
          });

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                payload
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
