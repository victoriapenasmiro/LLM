var llistatHotels;
var resultatsSeleccionats;

//Funció per obtenir el parametre que hem enviat pel mètode GET.(strJSon).
function obtenirParametreJSON() {
    //Recupera els parametres de la URL
    var queryString = window.location.search;
    //Ho convertim a un objecte que ens ajudarà a cercar els diferents parametres dins la URL
    var urlParams = new URLSearchParams(queryString);

    //Obtenim el paràmetre strJson de la llista.
    var strJsonEncodedURL = urlParams.get("parJson")
    //Decodificam els paramtres, que si mirau com està codificat l'anterior string veureu que no es pot llegir.
    var strJson = decodeURIComponent(strJsonEncodedURL)

    //Tornam el valor
    return JSON.parse(strJson);
}

//Funció per carregar Json
function loadJSON(callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.responseType = 'json';
    //Molt alerta! si la url es un fitxer local no ens funcionarà sense canviar els permisos del navegador. Per aquest motiu ho he pujat a un fitxer de gitHub.
    xobj.open('GET', 'https://raw.githubusercontent.com/victoriapenasmiro/LLM/master/Practica%20gestioHotels/3hotelsdata.json', true);

    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.response);
        }
    };
    xobj.send(null);
}
      
$(document).ready(function () {
    loadJSON(function (response) {
        // Parse JSON string into object
        llistatHotels = response;//JSON.parse(response);
        resultatsSeleccionats = obtenirParametreJSON();
        /*
        [{"hotelId":1,"habId":30,"tempAlta":true,"agregadorId":"2","preu":108.9,"numHabSeleccionades":1,"numNits":"1"}]
        var habitacioSeleccionada = new Object();
        habitacioSeleccionada.hotelId = hotelId;
        habitacioSeleccionada.habId = habId;
        habitacioSeleccionada.tempAlta = tempAlta;
        habitacioSeleccionada.agregadorId = provId;
        habitacioSeleccionada.preu = preu;
        habitacioSeleccionada.numHabSeleccionades = numHabSeleccionades;
        habitacioSeleccionada.numNits = document.getElementById("nits").value;
        */
        var infoExtesaResultatsSeleccionats = new Array();
        for (resultSelect of resultatsSeleccionats) {
            infoExtesaResultatsSeleccionats.push(getInfoExtesaResultat(resultSelect));                    
        }
        //Ja tenim tota la informació dins l'array. Ara pintarem aqueta informació.
        pintatResultats(infoExtesaResultatsSeleccionats);
    });
});

//A partir de les ids que ens arriba per parametre. Obtindrem la informació extesa de cada entitat. Hotel, Habitacio i Preu.
//Ho insetarem dins un objecte per tenir més accessible aquesta informació. 
function getInfoExtesaResultat(resultat) {
    var infoResultat = new Object;
    /*
    L'objecte tendrà aquest format. El mateix que disponibilitat. Però amb quantitat de resultats seleccionats.
    infoResultat.hotel 
    infoResultat.hab 
    infoResultat.preu 
    infoResultat.quantitat
    infoResultat.nits
    */
    //Cercarem la informació seleccionada. Per cada hotel, per cada habitacio, per cada preu. Com el recorregut que feiem a disponibilitat. 
    for (objHotel of llistatHotels) {               
        if (objHotel.id == resultat.hotelId) {
            infoResultat.hotel = objHotel;
            for (objHab of objHotel.habitacions) {
                if (objHab.id == resultat.habId) {
                    infoResultat.hab = objHab;
                    //jo tengo tarifas, temporada -- > precios
                    if(resultat.tempAlta){
                        for (objPreu of objHab.tarifes.temporadaAlta) {
                            if ((objPreu.agregadorId == resultat.agregadorId)) {
                                infoResultat.preu = objPreu.total;
                                infoResultat.quantitat = resultat.numHabSeleccionades;
                                infoResultat.nits = resultat.numNits;
                            }
                        }
                    }else{
                        for (objPreu of objHab.tarifes.temporadaBaixa) {
                            if ((objPreu.agregadorId == resultat.agregadorId)) {
                                infoResultat.preu = objPreu.total;
                                infoResultat.quantitat = resultat.numHabSeleccionades;
                                infoResultat.nits = resultat.numNits;
                            }
                        }
                    }
                }//if hab
            }//for hab
        }//if
    }//for hot
    return infoResultat;
}

//Pintar la informació per pantalla. 
function pintatResultats(llistaInfoPintar) {
    /* Tenim aquesta informació dins el parametre que rebem.
    llistaInfoPintar.hotel 
    llistaInfoPintar.hab 
    llistaInfoPintar.preu 
    llistaInfoPintar.quantitat
    */
    var strHtml = "";

    var preuTotal = 0;
    for (infoPintar of llistaInfoPintar) {
        strHtml += "<div>Quantitat: " + infoPintar.quantitat + "</div>";
        strHtml += "<div>Hotel:" + infoPintar.hotel.nom + " estrelles:" + infoPintar.hotel.estrelles + "</div>";
        strHtml += "<div>Habitacio:" + infoPintar.hab.nom + " Llits individuals:" + infoPintar.hab.llitIndiv + " Llits Dobles:" + infoPintar.hab.llitDoble + "</div>";
        strHtml += "<div>Preu net:" + infoPintar.preu.valorNet + " Impost:" + infoPintar.preu.impost + "% Preu Total:" + infoPintar.preu.valorTotal + "</div>";
        preuTotal += infoPintar.preu.valorTotal * infoPintar.quantitat;
        //strHtml +=  Array(16).join('wat' - 1) + ' Batman!';
        //Jquery. Com el innerHtml però d'una altra forma.
        $("#informacio").html(strHtml);
        $("#preuTotal").text(preuTotal);
    };            
}      