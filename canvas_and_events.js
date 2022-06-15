window.clickBegin = function clickBegin(){
  if(book_on_display == 'none'){
    mousepos_at_press = {x:mousepos.x,y:mousepos.y}
    dst_offset_on_press = dst_offset;
    scrollSpeed = 0;
    
    //Check if user tapped on a book
    book_clicked_on_press = getBookClicked();
  }
  
}
window.clickEnd = function clickEnd(){
  if(book_on_display == 'none'){
    var avg = 0;
    for(var i = 1; i < mousepos_array.length; i ++){
      avg += mousepos_array[i].y - mousepos_array[i-1].y
    }
    avg /= 5;
    scrollSpeed = avg * 0.002;
    
    if( abs(mousepos.y - mousepos_at_press.y) < (height/6) ){
      scrollSpeed = 0;
      //if the user's finger/cursor didn't travel at least one sixth
      //the length of the screen, they probably didn't intend to scroll.
    }
    
    book_clicked_on_release = getBookClicked();
    if(book_clicked_on_press == book_clicked_on_release &&
      book_clicked_on_press !== 'none'){
        
        var b = book_clicked_on_press
        var b2 = book_clicked_on_press
        
        if(getSpecialBookAt(total_dst_traveled ) !== 'none'){
          // nativeLog("Shelf 1")
        }
        if(getSpecialBookAt(total_dst_traveled + BigInt(1)) !== 'none'){
          // nativeLog("Shelf 2")
        }
        
        if(getSpecialBookAt(total_dst_traveled ) !== 'none' &&
        Number(book_clicked_on_press % BigInt(12) ) == 4 &&
        Number(book_clicked_on_press % BigInt(288)) < 144 ){ //28
          var specialBook = specialBooks[getSpecialBookAt(total_dst_traveled)]
          currentBookText = specialBook.content;
          book_on_display = book_clicked_on_press
          last_book_opened = book_clicked_on_press;
          scrollSpeed = 0;
          leftPageP.elt.hidden = false;
          rightPageP.elt.hidden = false;
        }
        if(getSpecialBookAt(total_dst_traveled+BigInt(1) ) !== 'none' &&
        Number(book_clicked_on_press % BigInt(12) ) == 4 &&
        Number(book_clicked_on_press % BigInt(288)) < 144 ){ //172
          var specialBook = specialBooks[getSpecialBookAt(total_dst_traveled+ BigInt(1) )]
          currentBookText = specialBook.content;
          book_on_display = book_clicked_on_press
          last_book_opened = book_clicked_on_press;
          scrollSpeed = 0;
          leftPageP.elt.hidden = false;
          rightPageP.elt.hidden = false;
        }
        
        leftPageP.elt.innerHTML = getContentsOfPage(current_page)
        rightPageP.elt.innerHTML = getContentsOfPage(current_page+1)
      }
      // console.log( (mousepos_at_press.y - mousepos.y) )
  }
  else {
    var bookRectangles = displayBook(book_on_display)
    var lpr = bookRectangles.leftPageRect
    var rpr = bookRectangles.rightPageRect
    if(collidePointRect(mousepos.x, mousepos.y, lpr.x, lpr.y, lpr.w, lpr.h) ){
      current_page -= 2;
      if(current_page < 0)current_page = 0;
      leftPageP.elt.innerHTML = getContentsOfPage(current_page)
      rightPageP.elt.innerHTML = getContentsOfPage(current_page+1)
    }
    else if(collidePointRect(mousepos.x, mousepos.y, rpr.x, rpr.y, rpr.w, rpr.h) ){
      current_page += 2;
      if(current_page > pages_in_each_book - 1)current_page = pages_in_each_book - 1;
      leftPageP.elt.innerHTML = getContentsOfPage(current_page)
      rightPageP.elt.innerHTML = getContentsOfPage(current_page+1)
    }
    else {
      book_on_display = 'none';
      book_clicked_on_press = 'none';
      leftPageP.elt.hidden = true;
      rightPageP.elt.hidden = true;
      current_page = 0;
    }
  }
}

window.keyTyped = function keyTyped(){
  if(key == '`'){
    var made_change = false;
    if(!canvas.hidden){
      canvas.hidden = true;
      consoleElement.hidden = false;
      made_change = true;
    }
    if(canvas.hidden && !made_change){
      canvas.hidden = false;
      consoleElement.hidden = true;
    }
  }
}

function getBookClicked(){
  for(var i = 0; i < bookshelfGrid.length; i += 8){
    var poly = [
      {x:bookshelfGrid[i+0], y:bookshelfGrid[i+1]},
      {x:bookshelfGrid[i+2], y:bookshelfGrid[i+3]},
      {x:bookshelfGrid[i+4], y:bookshelfGrid[i+5]},
      {x:bookshelfGrid[i+6], y:bookshelfGrid[i+7]},
    ]
    //Check for click on left side
    if(collidePointPoly(mousepos.x, mousepos.y, poly) ){
      // console.log('left')
      // return ( getBookFromCell(i))
      if( getBookFromCell(i) !== 'not a book' )
      return ( getBookFromCell(i) * BigInt(2) )
    }
    //Check for click on right side
    var x_right = (width/2) + ((width/2)-mousepos.x)
    if(collidePointPoly(x_right, mousepos.y, poly) ){
      // console.log('right')
      if( getBookFromCell(i) !== 'not a book' )
      return ( getBookFromCell(i) * BigInt(2) ) + BigInt(1)
    }
  }
  return 'none'
}

window.clickMove = function clickMove(){
  if(book_on_display == 'none'){
    dst_offset = dst_offset_on_press + ((mousepos.y - mousepos_at_press.y) * 0.002)
    dst_offset = dst_offset % (1.14) + 1.14
  }
}
window.mouseWheel = function mouseWheel(){
  // clickBegin();
  // clickEnd();
}

window.setupCanvas = function setupCanvas(){
  var h = windowHeight - pxSpacing * 2;
  var w = windowWidth - pxSpacing * 2;
  if(h/w <= 1.5)w = h / 1.5;
  tbg_needs_reset = true;
  // perspectiveBoxHeight = height * (4/5); //Height of the box that defines the steepness of the one-point perspective lines
  perspectiveBoxHeight = width
  
  resizeCanvas(round(w),round(h))
  //Set canvas attribute style to "touch-action: none"
}

window.windowResized = function windowResized(){
  setupCanvas();
  var bookRectangles = displayBook(0)
  var marginSize = width/20;
  var leftPageX = (windowWidth-width)/2 + bookRectangles.leftPageRect.x + marginSize + (bookRectangles.bookRect.w * (28/542))
  var leftPageY = bookRectangles.leftPageRect.y + (bookRectangles.leftPageRect.x * 2)
  var rightPageX = (windowWidth-width)/2 + bookRectangles.bookRect.x + (bookRectangles.bookRect.w/2) + marginSize;
  var pageWidth = bookRectangles.leftPageRect.w - (marginSize + (bookRectangles.bookRect.w * (36/542))) - marginSize
  
  var rightPageY = leftPageY;
  leftPageP.position(leftPageX,leftPageY)
  rightPageP.position(rightPageX,rightPageY)
  leftPageP.style('font-size', (width/30) + 'px')
  rightPageP.style('font-size', (width/30) + 'px')
  leftPageP.style("width", pageWidth + "px")
  rightPageP.style("width", pageWidth + "px")
}

window.createCanvasEventListeners = function createCanvasEventListeners(){
  /*
  The default mouse behaviors from P5JS are not working
  very well on mobile and I need good tap and drag functionality
  so I'm coding it myself
  */
  document.body.addEventListener("mousedown", mouseDown)
  document.body.addEventListener("mousemove", mouseMove)
  document.body.addEventListener("mouseup", mouseUp)
  document.body.addEventListener("touchstart", touchStart)
  document.body.addEventListener("touchmove", touchMove)
  document.body.addEventListener("touchend", touchEnd)
  onMobile = false;
  logMouse = false; //Set to true to log mouse/touch movements and positions
  mousepos = {'x':null, 'y':null, 'pressed':false, 'isclick':false}
  mousepos2 = {'x':null, 'y':null, 'pressed':false} //Second finger if on mobile
  mousepos_at_press = {x:null,y:null}
  presses_count = 0;
}



window.mouseDown = function mouseDown(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse down x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = true;
    clickBegin();
  }
}
window.mouseUp = function mouseUp(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse up x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = false;
    clickEnd();
  }
}
window.mouseMove = function mouseMove(e){
  if(!onMobile){
    getMousePosFromEvent(e);
    if(mousepos.pressed)clickMove();
  }
}
window.touchMove = function touchMove(e){
  getMousePosFromEvent(e);
  clickMove();
}
window.touchStart = function touchStart(e){
  onMobile = true;
  if(logMouse)console.log("Touch start x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = true;
  clickBegin();
}
window.touchEnd = function touchEnd(e){
  // console.log(e)
  if(logMouse)console.log("Touch end x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = false;
  clickEnd();
}
window.getMousePosFromEvent = function getMousePosFromEvent(e){
  var canvasBounding = canvas.getBoundingClientRect();
  mousepos.x = e.clientX - canvasBounding.x;
  mousepos.y = e.clientY - canvasBounding.y;
  if(e.touches){ //This is a touch, not a mouse click
    if(e.touches.length > 0){ //This is a touch start event.
      presses_count = e.touches.length
      mousepos.x = e.touches[0].clientX - canvasBounding.x;
      mousepos.y = e.touches[0].clientY - canvasBounding.y;
      if(e.touches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.touches[1].clientX - canvasBounding.x;
        mousepos2.y = e.touches[1].clientY - canvasBounding.y;
      }
    } else { //This is a touch end event
      presses_count = e.changedTouches.length
      mousepos.x = e.changedTouches[0].clientX - canvasBounding.x;
      mousepos.y = e.changedTouches[0].clientY - canvasBounding.y;
      if(e.changedTouches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.changedTouches[1].clientX - canvasBounding.x;
        mousepos2.y = e.changedTouches[1].clientY - canvasBounding.y;
      }
    }
  }
}
