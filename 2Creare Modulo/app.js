/*Includiamo il modulo che abbiamo creato*/
var sm = require('./mioprimomodulo.js');

/*Utilizziamolo*/
console.log(sm.sum(1,2)); //echo 3
console.log(sm.product(1,2)); //echo 2;

/*Come possiamo vedere non avendo resa pubblica questa funzione
all'interno del modulo non possiamo utilizzarla quando lo importiamo*/
console.log(sm.private(1,2)); //error!