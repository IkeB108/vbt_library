//FOLD> comments about NPM
/*
TO INSTALL NEW NPM PACKAGES:
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
You do not need to start with npm init.
That just creates the package.json file, which has already been done.
STEP 1:
Enter this command into Windows cmd prompt
(while in the project directory):
npm install package_name
STEP 2:
require() the package with a line in entry.js:
myVariable = require('package_name')
STEP 3:
Use Browserify to update the bundle.js file (see entry.js comment for info)

TO RUN THE CODE:
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
Use Atom live server like normal. You cannot just open the index.html file from
the file browser.

REMEMBER: Any functions normally used by p5js (like setup or draw) 
now need to be created like this:

window.keyTyped = function keyTyped () {
...
}

REMEMBER: The order of the scripts in the index.html file
is important when using browserify. A function cannot be called in one
file if that function is created in a proceding file (at least, not on
page load).
This problem is not circumvented by adding the function to the window
using "window.___" like above

WHEN THE PROJECT IS COMPLETE:
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
Many of the files in this project are just for browserify to use, and it's
pointless to keep them when you're done using browserify.
When the project is done, you don't need the node_modules directory
or anything in it. IMPORTANT: DO NOT try to upload it; it will likely
contain hundreds of files. The only files you need to keep are:
- index.html
- style.css
- bundle.js
- All other js files referenced in index.html (you can include more),
including the libraries directory.

Delete everything else.
Extra note: There is a p5 NPM package, but I didn't use it because
I couldn't make it work with the p5 sound library (which does not have
an equivalent NPM package).
*/
//<FOLD

window.preload = function preload(){
  floorImage = loadImage('floor.jpg')
  ceilImage = loadImage('ceil.jpg')
  bookImage = loadImage('book.png')
  redBookImage = loadImage('redbook.png')
  // visibleCodePoints = loadJSON("visibleCodePoints.json")
  visibleCodePoints = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 33, 64, 35, 36, 37, 94, 38, 42, 40, 41, 45, 61, 91, 93, 92, 59, 39, 44, 46, 47, 95, 43, 123, 125, 124, 58, 34, 60, 62, 63]
}

window.setup = function setup() {
  pixelDensity(1);
  pxSpacing = 20;
  createCanvas(1,1)
  setupCanvas();
  createCanvasEventListeners();
  logMouse = false;
  perspectiveBoxHeight = width; //Height of the box that defines the steepness of the one-point perspective lines
  
  dst_offset = 0;
  dst_offset_on_press = 0;
  total_dst_traveled = BigInt(0);
  mousepos_array = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0} ];
  bookColors = [
    color("#DEFFFC"),
    color("#E2E4F6"),
    color("#E7C8DD"),
    color("#DBAFC1"),
    color("#86626E")
  ]
  bookshelfCount = 12; //How many bookshelves onscreen on either side?
  bookshelfScales = [];
  specialBooks = [
    {
      shelf_number: 2,
      content: "Welcome to the Library of Babel. Here you will find every book that has ever, will ever, or could  ever be written. It contains every possible combination of letters, numbers, and just about all    other human-language characters."
    },
    {
      shelf_number: 4,
      content: "Somewhere in this library is a book containing the true story of your death, the plot summaries of every Netflix original film ever made (as well as every film that hasn’t been made), the life      stories of the directors of those films, a collection of the stories you wrote when you were six   years old, an archive of every math problem you attempted at that age, and of course, the entire   works of Shakespeare. It’s just a matter of finding a needle in an ocean of meaningless books.     ≋≋≋≋|≋≋≋≋≋≋≋"
    },
    {
      shelf_number: 6,
      content: "The Library of Babel concept was introduced to the world by Jorge Luis Borges in 1943. His short   story, of the same name, belongs to a genre of literature called magical realism. In magical       realism, authors throw fantastical elements into real world settings, often to highlight the       magical qualities of the world we already live in."
    },
    {
      shelf_number: 8,
      content: "A human perspective is too small to appreciate the very big repository of all things possible."
    },
  ]
  getSpecialBookAt = (shelf_number) => {
    for(var i = 0; i < specialBooks.length; i ++){
      if( BigInt(specialBooks[i].shelf_number) == shelf_number)
      return i;
    }
    return 'none';
  }
  
  initialBookshelfScales = [];
  bookshelfGridWidth = 14
  bookshelfGridHeight = 25
  bookshelves_passed = 0;
  var s = 1;
  for(var i = 0; i < bookshelfCount; i ++){
    bookshelfScales.push(s);
    initialBookshelfScales.push(s);
    s /= 2.2
  }
  transformedHoleCorners = [
    26  - 26, 310 - 310,
    125 - 26, 368 - 310,
    125 - 26, 399 - 310,
    26  - 26, 363 - 310
  ]
  scrollSpeed = 0;
  
  pb0 = 0;
  last_book_opened = 0;
  book_on_display = 'none'; //book number of the book that's currently being displayed to the user.
  current_page = 0;
  
  lorem = "So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup."
  
  var bookRectangles = displayBook(0)
  var marginSize = width/20;
  var leftPageX = (windowWidth-width)/2 + bookRectangles.leftPageRect.x + marginSize + (bookRectangles.bookRect.w * (28/542))
  var leftPageY = bookRectangles.leftPageRect.y + (bookRectangles.leftPageRect.x * 2)
  var pageWidth = bookRectangles.leftPageRect.w - (marginSize + (bookRectangles.bookRect.w * (36/542))) - marginSize
  var rightPageX = (windowWidth-width)/2 + bookRectangles.bookRect.x + (bookRectangles.bookRect.w/2) + marginSize;
  var rightPageY = leftPageY;
  leftPageP = createP(lorem)
  leftPageP.style('font-size', (width/30) + 'px')
  leftPageP.style("text-align", "justify")
  leftPageP.style("text-justify", "inter-character")
  leftPageP.style("word-wrap", "break-word")
  leftPageP.style("width", pageWidth + "px")
  leftPageP.style("font-family", "Courier")
  leftPageP.position(leftPageX,leftPageY)
  leftPageP.elt.hidden = true;
  rightPageP = createP(lorem)
  rightPageP.style('font-size', (width/30) + 'px')
  rightPageP.style("text-align", "justify")
  rightPageP.style("text-justify", "inter-character")
  rightPageP.style("word-wrap", "break-word")
  rightPageP.style("width", pageWidth + "px")
  rightPageP.style("font-family", "Courier")
  rightPageP.position(rightPageX,rightPageY)
  rightPageP.elt.hidden = true;
  
  leftPageP.elt.setAttribute("id", "leftPageP")
  rightPageP.elt.setAttribute("id", "rightPageP")
  
  //FOLD> Defining variables for book text generation
  // visibleCodePoints = visibleCodePoints.visibleCodePoints;
  // visibleCodePoints.push(32, 10)
  //Add line breaks and spaces to the list of visible code points.
  //Although they are not technically visible, we want the user to be able to use them.
  
  cp_length = visibleCodePoints.length;
  visibleCharactersString = '';
  for(var i = 0; i < visibleCodePoints.length; i ++){
    visibleCharactersString += String.fromCodePoint(visibleCodePoints[i])
  }
  
  scrambledCodePoints = [...visibleCodePoints]
  scrambledCodePoints = shuffle(scrambledCodePoints)
  scrambleOffset = 0;
  
  //99 characters is an appropriate length for each page of each book
  //Let's have every book have 99 pages
  pages_in_each_book = 99
  characters_in_each_page = 99
  
  currentBookText = bookNumberToContents(bookNumberWithPadding(0)); //set this to the text of the current book;
  
  //<FOLD
  
}

window.draw = function draw() {
  // background(0);
  image(ceilImage, 0, 0, width, ceilImage.height * (width/ceilImage.width) )
  image(floorImage, 0, height/2, width, floorImage.height * (width/floorImage.width) )
  if(tbg_needs_reset){
    drawBookshelf(1, 'left') //draw the bookshelf texture once to the graphics object
    tbg_needs_reset = false;
  }
  drawBookshelves();
  updateBookshelfScales();
  mousepos_array.shift();
  mousepos_array.push({x:mousepos.x, y:mousepos.y})
  
  dst_offset += scrollSpeed;
  dst_offset = dst_offset % (1.14) + 1.14
  scrollSpeed *= 0.97
  if( abs(scrollSpeed) < 0.0001)scrollSpeed = 0;
  if(mousepos.x < 0 || mousepos.x > width || mousepos.y < 0 || mousepos.y > height){
    if(mousepos.pressed){
      mousepos.pressed = false;
      clickEnd();
    }
    
  }
  
  bookshelfGrid = getBookshelfGrid(bookshelfGridWidth, bookshelfGridHeight, false)
  
  
  var b0_dist = bookshelfGrid[0] - pb0
  if( abs(b0_dist) > (width/2) ){
    //If the bookshelf grid shifts by an amount
    //greater than half the width of the canvas,
    //we have moved to a new bookshelf
    if( b0_dist < 0) total_dst_traveled -= BigInt(1);
    if( b0_dist > 0) total_dst_traveled += BigInt(1);
  }
  pb0 = bookshelfGrid[0];
  // strokeWeight(5);
  // for(var j = 0; j < bookshelfGrid.length; j += 8){
  //   var bookIndex = getBookFromCell(j)
  //   stroke(0);
  //   if(bookIndex == 'not a book')stroke(0,0,0);
  //   else {
  //     var bookCols = [ color('red'), color('yellow'), color('blue') ]
  //     if(bookIndex < 0)stroke( color('green') )
  //     else stroke( bookCols[ bookIndex % 3 ] )
  //   }
  //   point(bookshelfGrid[j], bookshelfGrid[j+1])
  // }
  // strokeWeight(1);
  if(book_on_display != 'none')displayBook(book_on_display)
}

function getBookshelfGrid(gridWidth, gridHeight, drawGrid){
  gridWidth += 1;
  vertLines = [];
  horizLines = [];
  for(var i = 1; i < 3; i ++){
    var x = (width/2) + (bookshelfScales[i] * (width/-2))
    var next_x = (width/2) + (bookshelfScales[i+1] * (width/-2))
    stroke(255);
    // line(x, 0, x, height)
    for(var j = 0; j < gridWidth; j ++){
      var x2 = map(j, 0, gridWidth, x, next_x )
      stroke(0,255,255)
      // line(x2, 0, x2, height)
      vertLines.push( [x2, 0, x2, height] )
    }
  }
  var y_top = (height/2) - (width/2)
  var y_bottom = (height/2) + (width/2)
  stroke(255,255,0);
  var c = gridHeight;
  for(var i = 0; i <= gridHeight; i ++){
    var y = map(i, 0, gridHeight, y_top, y_bottom)
    // line(width/2, height/2, 0, y)
    horizLines.push( [width/2, height/2, 0, y] )
  }
  gridPoints = [];
  stroke(255);
  for(var i = 0; i < vertLines.length; i ++){
    for(var j = 0; j < horizLines.length; j ++){
      var p = line_intersect(
        vertLines[i][0], vertLines[i][1],
        vertLines[i][2], vertLines[i][3],
        horizLines[j][0], horizLines[j][1],
        horizLines[j][2], horizLines[j][3]
      )
      gridPoints.push(p);
      // point(p.x, p.y)
    }
  }
  var bookshelfGrid = [];
  for(var i = 0; i < gridPoints.length; i ++){
    if(gridPoints[i+ (gridHeight + 3) ] !== undefined && i % (gridHeight + 1) !== (gridHeight) ){
      bookshelfGrid.push(
        gridPoints[i].x   , gridPoints[i].y,
        gridPoints[i+1].x , gridPoints[i+1].y,
        gridPoints[i+ (gridHeight+2) ].x, gridPoints[i+(gridHeight+2)].y,
        gridPoints[i+ (gridHeight+1) ].x, gridPoints[i+(gridHeight+1)].y,
      )
      // if(i%26 == 25)i += 1;
    }
  }
  if(drawGrid){
    stroke(255); noFill();
    for(var i = 0; i < bookshelfGrid.length; i += 8){
      beginShape();
      vertex(bookshelfGrid[i], bookshelfGrid[i+1])
      vertex(bookshelfGrid[i+2], bookshelfGrid[i+3])
      vertex(bookshelfGrid[i+4], bookshelfGrid[i+5])
      vertex(bookshelfGrid[i+6], bookshelfGrid[i+7])
      endShape(CLOSE)
    }
  }
  // strokeWeight(5);
  // var n = round(frameCount*2) % gridPoints.length;
  // n += 100
  // point(gridPoints[n].x + mousepos.x, gridPoints[n].y)
  // strokeWeight(1);
  // noStroke();
  return bookshelfGrid;
}

function getBookFromCell(cellIndex){
  //Given the index of a cell in the bookshelf grid,
  //return the index of the book at that cell, if there is a book in it.
  cellIndex = floor(cellIndex/8)
  var w = bookshelfGridWidth;
  var h = bookshelfGridHeight;
  var bookshelfPoints = getBookshelfGrid(w, h, false);
  if(  between(cellIndex, 0, h) ||
       between(cellIndex, (w-1) * h, (w+2) * h) ||
       cellIndex > (w*h*2) ){
    return "not a book"
  }
  if( [0, 4, 8, 12, 16, 20, 24].includes(cellIndex%h) ){
    return "not a book"
  }
  cellIndex -= floor(cellIndex/h) - 1 ;
  if(cellIndex > (w+1) * h){
    // cellIndex -= ((w+2) * h) - ((w-1) * h)
    cellIndex -= 72
  }
  var ret = floor( (cellIndex- (bookshelfGridHeight+1) ) /4)
  // console.log("Before modify: " + ret)
  return BigInt(ret) + ( BigInt(72) * total_dst_traveled )
  // return ret
  //return "book"
  
}

function getCodePoints(charString){
  var ret = [];
  for(var i = 0; i < charString.length; i ++){
    ret.push( charString.charCodeAt(i) )
  }
  return ret;
}
