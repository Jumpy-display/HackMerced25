export function retrieveGeography(address) {
    return new Promise((resolve, reject) => {
        window.processData = function(myObj) {
            if (!myObj.result.addressMatches || myObj.result.addressMatches.length === 0) {
                console.log("This address was NOT found!");
                resolve(null);
                return;
            }

            let lookupName = "";
            const geo = myObj.result.addressMatches[0].geographies;
            let isUrban = geo.hasOwnProperty("Urban Areas");

            if (geo["Incorporated Places"] && geo["Incorporated Places"].length > 0) {
                lookupName = geo["Incorporated Places"][0].NAME;
                console.log(`It's a city: ${lookupName}`);
            } else if (geo["Census Designated Places"] && geo["Census Designated Places"].length > 0) {
                lookupName = geo["Census Designated Places"][0].NAME;
                console.log(`It's a CDP: ${lookupName}`);
            } else if (geo.Counties && geo.Counties.length > 0) {
                lookupName = geo.Counties[0].NAME;
                console.log(`Neither a city nor a CDP: ${lookupName}`);
            }

            resolve({ lookupName, isUrban });
        };

        let street = encodeURIComponent(address.street);
        let city = encodeURIComponent(address.city);
        let state = encodeURIComponent(address.state);
        let zipcode = encodeURIComponent(address.zipcode);

        let url = `https://geocoding.geo.census.gov/geocoder/geographies/address?street=${street}&city=${city}&state=${state}&zip=${zipcode}&benchmark=4&vintage=4&format=jsonp&callback=processData`;

        console.log(url);

        let script = document.createElement("script");
        script.src = url;
        script.id = "getAddress";

        document.head.appendChild(script);
        script.onload = () => document.head.removeChild(script);
    });
}
