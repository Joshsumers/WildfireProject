////////////////WildFire Analysis////////////////
////////////////By Joshua Sumers/////////////////
////////////////Edited:11/15/2019/////////////////

//Set Imagery
var L5imagery = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
var L8imagery = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');

//set Fire Boundary
var Fire = ee.FeatureCollection('users/joshsumers1996/WildfireShapes/Bear_Trap');

//what is Fire name? This will be used in File name
var FireName = 'Bear_Trap'; //Avoid Spaces

//Set Fire Year
var Year = 1995;

//Export Images? Set This Parameter
var EXPORTNDVI = false; // Export NDVI
var EVIEXPORT = true; //Export EVI
var NBREXPORT = false; //Export NBR

//Map Indicies?
var MapNDVI = false; //Map NDVI
var MapEVI = false; //Map EVI
var MapNBR = false; //Map NBR

//Determine Base Data
var BYEARs = ee.Date(Year+'-04-01');
var BYEARe = ee.Date(Year+'-04-30');
//First Analysis Year (year after Fire)
var Year1s = ee.Date(Year+1+'-04-01');
var Year1e = ee.Date(Year+1+'-04-30');
//Second Analysis Year (five years after Fire)
var Year5s = ee.Date(Year+5+'-04-01');
var Year5e = ee.Date(Year+5+'-04-30');
//Third Analysis Year (10 years after Fire)
var Year10s = ee.Date(Year+10+'-04-01');
var Year10e = ee.Date(Year+10+'-04-30');
//Fourth Analysis Year (15 years after Fire)
var Year15s = ee.Date(Year+15+'-04-01');
var Year15e = ee.Date(Year+15+'-04-30');
//Fifth Analysis Year (20 Years after Fire)
var Year20s = ee.Date(Year+20+'-04-01');
var Year20e = ee.Date(Year+20+'-04-30');

//Confirm Imagery being used
if (Year+15 > 2013) {
  print('Year 15 is greater than 2013, using Landsat8 Data');
}
else
{
  print('Year 15 is not greater than 2013, using Landsat5 Data');
}
if (Year+20 > 2013) {
  print('Year 20 is greater than 2013, using Landsat8 Data');
}
else
{
  print('Year 20 is not greater than 2013, using Landsat5 Data');
}
//Acquire Base Imagery
var BImage = L5imagery.filterDate(BYEARs,BYEARe)
  .filterDate(BYEARs,BYEARe)
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 1 Imagery
var Image1= L5imagery
  .filter(ee.Filter.date(Year1s,Year1e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 5 Imagery
var Image5= L5imagery
  .filter(ee.Filter.date(Year5s,Year5e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 10 Imagery
var Image10= L5imagery
  .filter(ee.Filter.date(Year10s,Year10e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 15 Imagery
if (Year+15 > 2013) {
var Image15= L8imagery
  .filter(ee.Filter.date(Year15s,Year15e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
else {
var Image15= L5imagery
  .filter(ee.Filter.date(Year15s,Year15e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
//Acquire Year 20 Imagery
if (Year+20 > 2013){
var Image20= L8imagery
  .filter(ee.Filter.date(Year20s,Year20e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
else {
  var Image20= L5imagery
  .filter(ee.Filter.date(Year20s,Year20e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
}
//Calculate NDVI Function for Landsat 5
var CalcNDVI = function(image){
  var Ndvi = image.normalizedDifference(['B4','B3']).rename('NDVI');
  var INDVI = image.addBands(Ndvi);
  return INDVI;
}
//Calculate NDVI Function for Landsat 8
var CalcNDVIL8 = function(image){
  var Ndvi = image.normalizedDifference(['B5','B4']).rename('NDVI');
  var INDVIL8 = image.addBands(Ndvi);
  return INDVIL8;
}
//Calculate EVI for Landsat 5
var CalcEVI = function(image){
  var Evi = image.expression('2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1 ))', {
  'NIR' : image.select('B4').multiply(0.0001),
  'Red':image.select('B3').multiply(0.0001),
  'Blue':image.select('B1').multiply(0.0001)
  }).rename('EVI');
  var IEVI = image.addBands(Evi);
  return IEVI ;
}
//Calculate EVI for Landsat 8
var CalcEVIL8 = function(image){
  var Evi = image.expression('2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1 ))', {
  'NIR' : image.select('B5').multiply(0.0001),
  'Red':image.select('B4').multiply(0.0001),
  'Blue':image.select('B2').multiply(0.0001)
  }).rename('EVI');
  var IEVIL8 = image.addBands(Evi);
  return IEVIL8 ;
}
//Calculate NBR Function for Landsat 5
var CalcNBR = function(image){
  var Nbr = image.normalizedDifference(['B4','B7']).rename('NBR');
  var INBR = image.addBands(Nbr);
  return INBR ;
}
//Calculate NBR Function for Landsat 8
var CalcNBRL8 = function(image){
  var Nbr = image.normalizedDifference(['B5','B7']).rename('NBR');
  var INBRL8 = image.addBands(Nbr);
  return INBRL8 ;
}

//calculate base indicies
var MbNDVI = BImage.map(CalcNDVI).mean().select('NDVI');
var MbEVI = BImage.map(CalcEVI).mean().select('EVI');
var MbNBR = BImage.map(CalcNBR).mean().select('NBR');
//calculate year 1 indicies
var My1NDVI = Image1.map(CalcNDVI).mean().select('NDVI');
var My1EVI = Image1.map(CalcEVI).mean().select('EVI');
var My1NBR = Image1.map(CalcNBR).mean().select('NBR');
//calculate year 5 indicies
var My5NDVI = Image5.map(CalcNDVI).mean().select('NDVI');
var My5EVI = Image5.map(CalcEVI).mean().select('EVI');
var My5NBR = Image5.map(CalcNBR).mean().select('NBR');
//calculate year 10 indicies
var My10NDVI = Image10.map(CalcNDVI).mean().select('NDVI');
var My10EVI = Image10.map(CalcEVI).mean().select('EVI');
var My10NBR = Image10.map(CalcNBR).mean().select('NBR');
//calculate year 15 indicies
if (Year+15 > 2013) {
var My15NDVI = Image15.map(CalcNDVIL8).mean().select('NDVI');
var My15EVI = Image15.map(CalcEVIL8).mean().select('EVI');
var My15NBR = Image15.map(CalcNBRL8).mean().select('NBR');
}
else {
var My15NDVI = Image15.map(CalcNDVI).mean().select('NDVI');
var My15EVI = Image15.map(CalcEVI).mean().select('EVI');
var My15NBR = Image15.map(CalcNBR).mean().select('NBR');
}
//calculate year 20 indicies
if (Year+20 > 2013) {
var My20NDVI = Image20.map(CalcNDVIL8).mean().select('NDVI');
var My20EVI = Image20.map(CalcEVIL8).mean().select('EVI');
var My20NBR = Image20.map(CalcNBRL8).mean().select('NBR');
}
else {
var My20NDVI = Image20.map(CalcNDVI).mean().select('NDVI');
var My20EVI = Image20.map(CalcEVI).mean().select('EVI');
var My20NBR = Image20.map(CalcNBR).mean().select('NBR');
}
//calculate difference in NDVI between Base data and following analysis years
var Y1NDVID = My1NDVI.subtract(MbNDVI);
var Y5NDVID = My5NDVI.subtract(MbNDVI);
var Y10NDVID = My10NDVI.subtract(MbNDVI);
var Y15NDVID = My15NDVI.subtract(MbNDVI);
var Y20NDVID = My20NDVI.subtract(MbNDVI);
//calculate difference in EVI between Base data and following analyis years
var Y1EVID = My1EVI.subtract(MbEVI);
var Y5EVID = My5EVI.subtract(MbEVI);
var Y10EVID = My10EVI.subtract(MbEVI);
var Y15EVID = My15EVI.subtract(MbEVI);
var Y20EVID = My20EVI.subtract(MbEVI);
//calculate difference in NBR between Base data and following analysis Years
var Y1NBRD = My1NBR.subtract(MbNBR);
var Y5NBRD = My5NBR.subtract(MbNBR);
var Y10NBRD = My10NBR.subtract(MbNBR);
var Y15NBRD = My15NBR.subtract(MbNBR);
var Y20NBRD = My20NBR.subtract(MbNBR);

//Set Visual Parameters
var VisNdvi = {Bands:'NDVI', min: -2, max: 2};
var VisEVI = {Bands:'EVI', min: -2, max: 2};
var VisNBR = {Bands:'NBR', min: -0.5, max: 1.3};

//Map NDVI
if (MapNDVI === true){
  Map.addLayer(Y1NDVID, VisNdvi, 'NDVI D Y1');
  Map.addLayer(Y5NDVID, VisNdvi, 'NDVI D Y5');
  Map.addLayer(Y10NDVID, VisNdvi, 'NDVI D Y10');
  Map.addLayer(Y15NDVID, VisNdvi, 'NDVI D Y15');
  Map.addLayer(Y20NDVID, VisNdvi, 'NDVI D Y20');
}

//Map EVI
if (MapEVI === true){
  Map.addLayer(Y1EVID, VisEVI, 'EVI D Y1');
  Map.addLayer(Y5EVID, VisEVI, 'EVI D Y5');
  Map.addLayer(Y10EVID, VisEVI, 'EVI D Y10');
  Map.addLayer(Y15EVID, VisEVI, 'EVI D Y15');
  Map.addLayer(Y20EVID, VisEVI, 'EVI D Y20');
}

//Map NBR
if (MapNBR === true){
Map.addLayer(Y1NBRD, VisNBR, 'NBR D Y1');
Map.addLayer(Y5NBRD, VisNBR, 'NBR D Y5');
Map.addLayer(Y10NBRD, VisNBR, 'NBR D Y10');
Map.addLayer(Y15NBRD, VisNBR, 'NBR D Y15');
Map.addLayer(Y20NBRD, VisNBR, 'NBR D Y20');
}

Map.centerObject(Fire, 11);

//Export NDVI
if (EXPORTNDVI === true){
  Export.image.toDrive({
    image: Y1NDVID,
    description: FireName+'_'+'Y1_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5NDVID,
    description:FireName+'_'+'Y5_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y10NDVID,
    description:FireName+'_'+'Y10_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y15NDVID,
    description:FireName+'_'+'Y15_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y20NDVID,
    description:FireName+'_'+'Y20_NDVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
//Export EVI
if (EVIEXPORT === true){
  Export.image.toDrive({
    image:Y1EVID,
    description:FireName+'_'+'Y1_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5EVID,
    description:FireName+'_'+'Y5_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y10EVID,
    description:FireName+'_'+'Y10_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y15EVID,
    description:FireName+'_'+'Y15_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y20EVID,
    description:FireName+'_'+'Y20_EVID',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
//Export NBR
if (NBREXPORT === true){
  Export.image.toDrive({
    image:Y1NBRD,
    description:FireName+'_'+'Y1_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y5NBRD,
    description:FireName+'_'+'Y5_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y10NBRD,
    description:FireName+'_'+'Y10_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y15NBRD,
    description:FireName+'_'+'Y15_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
  Export.image.toDrive({
    image:Y20NBRD,
    description:FireName+'_'+'Y20_NBRD',
    maxPixels: 1e13,
    scale: 10,
    region: Fire,
    folder: 'FireAnalysis',
    fileFormat: 'GeoTIFF',
  })
}
