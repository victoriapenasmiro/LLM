var objInformacio;
var resultatsSeleccionats;
var llistaServ = new Array();

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

    //cambiamos el style de las etiquetas a
    $("#informacio a").css("cssText", "color: black !important;");

    $("#finalizarReserva").hide();
    $("#pagar").hide();
    $("#Qbici").hide();
    $("#isMandatory").hide();
    $("#dadesM").hide();
    $("#aCad").hide();

    //ocultarmos botón finalizar
    $("#finalizarToggle").click(function () { 
        $("#finalizarToggle").hide();
        $("#finalizarReserva").show();
    });

    //volvemos atras
    $("#volver").click(function () { 
        $("#informacio").parent().show();
        $("#serveis").show();
        $("#finalizarToggle").show();
        $("#pagar").hide();
    });

    //cancelamos el pago y volvermos a tras
    $("#cancelarCompra").click(function () { 
        $("#informacio").parent().show();
        $("#serveis").show();
        $("#finalizarToggle").show();
        $("#pagar").hide();
    });

    //checks serveis adicionals
    //click al call to action
    $("#guarderia").click(function() {
        var preu = parseFloat($("#guarderiaC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($('#guarderiaC').prop('checked')){
            $("#guarderiaC").prop('checked', false);
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el servei de guarderia");
        }else{
            $("#guarderiaC").prop('checked', true);
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós el servei de guarderia");
        }
    });

    //click al call to action
    //el preu de les bicis s'inclou una vegada s'ha indicat la quantita, ho controlant al fer click en #pagarToggle
    $('#bici').click(function() {
        if($('#biciC').prop('checked')){
            $("#biciC").prop('checked', false);
            alert("s'ha eliminat la bicicleta");
        }else{
            $("#biciC").prop('checked', true);
            $("#quantBicis").focus();
            alert("s'ha inclós el servei de bicicleta");
        }
        $("#Qbici").toggle();
    });

    //click al call to action
    $('#assegur').click(function() {
        var preu = parseFloat($("#assegurC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($("#assegurC").prop("checked")){
            $("#assegurC").prop('checked', false);
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el seguro de cancelació");
        }else{
            $("#assegurC").prop('checked', true);
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós l'assegurança");
        }
    });

    //click al call to action
    $('#cotxe').click(function() {
        var preu = parseFloat($("#cotxeC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($('#cotxeC').prop('checked')){
            $("#cotxeC").prop('checked', false);
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el lloguer del cotxe");
        }else{
            $("#cotxeC").prop('checked', true);
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós el cotxo de lloguer");
        }
    });

    //click al checkbox
    $("#biciC").click(function() {
        $("#Qbici").toggle();
        if($("#biciC").prop("checked")){
            $("#quantBicis").focus();
            alert("s'ha inclós el servei de bicicleta");
        }else{
            alert("s'ha eliminat la bicicleta");
        }
    });

    //click al checkbox
    $("#cotxeC").click(function() {
        var preu = parseFloat($("#cotxeC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($("#cotxeC").prop("checked")){
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós el cotxe de lloguer");
        }else{
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el cotxe");
        }
    });

    //click al checkbox
    $("#guarderiaC").click(function() {
        var preu = parseFloat($("#guarderiaC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($("#guarderiaC").prop("checked")){
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós el servei de guarderia");
        }else{
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat el servei de guarderia");
        }
    });

    //click al checkbox
    $("#assegurC").click(function() {
        var preu = parseFloat($("#assegurC").val());
        var actual = parseFloat($("#preuTotal").val());
        var nits = recuperarNumNits();
        if($("#assegurC").prop("checked")){
            var total = actual + (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha inclós l'assegurança");
        }else{
            var total = actual - (preu*nits);
            $("#preuTotal").val(total);
            alert("s'ha eliminat l'asseguraça");
        }
    });

    //verificamos que los campos mandatory esten rellenados para continuar
    $("#pagarToggle").click(function () { 
        if($("#name").val().length == 0 || $("#email").val().length == 0 || $("#telf").val().length == 0 ||
        ($("#Qbici").is(":visible") && $("#quantBicis").val() == "")){
            $("#isMandatory").show();
        }else{
            if($("#Qbici").is(":visible")){
                var preu = parseFloat($("#biciC").val());
                var actual = parseFloat($("#preuTotal").val());
                var numBicis = parseInt($("#quantBicis").val());
                var nits = recuperarNumNits();
                var total = actual + (preu*nits*numBicis);
                $("#preuTotal").val(total);
            }
            $("#finalizarReserva").hide();
            $("#pagar").show();
            $("#informacio").parent().hide();
            $("#serveis").hide();
            $("#isMandatory").hide();
        }
    });
});

function recuperarNumNits(){
    var nits = 0;
    for (selec of resultatsSeleccionats){
        if (parseInt(selec.numNits) > nits){
            nits = parseInt(selec.numNits);
        }
    }

    return nits;
}

function verificarEnviar(){
    var fecha = new Date();
    var mes = fecha.getMonth();
    var any = fecha.getFullYear();
    if($("#cad").val()<=mes && $("#anyCad").val()<=any){
        $("#aCad").show();
    }
    if($("#numT").val() == null || $("#cvvId").val() == "" || $("#titularT").val().length == 0){
        $("#dadesM").show();
    }   
    else{
        addServicios();
        addTitularReserva();
        addPagament();
        var jsonString = JSON.stringify(resultatsSeleccionats);
        document.getElementById("parJson").value = jsonString;
        document.getElementById("dispo").submit();
    }
}

//comprobamos servicios adicionales seleccionados y añadimos para enviar el json con todo
function addServicios(){
    /*format:
    servei.nom
    servei.preuIndividual
    servei.quantitat --> només per bicis
    */
    var filtres = document.getElementsByClassName("serveisAd");//$(".serveisAd");
    for (filtre of filtres){
        var servei = new Object();
        if(filtre.checked){
            servei.nom = $(filtre).attr("name");
            servei.preuInd = parseFloat($(filtre).val());
            if (servei.nom == "bicicleta"){
                servei.quantitat = parseInt($("#quantBicis").val());
            }
            llistaServ.push(servei);
        }
    }
    resultatsSeleccionats.push(llistaServ);
}

//añadimos datos del titular de la reserva
function addTitularReserva(){
    var client = new Object();
    /*format:
    client.nom
    client.email
    client.telefon
    */
    client.nomClient = $("#name").val();
    client.email = $("#email").val();
    client.telefon = $("#telf").val();
    resultatsSeleccionats.push(client);
}

//añadimos datos de pago
function addPagament(){
    var pago = new Object();
    /*format:
    pago.titular
    pago.numTargeta
    pago.mesCad
    pago.anyCad
    pago.codSeguretat
    pago.totalCost
    */
    pago.titular = $("#titularT").val();
    pago.numTargeta = $("#numT").val();
    pago.mesCad = $("#cad").val();
    pago.anyCad = parseInt($("#anyCad").val());
    pago.codSeguretat = $("#cvvId").val();
    pago.preuTotal = parseFloat($("#preuTotal").val());
    pago.comissioTotalReserva = calcularComissio();
    resultatsSeleccionats.push(pago);
}

//funció per calcular la comissio total de la reserva
function calcularComissio(){
    var comissioTotal = 0;
    var hotel = "";
    var nits = 0;
    hotelsJSON = obtenirParametreJSON();
    for (resultSelect of hotelsJSON) {
        hotel = getInfoExtesaResultat(resultSelect);
        nits = parseInt(resultSelect.numNits);
        comissioTotal += parseFloat(hotel.preu.comissio * nits);
    }
    return comissioTotal;
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
    var divF = "";

    var preuTotal = 0;
    for (infoPintar of llistaInfoPintar) {
        estrelles = recuperarEstrelles(infoPintar.hotel.estrelles);
        strHtml += "<div class=\"card mb-3 text-white bg-warning\" style=\"max-width: 800px;\">";
        strHtml += "<div class=\"row no-gutters\">";
        strHtml += "<div class=\"col-md-4\">";
        strHtml += "<img src=\""+ infoPintar.hab.fotosHabitacio[0] + "\" class=\"card-img\" alt=\"" + infoPintar.hab.nom + "\"/>";
        strHtml += "</div>";
        strHtml += "<div class=\"col-md-8\">";
        strHtml += "<div class=\"card-body\">";
        strHtml += "<h5 class=\"card-title\"><b>" + infoPintar.hotel.nom + estrelles + "</b></h5>";
        strHtml += "<h6 class=\"card-title\"><em>Habitació " + infoPintar.hab.nom + ": " + infoPintar.quantitat + " habitacions - Nits: " + infoPintar.nits + "</em></h6>";
        strHtml += "<p class=\"card-text\"><small class=\"text-white\">" + infoPintar.hab.descripcio + "</small></p>";
        strHtml += "<p class=\"card-text\">Preu net: " + (infoPintar.preu.base + infoPintar.preu.comissio) + " Impost: " + infoPintar.preu.impostPercent + "%.</p>"
        strHtml += "<a href=\"#\" onclick=\"mostrarFotos();\"><b>VEURE FOTOS HABITACIÓ</b></a>"
        strHtml += "<p class=\"card-text text-right mb-2\"><mark class=\"p-3 border border-success\"><b>TOTAL: " + (infoPintar.preu.total*infoPintar.quantitat*infoPintar.nits) + "</b></mark></p>";
        strHtml += "</div></div></div></div>";
        divF += "<div id='" + infoPintar.hotel.id + "_" + infoPintar.hab.nom + "' class='slider'></div>";
        preuTotal += infoPintar.preu.total * infoPintar.quantitat * infoPintar.nits;
        dosDecimals("preuTotal");
        
        //Jquery. Com el innerHtml però d'una altra forma.
        $("#informacio").html(strHtml);
        $("#fotosHab").html(divF);
        $("#fotosHab").hide();
        $("#preuTotal").val(preuTotal);

        //añadimos las fotos
        crearSlider(infoPintar.hab, infoPintar.hotel.id + "_" + infoPintar.hab.nom);
    };            
}

//agregam les fotos al div ocult de cada hotel
function crearSlider(hab, id){
    var strHtml = "";
    for (foto of hab.fotosHabitacio){
        strHtml += "<div><img src='"+ foto + "' alt=\"\"/></div>";
    }
    $("#" + id).html(strHtml);
}

//mostram fotos habitació - slider
function mostrarFotos(){
    $("#fotosHab").toggle();
    $(".slider").bxSlider().redrawSlider();
}