////////////////Wildfire Analysis////////////////
////////////////By Joshua Sumers/////////////////
////////////////Edited:11/5/2019/////////////////

//Set Imagery
var imagery = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');

//set Fire Boundary
var Fire = ee.FeatureCollection('users/joshsumers1996/FullBound') ;

//Determine Base Data
var BYEARs = ee.Date('04/01/1990'); //Set Fire Year
var BYEARe = ee.Date('04/30/1990'); //Set Fire Year
//First Analysis Year (year after fire)
var Year1s = ee.Date('04/01/1991'); //
var Year1e = ee.Date('04/30/1991');
//Second Analysis Year (five years after fire)
var Year5s = ee.Date('04/01/1995');
var Year5e = ee.Date('04/30/1995');
//Third Analysis Year (10 years after fire)
var Year10s = ee.Date('04/01/2000');
var Year10e = ee.Date('04/30/2000');
//Fourth Analysis Year (15 years after fire)
var Year15s = ee.Date('04/01/2005');
var Year15e = ee.Date('04/30/2005');
//Fifth Analysis Year (20 Years after fire)
var Year20s = ee.Date('04/01/2010');
var Year20e = ee.Date('04/30/2010');
//Acquire Base Imagery
var BImage = imagery.filterDate(BYEARs,BYEARe)
  .filterDate(BYEARs,BYEARe)
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 1 Imagery
var Image1= imagery
  .filter(ee.Filter.date(Year1s,Year1e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 5 Imagery
var Image5= imagery
  .filter(ee.Filter.date(Year5s,Year5e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 10 Imagery
var Image10= imagery
  .filter(ee.Filter.date(Year10s,Year10e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 15 Imagery
var Image15= imagery
  .filter(ee.Filter.date(Year15s,Year15e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Acquire Year 20 Imagery
var Image20= imagery
  .filter(ee.Filter.date(Year20s,Year20e))
  .filterBounds(Fire)
  .map(function(image){return image.clip(Fire)});
//Calculate NDVI Function
var CalcNDVI = function(image){
  var Ndvi = (('B4'-'B3')/('B4'+'B3'));
  var INDVI = image.addBands('Ndvi');
  return INDVI;
//Calculate EVI Function
}
var CalcEVI = function(image){
  var Evi = 2.5 * (('B4' - 'B3') / ('B4' + 6 * 'B3' - 7.5 * 'B1' + 1));
  var IEVI = image.addBands('Evi');
  return IEVI ;
}
//Calculate NBR Function
var CalcNBR = function(image){
  var Nbr = (('B4'-'B5')/('B4'+'B5'));
  var INBR = image.addBands('Nbr');
  return INBR ;
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
var My15NDVI = Image15.map(CalcNDVI).mean().select('NDVI');
var My15EVI = Image15.map(CalcEVI).mean().select('EVI');
var My15NBR = Image15.map(CalcNBR).mean().select('NBR');
//calculate year 20 indicies
var My20NDVI = Image20.map(CalcNDVI).mean().select('NDVI');
var My20EVI = Image20.map(CalcEVI).mean().select('EVI');
var My20NBR = Image20.map(CalcNBR).mean().select('NBR');
//calculate difference in NDVI between Base data and following analysis years
var Y1NDVID = My1NDVI.subtract(MbNDVI).select('NDVId');
var Y5NDVID = My5NDVI.subtract(MbNDVI).select('NDVId');
var Y10NDVID = My10NDVI.subtract(MbNDVI).select('NDVId');
var Y15NDVID = My15NDVI.subtract(MbNDVI).select('NDVId');
var Y20NDVID = My20NDVI.subtract(MbNDVI).select('NDVId');
//calculate difference in EVI between Base data and following analyis years
var Y1EVID = My1EVI.subtract(MbEVI).select('EVId');
var Y5EVID = My5EVI.subtract(MbEVI).select('EVId');
var Y10EVID = My10EVI.subtract(MbEVI).select('EVId');
var Y15EVID = My15EVI.subtract(MbEVI).select('EVId');
var Y20EVID = My20EVI.subtract(MbEVI).select('EVId');
//calculate difference in NBR between Base data and following analysis Years
var Y1NBRD = My1NBR.subtract(MbNBR).select('NBRd');
var Y5NBRD = My5NBR.subtract(MbNBR).select('NBRd');
var Y10NBRD = My10NBR.subtract(MbNBR).select('NBRd');
var Y15NBRD = My15NBR.subtract(MbNBR).select('NBRd');
var Y20NBRD = My20NBR.subtract(MbNBR).select('NBRd');
