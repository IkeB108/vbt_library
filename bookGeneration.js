function randomNumberWithDigits(n){
  var ret = ''
  for(var i = 0; i < n; i ++){
    var r = floor(random(10))
    ret += r.toString();
  }
  return ret;
}

function bookNumberWithPadding(bookNumber){
  var numbers_per_character_in_book = 5;
  return paddy( bigMath.abs(bookNumber), characters_in_each_page * pages_in_each_book * numbers_per_character_in_book)
}

function getContentsOfPage(pageNumber){
  //pageNumber starts at 0
  var beginning = pageNumber * 99
  var end = (pageNumber + 1) * 99
  return currentBookText.slice(beginning, end)
}

function bookNumberToContents(bookNumber){
  //bookNumber must be a STRING, not an actual number type
  //Largest character I know of is code point
  //65021 ﷽
  //74795 𒐫
  
  //First, reverse the book number
  //so that similar books are not adjacent
  bookNumber = reverseString(bookNumber);
  scrambleOffset = 0;
  bookNumber = bookNumberToString(bookNumber)
  var bookLength = bookNumber.length
  var contents = '';
  
  var scrambleIncrement = toScrambled(bookNumber[0], "scramble").charCodeAt(0) % visibleCodePoints.length;
  
  for(var i = 0; i < bookLength; i ++){
    var characterToAdd = toScrambled(bookNumber[i], "scramble")
    contents += characterToAdd
    // scrambleOffset += visibleCharactersString.indexOf(characterToAdd) + 7
    scrambleOffset += scrambleIncrement;
    scrambleOffset %= cp_length;
  }
  return contents;
}

function contentsToBookNumber(contents){
  scrambleOffset = 0;
  var unscrambled = '';
  
  var scrambleIncrement = contents[0].charCodeAt(0) % visibleCodePoints.length;
  
  for(var i = 0; i < contents.length; i ++){
    var characterToAdd = toScrambled(contents[i], "unscramble")
    unscrambled += characterToAdd;
    // scrambleOffset += visibleCharactersString.indexOf(contents[i]) + 7
    scrambleOffset += scrambleIncrement;
    scrambleOffset %= cp_length;
    
  }
  var bookNumber = stringToBookNumber(unscrambled)
  bookNumber = reverseString(bookNumber);
  return bookNumber;
}

function toScrambled(character, scrambleType){
  var codePoint = character.charCodeAt(0);
  if(scrambleType == 'scramble'){
    var index = visibleCodePoints.indexOf(codePoint)
    var new_index = (index + scrambleOffset) % cp_length
    return String.fromCodePoint(scrambledCodePoints[new_index])
  }
  if(scrambleType == 'unscramble'){
    var scrambled_index = scrambledCodePoints.indexOf(codePoint)
    var new_index = (scrambled_index - scrambleOffset)
    if(new_index < 0)new_index += cp_length
    return String.fromCodePoint(visibleCodePoints[new_index])
  }
}

function rc(){
  //Return a random Unicode character
  var i = floor(random(cp_length))
  return visibleCodePoints[i]
}

function bookNumberToString(bookNumber){
  /*Given a book's number, return a string where the
  characters in the string represent the number
  
  The following algorithm will cause there to be
  duplicate books. I'm resorting to this algorithm
  because I've failed to find resources online for
  converting arbitrarily large bases
  (in this case base 54363)
  */
  if(bookNumber.startsWith('-'))bookNumber = bookNumber.slice(1); //Remove the negative sign if one is present
  bookNumber = bookNumber.toString();
  var ret = ''
  for(var i = 0; i < bookNumber.length; i+= 5){
    var characterIndex = bookNumber.slice(i, i + 5) % visibleCodePoints.length
    ret += String.fromCodePoint( visibleCodePoints[characterIndex] )
  }
  return ret;
}

function stringToBookNumber(string){
  var ret = '';
  for(var i = 0; i < string.length;  i++){
    var characterIndex = visibleCodePoints.indexOf( string[i].charCodeAt(0) )
    characterIndex = paddy(characterIndex, 5, "0")
    ret += characterIndex
  }
  return ret;
}

function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

const bigMath = {
  abs(x) {
    return x < 0n ? -x : x
  },
  sign(x) {
    if (x === 0n) return 0n
    return x < 0n ? -1n : 1n
  },
  pow(base, exponent) {
    return base ** exponent
  },
  min(value, ...values) {
    for (const v of values)
      if (v < value) value = v
    return value
  },
  max(value, ...values) {
    for (const v of values)
      if (v > value) value = v
    return value
  },
}
