 // Get reference to submit button and age text field
 const startBtn = document.getElementById("start");
 const output = document.getElementById("output");

 // When the check button is clicked, run the checkAge function
 if(startBtn){
    startBtn.addEventListener("click", start);
 }

 function start() {
   if (!navigator.geolocation) {
     output.innerHTML = "The geolocation feature is not available in your browser.";
   } else {
     output.innerHTML = "Attempting to locate you&hellip;";
     navigator.geolocation.getCurrentPosition(gotPosition, gotError);
   }
 }

 function gotPosition(position) {
   if (position == null) {
     console.log("Null position");
     return;
   }
   console.log(position);

   output.innerHTML = `
 <p>Your position at ${new Date(position.timestamp).toUTCString()} was (${position.coords.latitude}, ${position.coords.longitude})</p>
 <p>This is accurate to ${position.coords.accuracy}m.</p>
 <iframe src="${mapsUrl(position.coords.latitude, position.coords.longitude)}"></iframe>
`;
 }

 function gotError(error) {
   switch (error.code) {
     case error.PERMISSION_DENIED:
       output.innerHTML = "You have declined permission to use geolocation.";
       break;
     case error.POSITION_UNAVAILABLE:
       output.innerHTML = "Unable to determine your position using geolocation.";
       break;
     case error.TIMEOUT:
       output.innerHTML = "Unable to determine your position using geolocation within a given duration of time.";
       break;
     case error.UNKNOWN_ERROR:
       output.innerHTML = "An unknown error occurred when using geolocation.";
       break;
   }
 }

 function mapsUrl(lat, lng) {
   // On a real page, you'd use the officially supported Google Maps Embed API which requires an API Key: https://developers.google.com/maps/documentation/embed/guide
   return `https://maps.google.com/maps?q=${lat},${lng}&Roadmap&z=16&ie=UTF8&iwloc=&output=embed`;
 }