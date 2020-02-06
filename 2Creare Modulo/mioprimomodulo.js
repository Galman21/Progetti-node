/* Questo file javascript mioprimomodulo.js sarà a tutti gli effetti un modulo*/

var sum = function (a, b) { //definiamo la funzione sum
    return a + b;
  }
  
  var product = function (a, b) { //definiamo la funzione product
    return a * b;
  }
  
  var private = function (a, b) {
    return "Io sono private!!";
  }
  
  /*Vogliamo rendere pubbliche solo queste due funzioni a chi importa il modulo*/
  exports.sum = sum; //esportiamo la funzione sum
  exports.product = product; //esportiamo la funzione product