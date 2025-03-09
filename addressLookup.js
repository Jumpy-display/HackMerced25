//Please note that addresses should have at least TWO commas for this to work properly!
addr1 = "586 Breeze St, Merced, CA 95348";
addr2 = "140 Vía Vaqueros #9774, Martinez, CA 94553";
addr3 = "506 E Yosemite Ave, Manteca, CA 95336";
addr4 = "2300 Shore Gem Ave, Thermal, CA 92274";
addr5 = "One Apple Park Way, Cupertino, CA 95014";

/* We need to take the address and format it as so:
 * https://geocoding.geo.census.gov/geocoder/geographies/address?street=
 * 718%20710%20hwy%20395
 * &city=Standish
 * &state=CA
 * &zip=96128
 * &benchmark=4&vintage=4&format=json 
 */
 
function processData(myObj){
	
	//If the address is not found then simply return nothing.
	if(myObj.result.addressMatches == 0){
		console.log("This addess was NOT found!");
		return null;
	}
	
	//This is the name that will be put through the database!
	let lookupName = "";
	
	//This is the part of the JSONP file that includes the actually useful information
	let geo = myObj.result.addressMatches[0].geographies;
	
	//Check if the address is urban or not
	isUrban = false;
	if("Urban Areas" in geo){isUrban = true;}
	
	//Determine whether or not found address is a city, CDP or rural place
	if("Incorporated Places" in geo){ 
		lookupName = geo["Incorporated Places"][0].NAME;
		console.log(`It's a city: ${lookupName}`);
	}else if("Census Designated Places" in geo){
		lookupName = geo["Census Designated Places"][0].NAME;
		console.log(`It's a CDP: ${lookupName}`);
	}else{ //If it's neither a city or CDP then just use county data
		lookupName = geo.Counties[0].NAME;
		console.log(`Neither a city or CDP: ${lookupName}`);
	}
	
	console.log(`${lookupName} is urban? ${isUrban}`);
	
}


function retrieveGeography(address){
	//We split up our address for each comma and turn it into an array!
	//EXAMPLE: "555 Maple Aple St, Wagner, CA 95337"
	//data = ["555 Maple Aple St", " Wagner", " CA 95337"]
	let data = address.split(",");
	
	//Define our variables that will be used for our API request later
	let street = ""; let city = "";
	let state = "CA"; let zipCode = "";
	
	//List of symbols to not include in API request!
	//These symbols are valid for street addresses, but they'll
	//mess up the API request and aren't necessary to include at the moment.
	const doNotInclude = [".","'","-","#","@","%","&","/"]
	
	//Iterate through first string in array (street address)
	for(x of data[0]){
		if(x == " "){ //Spaces in the API request must be inputed as %20
			street += "%20";
		}else if(!doNotInclude.includes(x)){
			street += x;
		}
	}
	
	//Iterate through second string in array (city)
	for(x of data[1]){
		if(x == " "){
			city += "%20";
		}else{
			city += x;
		}
	}
	
	//Iterate through third string in array (State Code and Zip Code)
	let counter = 0; //The reason we have a counter is because charCodeAt() requires us to input an INDEX of a string
	for(x of data[2]){
		//We need to only parse through the numbers (we use ascii values) in this third string to get the zip code
		if(48 <= data[2].charCodeAt(counter) && data[2].charCodeAt(counter) <= 57){zipCode += x;}
		counter += 1;
	}
	
	let url = `https://geocoding.geo.census.gov/geocoder/geographies/address?street=${street}&city=${city}&state=${state}&zip=${zipCode}&benchmark=4&vintage=4&format=jsonp&callback=processData`;
	
	console.log(url);
	
	//Create JSONP element!
	let s = document.createElement("script");
	s.src = url; s.id = "getAddress"
	
	//Quickly run the API Call! We do this to actually GET the API request
	document.head.appendChild(s);
	//Delete the API Call! We do this to not clutter our <head> element with scripts
	document.getElementById(s.id).remove();
	
}

retrieveGeography(addr1);
retrieveGeography(addr2);
retrieveGeography(addr3);
retrieveGeography(addr4);
retrieveGeography(addr5);

