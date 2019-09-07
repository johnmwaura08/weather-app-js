//lets first get the longitude and latitude from our location
window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree')
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature-section');
    const temperatureSpan = document.querySelector('.temperature-section span');


    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            //lets dry darksky.net for a free api that we'll use to get our weather
            //the latitude and longitude are the last 2 sections of the numbers
            //darksky wont allow us to use the api on the local machine (cors issue )so we need a proxy that will then allow us to make request from the local host

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/3db0df06768e08ad622e142e77c74cdb/${lat},${long}`;



            fetch(api)    //after it gets the information, then it does something with the data..we only run the information after you get the data
                .then(response => {
                    return response.json(); //converting into json to easily use it in javascript
                })
                .then(data => {//after it has made it to response , we now have another .then where we have the actual data
                    console.log(data);
                    const { temperature, summary, icon } = data.currently;
                    //set Dom elements from the api
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone;
                    
                    //formula for Celsius
                    let celsius = (temperature-32)* (5/9)

                    //set icon
                    setIcons(icon, document.querySelector('.icons'))


                    //we need to listen to an event so we can change btween celsius and farenheit
                    //change temperature to celsius
                        temperatureSection.addEventListener('click', ()=>{
                               if(temperatureSpan.textContent === 'F'){
                                    temperatureSpan.textContent = +'C' ;
                                    temperatureDegree.textContent = Math.floor(celsius);
                               } else {
                                   temperatureSpan.textContent ='F';
                                   temperatureDegree.textContent = temperature;
                               }
                        });

                })

        });

    }

    //we are using skycon 

    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: 'white' });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();// this will look for every line replace with underscore and uppercase it SO IT conforms to skycons naming
        skycons.play(); //to initiate it 
        return skycons.set(iconID, Skycons[currentIcon]); // so we can run it up there 
    }
});
