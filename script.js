// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map("map", {
  center: [-24.230000,-65.209000],
  zoom: 13
});

// Add base layer
L.tileLayer("https://api.mapbox.com/styles/v1/mp1986/ck9buiwb00fhn1jnsn23iw0gv/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXAxOTg2IiwiYSI6ImNrOHJ6ejJ4MDA2NHMzbXBnd3czMmR6bnQifQ.cVYcGefyij2JNxFyuhF28A", {
  maxZoom: 20
}).addTo(map);

//Initialize Carto
var client = new carto.Client({
  apiKey: "default_public",
  username: "mp1986"
});

// Initialze data source
var parkSource= new carto.source.SQL (
  "SELECT * FROM mp1986.copia_palpala_industrial"
);

// Create style for the data park layer
var parkStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #A60311;
  polygon-opacity: 0.9;
    
  [category = 'Neighborhood'] {
    polygon-fill: #F2D338;
    polygon-opacity: 0.7;
  }

	[category = 'Local Governmnet Authority']{
  polygon-fill: #F2D338;
  polygon-opacity: 0.9;
    }
}
`);

// Add style to the data
var parkLayer = new carto.layer.Layer (parkSource, 
  parkStyle);

// Initialze data source
var palpalaSource= new carto.source.SQL (
  "SELECT * FROM mp1986.palpala_shape"
);


// Add the Popups 
// // Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(parkSource, 
  parkStyle, {
  featureClickColumns: ['name', 'category', 'type', 'descriptio', 'addr_stree', 'park_name', 'image']
});

layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<div id= "popname">' + event.data['name'] + '</div>';
  content += '<div id="popcategory"> It is a ' + event.data['category'] + '</div>';
  content += '<div id="poptype">According to records: ' + event.data['type'] + '</div>';
  content += '<div id="popdecrip">' + event.data['descriptio'] + '</div>';
  content += '<div id="poppark">Located in ' + event.data['park_name'] + ',</div>';
  content += '<div id="popstreet">Address: ' + event.data['addr_stree'] + '</div>';
  
   // EB: only add image if it exists
  if (event.data['image']) {
    content += '<div id="popimage"><img src="' + event.data['image'] + '" /></div>'; // EB: put img url in an img tag
  }
  
  
// If you're not sure what data is available, log it out:
  console.log(event.data);
  
  var popup = L.popup();
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

// Add checkbox, two options: informationa available or no information available   
/*
 * A function that is called any time a checkbox changes
 */
function handleCheckboxChange() {
  // First we find every checkbox and store them in separate variables
  var infoCheckbox = document.querySelector('.info-available-checkbox');
  var noinfoCheckbox = document.querySelector('.no-info-available-checkbox');
  
  // Logging out to make sure we get the checkboxes correctly
  console.log('info-available:', infoCheckbox.checked);
  console.log('no-info-available:', noinfoCheckbox.checked);
  
  // Create an array of all of the values corresponding to checked boxes.
  // If a checkbox is checked, add that filter value to our array.
  var information = [];
  if (infoCheckbox.checked) {
    // For each of these we are adding single quotes around the strings,
    // this is because in the SQL query we want it to look like:
    //
    //   WHERE info_available IN ('Yes', 'No')
    //
    information.push("'Yes'");
  }
  if (noinfoCheckbox.checked) {
    information.push("'No'");
  }
  
  // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (information.length) {
    var sql = "SELECT * FROM mp1986.copia_palpala_industrial WHERE info_avail IN (" + information.join(',') + ")";
    console.log(sql);
    parkSource.setQuery(sql);
  }
  else {
    parkSource.setQuery("SELECT * FROM mp1986.copia_palpala_industrial");
  }
}


/*
 * Listen for changes on any checkbox
 */
var infoCheckbox = document.querySelector('.info-available-checkbox');
infoCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});
var noinfoCheckbox = document.querySelector('.no-info-available-checkbox');
noinfoCheckbox.addEventListener('change', function () {
  handleCheckboxChange();
});

// Add checkbox, five options, one for each park    
/*
 * A function that is called any time a checkbox changes
 */

function handleCheckboxChange2() {
  // First we find every checkbox and store them in separate variables
  var NoriaCheckbox = document.querySelector('.Noria-checkbox');
  //                                            
  var ZaplaCheckbox = document.querySelector('.Zapla-checkbox');
  //                                            
  var SnopekCheckbox = document.querySelector('.Snopek-checkbox');
  //                                            
  var BreteCheckbox = document.querySelector('.Brete-checkbox');
  //                                            
  var TorreCheckbox = document.querySelector('.La-Torre-checkbox');
  
    // Logging out to make sure we get the checkboxes correctly
  console.log('Noria:', NoriaCheckbox.checked);
  console.log('Zapla:', ZaplaCheckbox.checked);
  console.log('Snopek:', SnopekCheckbox.checked);
  console.log('Brete:', BreteCheckbox.checked);
  console.log('Torre:', TorreCheckbox.checked);
  
  // Create an array of all of the values corresponding to checked boxes.
  // If a checkbox is checked, add that filter value to our array.
  var parklocation = [];
  if (NoriaCheckbox.checked) {
    // For each of these we are adding single quotes around the strings,
    // this is because in the SQL query we want it to look like:
    //
    //   WHERE info_available IN ('Yes', 'No')
    //
    parklocation.push("'La Noria'");
  }
  if (ZaplaCheckbox.checked) {
    parklocation.push("'Parque Industrial Aceros Zapla'");
  }
  if (SnopekCheckbox.checked) {
    parklocation.push("'Parque Industrial Ing. Snopek'");
  }
   if (BreteCheckbox.checked) {
    parklocation.push("'Parque El Brete Forestal'");
  }
  if (TorreCheckbox.checked) {
    parklocation.push("'Alto La Torre'");
  }
  
    // If there are any values to filter on, do an SQL IN condition on those values,
  // otherwise select all features
  if (parklocation.length) {
    var sql = "SELECT * FROM mp1986.copia_palpala_industrial WHERE park_name IN (" + parklocation.join(',') + ")";
    console.log(sql);
    parkSource.setQuery(sql);
  }
  else {
    parkSource.setQuery("SELECT * FROM mp1986.copia_palpala_industrial");
  }
}

/*
 * Listen for changes on any checkbox
 */
var NoriaCheckbox = document.querySelector('.Noria-checkbox');
NoriaCheckbox.addEventListener('change', function () {
  handleCheckboxChange2();
});
var ZaplaCheckbox = document.querySelector('.Zapla-checkbox');
ZaplaCheckbox.addEventListener('change', function () {
  handleCheckboxChange2();
});
var SnopekCheckbox = document.querySelector('.Snopek-checkbox');
SnopekCheckbox.addEventListener('change', function () {
  handleCheckboxChange2();
});
var BreteCheckbox = document.querySelector('.Brete-checkbox');
BreteCheckbox.addEventListener('change', function () {
  handleCheckboxChange2();
});
var TorreCheckbox = document.querySelector('.La-Torre-checkbox');
TorreCheckbox.addEventListener('change', function () {
  handleCheckboxChange2();
});

