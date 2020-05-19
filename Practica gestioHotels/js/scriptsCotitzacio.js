var objInformacio;
var resultatsSeleccionats;
var serveisAdicionals;

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
        objInformacio = response;//JSON.parse(response);
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

    //verificamos que los campos mandatory esten rellenados para continuar
    $("#pagarToggle").click(function () { 
        if($("#name").val().length == 0 || $("#email").val().length == 0 || $("#telf").val().length == 0){
            $("#isMandatory").removeClass("ocultar");
        }else{
            $("#finalizarReserva").addClass("ocultar");
            $("#pagar").removeClass("ocultar");
            $("#informacio").parent().addClass("ocultar");
            $("#serveis").addClass("ocultar");
        }
    });

    //ocultarmos botón finalizar
    $("#finalizarToggle").click(function () { 
        $("#finalizarToggle").addClass("ocultar");
        $("#finalizarReserva").removeClass("ocultar");
        $("#finalizarReserva").addClass("row justify-content-center");
    });

    //volvemos atras
    $("#volver").click(function () { 
        $("#informacio").parent().removeClass("ocultar");
        $("#serveis").removeClass("ocultar");
        $("#finalizarToggle").removeClass("ocultar");
        $("#pagar").addClass("ocultar");
    });

    //cancelamos el pago y volvermos a tras
    $("#cancelarCompra").click(function () { 
        $("#informacio").parent().removeClass("ocultar");
        $("#serveis").removeClass("ocultar");
        $("#finalizarToggle").removeClass("ocultar");
        $("#pagar").addClass("ocultar");
    });

    //checks serveis adicionals
    $('#guarderia').click(function() {
        if($('#guarderiaC').prop('checked')){
            $("#guarderiaC").prop('checked', false);
            var preu = $("#guarderiaC").val();
            var actual = $("#preuTotal").val();
            var total = actual - (preu*resultatsSeleccionats.numNits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el servei de guarderia");
        }else{
            $("#guarderiaC").prop('checked', true);
            var preu = $("#guarderiaC").val();
            var actual = $("#preuTotal").val();
            var total = actual + (preu*resultatsSeleccionats.numNits);
            $("#preuTotal").val(total);
            alert("s'ha inclós el servei de guarderia");
        }
    });

    $('#bici').click(function() {
        if($('#biciC').prop('checked')){
            $("#biciC").prop('checked', false);
            $("#Qbici").addClass("ocultar");
            alert("s'ha eliminat la bicicleta");
        }else{
            $("#biciC").prop('checked', true);
            $("#Qbici").removeClass("ocultar");
            $("#Qbici input").focus();
            alert("s'ha inclós el servei de bicicleta");
        }
    });

    $('#assegur').click(function() {
        if($('#assegurC').prop('checked')){
            $("#assegurC").prop('checked', false);
            alert("s'ha eliminat el seguro de cancelació");
        }else{
            $("#assegurC").prop('checked', true);
            alert("s'ha inclós l'assegurança");
        }
    });

    $('#cotxe').click(function() {
        if($('#cotxeC').prop('checked')){
            $("#cotxeC").prop('checked', false);
            alert("s'ha eliminat el lloguer del cotxe");
        }else{
            $("#cotxeC").prop('checked', true);
            alert("s'ha inclós el cotxo de lloguer");
        }
    });
});

function verificarEnviar(){
    var fecha = new Date();
    var mes = fecha.getMonth();
    if($("#cad").val()<=mes){
        $("#aCad").removeClass("ocultar");
    }else{
        addServicios();
        var jsonString = JSON.stringify(serveisAdicionals);
        document.getElementById("parJson").value = jsonString;
        document.getElementById("dispo").submit();
    }
}

//comprobamos servicios adicionales seleccionados
function addServicios(){
    var servei = new Object;
    /*format:
    servei.nom
    servei.preuIndividual
    servei.quantitat --> només per bicis
    */
}

//A partir de les ids que ens arriba per parametre. Obtindrem la informació extesa de cada entitat. Hotel, Habitacio i Preu.
//Ho insetarem dins un objecte per tenir més accessible aquesta informació. 
function getInfoExtesaResultat(resultat) {
    var infoResultat = new Object;
    /*
    L'objecte tendrà aquest format. El mateix que disponibilitat. Però amb quantitat de resultats seleccionats.
    infoResultat.hotel 
    infoResultat.hab
    infoResultat.tipus
    infoResultat.preu 
    infoResultat.quantitat
    infoResultat.nits
    infoResultat.foto
    */
    //Cercarem la informació seleccionada. Per cada hotel, per cada habitacio, per cada preu. Com el recorregut que feiem a disponibilitat. 
    for (objHotel of objInformacio.hotels) {
        if (objHotel.id == resultat.hotelId) {
            infoResultat.hotel = objHotel;
            for (objHab of objHotel.habitacions) {
                if (objHab.id == resultat.habId) {
                    infoResultat.hab = objHab;
                    if(resultat.tempAlta){
                        for (objPreu of objHab.tarifes.temporadaAlta) {
                            if ((objPreu.preu.agregadorId == resultat.agregadorId)) {
                                infoResultat.preu = objPreu.preu;
                                infoResultat.quantitat = resultat.numHabSeleccionades;
                                infoResultat.nits = resultat.numNits;
                            }
                        }
                    }else{
                        for (objPreu of objHab.tarifes.temporadaBaixa) {
                            if ((objPreu.preu.agregadorId == resultat.agregadorId)) {
                                infoResultat.preu = objPreu.preu;
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
    llistaInfoPintar.nits
    */
    var estrelles = "";
    var strHtml = "";

    var preuTotal = 0;
    for (infoPintar of llistaInfoPintar) {
        estrelles = recuperarEstrelles(infoPintar.hotel.estrelles);
        strHtml += "<div class=\"card mb-3 text-white bg-warning\" style=\"max-width: 800px;\">";
        strHtml += "<div class=\"row no-gutters\">";
        strHtml += "<div class=\"col-md-4\">";
        strHtml += "<img src=\""+ infoPintar.hab.fotosHabitacio[0] + "\" class=\"card-img\" alt=\"" + infoPintar.hab.nom + "\">";
        strHtml += "</div>";
        strHtml += "<div class=\"col-md-8\">";
        strHtml += "<div class=\"card-body\">";
        strHtml += "<h5 class=\"card-title\"><b>" + infoPintar.hotel.nom + estrelles + "</b></h5>";
        strHtml += "<h6 class=\"card-title\"><em>Habitació " + infoPintar.hab.nom + ": " + infoPintar.quantitat + " habitacions - Nits: " + infoPintar.nits + "</em></h6>";
        strHtml += "<p class=\"card-text\"><small class=\"text-white\">" + infoPintar.hab.descripcio + "</small></p>";
        strHtml += "<p class=\"card-text\">Preu net: " + (infoPintar.preu.base + infoPintar.preu.comissio) + " Impost: " + infoPintar.preu.impostPercent + "%.</p>"
        strHtml += "<p class=\"card-text text-right mb-2\"><mark class=\"p-3 border border-success\"><b>TOTAL: " + (infoPintar.preu.total*infoPintar.quantitat*infoPintar.nits) + "</b></mark></p>";
        strHtml += "</div></div></div></div>";
        preuTotal += infoPintar.preu.total * infoPintar.quantitat * infoPintar.nits;
        dosDecimals("preuTotal");
        //Jquery. Com el innerHtml però d'una altra forma.
        $("#informacio").html(strHtml);
        $("#preuTotal").val(preuTotal);
    };            
}

//ocultam form finalització y desplegam pagament