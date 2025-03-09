import { useState } from "react";

window.processData = function(myObj) {
	//If the address is not found then simply return nothing.
    if (!myObj.result.addressMatches || myObj.result.addressMatches.length === 0) {
        console.log("This address was NOT found!");
        return null;
    }

	//This is the name that will be put through the database!
    let lookupName = "";

	//This is the part of the JSONP file that includes the actually useful information
    const geo = myObj.result.addressMatches[0].geographies;

	//Check if the address is urban or not
    let isUrban = geo.hasOwnProperty("Urban Areas");

	//Determine whether or not found address is a city, CDP or rural place
    if (geo["Incorporated Places"] && geo["Incorporated Places"].length > 0) {
        lookupName = geo["Incorporated Places"][0].NAME;
        console.log(`It's a city: ${lookupName}`);
    } else if (geo["Census Designated Places"] && geo["Census Designated Places"].length > 0) {
        lookupName = geo["Census Designated Places"][0].NAME;
        console.log(`It's a CDP: ${lookupName}`);
    } else if (geo.Counties && geo.Counties.length > 0) { //If it's neither a city or CDP then just use county data
        lookupName = geo.Counties[0].NAME;
        console.log(`Neither a city nor a CDP: ${lookupName}`);
    }

    return { lookupName, isUrban };
}

export function retrieveGeography(address) {
	let street = address.street.replaceAll(" ","%20");
	let city = address.city.replaceAll(" ","%20");
	let state = address.state.replaceAll(" ","");
	let zipcode = address.zipcode.replaceAll(" ","");

    // Construct the API URL
    let url = `https://geocoding.geo.census.gov/geocoder/geographies/address?street=${street}&city=${city}&state=${state}&zip=${zipcode}&benchmark=4&vintage=4&format=jsonp&callback=processData`;

    console.log(url);

	//Create JSONP element!
    let script = document.createElement("script");
    script.src = url;
    script.id = "getAddress";

	//Quickly run the API Call! We do this to actually GET the API request
    document.head.appendChild(script);
	//Delete the API Call! We do this to not clutter our <head> element with scripts
    script.onload = () => document.head.removeChild(script);
}