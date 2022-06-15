function displayBook(book_number){
  var w = width * (12/13)
  var h = bookImage.height * (w/bookImage.width)
  var x = (width - w)/2
  var y = (height/2) - (h/2)
  image(bookImage, x, y, w, h)
  var bookRect = {x,y,w,h}
  var leftPageRect = {
    x: x,
    y: y,
    w: w/2,
    h: h
  }
  var lpr = leftPageRect;
  var rightPageRect = {
    x: x + (w/2),
    y: y,
    w: w/2,
    h: h
  }
  var rpr = rightPageRect;
  fill(0); 
  //Draw left page
  var marginSize = width/10;
  // text(lorem, lpr.x + marginSize, lpr.y + marginSize, lpr.w - (marginSize*2), lpr.h - (marginSize*2))
  // var x = "Hi diddly ho neighbor!"
  // var y = "How are you doing today?"
  // canvas.getContext('2d').fillJustifyText(x, lpr.x + marginSize, lpr.y + marginSize, lpr.w - (marginSize*2))
  // canvas.getContext('2d').fillJustifyText(y, lpr.x + marginSize, lpr.y + marginSize + 30, lpr.w - (marginSize*2))
  //Draw right page
  return {bookRect, leftPageRect, rightPageRect}
}
function drawGuides(){
  //Draws general perspective guiding lines to for dev purposes
  var upper = (height/2) - (perspectiveBoxHeight/2)
  var lower = (height/2) + (perspectiveBoxHeight/2)
  stroke(100);
  //One-point perspective lines
  line(width/2,height/2,0,upper)
  line(width/2,height/2,0,lower)
  line(width/2,height/2,width,upper)
  line(width/2,height/2,width,lower)
}

function drawBookshelves(){
  //Draw a filler quadrilateral to give the illusion
  //of infinite bookshelves. This quad is concave
  var left_line = verticalBookshelfLine(1/10, 'left')
  var right_line = verticalBookshelfLine(1/10, 'right')
  // fill(102, 82, 62);
  // beginShape();
  // vertex(left_line[0], left_line[1])
  // vertex(left_line[2], left_line[3])
  // vertex(right_line[0], right_line[1])
  // vertex(right_line[2], right_line[3])
  // endShape(CLOSE);
  
  //Draw all bookshelves
  // stroke(255); noFill(); strokeWeight(9)
  noStroke();
  for(var i = bookshelfCount - 1; i >= 0; i --){
    if( getSpecialBookAt( BigInt(i-1) + total_dst_traveled ) !== 'none'){
      var img_to_draw = tbg_red;
    } else img_to_draw = transformed_bookshelf_graphic;
    push();
    translate(width/2, height/2)
    scale(bookshelfScales[i])
    fill(59, 33, 18);
    //Don't ask me how the formula for this rectangle works
    rect(width * (-1.5), height/-2 + (height-bookshelf_height_dif)/2, width, bookshelf_height_dif + 4)
    image(img_to_draw, width/-2, height/-2 )
    // drawBookshelfGrid(width*(-0.5), height/-2 + (height-bookshelf_height_dif)/2 );
    scale(-1,1)
    image(transformed_bookshelf_graphic, width/-2, height/-2)
    fill(59, 33, 18);
    rect(width * (-1.5), height/-2 + (height-bookshelf_height_dif)/2, width, bookshelf_height_dif + 4)
    pop();
  }
  
}

function drawBookshelfGrid(x, y){
  stroke(255); noFill();
  for(var i = 0; i < bookshelfGrid.length; i ++){
    var s = [];
    for(var j = 0; j < bookshelfGrid[i].length; j += 2){
      s.push(bookshelfGrid[i][j] + x )
      s.push(bookshelfGrid[i][j+1] + y)
    }
    drawShapeNoPerspective(s)
  }
}

function drawShapeNoPerspective(shapePoints){
  beginShape();
  for(var i = 0; i < shapePoints.length; i += 2){
    vertex(shapePoints[i], shapePoints[i+1])
  }
  endShape(CLOSE);
}

function drawBookshelf(dst_int, side){
  /*
  Given dst (an integer)
  and side ('left' or 'right' side of room), draw a bookshelf
  */
  var nearLine = verticalBookshelfLine(1/dst_int, side)
  var farLine = verticalBookshelfLine(1/(dst_int+1), side)
  if(typeof transformed_bookshelf_graphic !== 'undefined')transformed_bookshelf_graphic.remove();
  // transformed_bookshelf_graphic = createGraphics(abs(nearLine[0] - farLine[0]), abs(nearLine[3]-nearLine[1]) )
  transformed_bookshelf_graphic = createGraphics(abs(nearLine[0] - farLine[0]), height )
  tbg_red = createGraphics(abs(nearLine[0] - farLine[0]), height )
  myPerspective = new perspectiveJS(transformed_bookshelf_graphic.elt.getContext('2d'), bookshelfTexture)
  myPerspective_red = new perspectiveJS(tbg_red.elt.getContext('2d'), bookshelfTextureRed)
  
  bookshelf_height_dif = (height - (nearLine[1]*2))
  // nearLine[1] -= nearLine[1];
  // nearLine[3] -= nearLine[1];
  // farLine[1] -= nearLine[1] ;
  // farLine[3] -= nearLine[1] ;
  if(side == 'left'){
    myPerspective.draw( [
      [nearLine[0], nearLine[1]],
      [farLine[0] , farLine[1] ],
      [farLine[2] , farLine[3] ],
      [nearLine[2], nearLine[3]]
    ] )
    myPerspective_red.draw( [
      [nearLine[0], nearLine[1]],
      [farLine[0] , farLine[1] ],
      [farLine[2] , farLine[3] ],
      [nearLine[2], nearLine[3]]
    ] )
  }
  if(side == 'right')
  myPerspective.draw( [
    [farLine[0] , farLine[1] ],
    [nearLine[0], nearLine[1]],
    [nearLine[2], nearLine[3]],
    [farLine[2] , farLine[3] ]
  ] )
  myPerspective_red.draw( [
    [farLine[0] , farLine[1] ],
    [nearLine[0], nearLine[1]],
    [nearLine[2], nearLine[3]],
    [farLine[2] , farLine[3] ]
  ] )
  
  
  
  
}
function drawLineArray(lineArray){
  stroke(255);
  line(lineArray[0],lineArray[1],lineArray[2],lineArray[3])
}
function verticalBookshelfLine(dst, side){
  /*Given a dst between 0 and 1,
  return a vertical line at that distance from the viewer
  */
  if(side == 'left'){
    var x = map(dst, 0, 1, width/2, 0)
    var y1 = line_intersect(x, 0, x, height, width/2, height/2, 0, (height/2) - (perspectiveBoxHeight/2) )
    var y2 = line_intersect(x, 0, x, height, width/2, height/2, 0, (height/2) + (perspectiveBoxHeight/2))
  }
  if(side == 'right'){
    var x = map(dst, 0, 1, width/2, width)
    var y1 = line_intersect(x, 0, x, height, width/2, height/2, width, (height/2) - (perspectiveBoxHeight/2) )
    var y2 = line_intersect(x, 0, x, height, width/2, height/2, width, (height/2) + (perspectiveBoxHeight/2))
  }
  return [x,y1.y,x,y2.y]
}

function drawShape(shapePoints, dstPoints){
  /*
  Given shapePoints (points of the original shape, all coords
  between 0 and 1), return those points when mapped onto a
  quadrilateral defined by dstPoints
  */
  var perspT = PerspT([0,0,1,0,1,1,0,1], dstPoints)
  beginShape();
  for(var i = 0; i < shapePoints.length; i += 2){
    var dstPt = perspT.transform(shapePoints[i], shapePoints[i+1])
    vertex(dstPt[0], dstPt[1])
  }
  endShape(CLOSE);
}

function updateBookshelfScales(){
  for(var i = 0; i < bookshelfCount; i ++){
    bookshelfScales[i] = initialBookshelfScales[i] * (Math.pow(2,dst_offset)) ;
  }
}

function rectToPoints(x,y,w,h){
  return [
    x, y,
    x + w, y,
    x + w, y + h,
    x, y + h
  ]
}
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4){
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}
