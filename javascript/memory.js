
function verifId(id){
	var reg = /^[\d]+$/;
	if (id.value == "") {
		alert('Attention, il faut indiquer un identifiant !'); 
		id.focus();
    	return false;
	} 
	else if (reg.test(id.value)) return true;
    else {
    	alert('Attention, l\'identifiant semble mal construit');
    	id.focus();
    	return false;
    }
}

function createXhrObject(){
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();
    else if (window.ActiveXObject){
        var names = ["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
        for(var i in names){
            try{ return new ActiveXObject(names[i]); }
            catch(e){}
        }
    }
    window.alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
    return null; // non supporté
}

function getAlgo(id,nom){
if (verifId(id)) {
	//window.alert("Creation de xhr");
	xhr = createXhrObject();
	//xhr.onreadystatechange = function(){};
	//window.alert("Envoie de la requete au serveur");
	xhr.open("GET", encodeURI("../initMemory/get.php?type=AlgoML&id="+id.value), false); xhr.send(null);
	if ((xhr.readyState  == 4) && (xhr.status  == 200)) {
        var xml_code = xhr.responseXML; 
        //window.alert("Reponse : "+xml_code);
        algoXML = xml_code.getElementsByTagName("Algorithm");
        if (algoXML.length == 1) algo = algoXML.item(0);
        else {
        	id.value = '';
        	window.alert("Problème de chargement : "+xml_code.getElementsByTagName('erreur').item(0).firstChild.data);
        }
    } else window.alert("Impossible d'accéder au serveur, vérifiez votre connection.");
	return algo;
} else return null;
}

function putAlgo(id,algo,nom){
	//window.alert("Creation de xhr");
	var reg = /^[\d]+$/;
	var idVal = 0;
	if (reg.test(id.value)) idVal = id.value;
	else id.value = "-- En attente du numéro --";
	xhr = createXhrObject();
	xhr.onreadystatechange = function(){
		if(xhr.readyState  == 4) {
		   if(xhr.status  == 200) {
		        var xml_code = xhr.responseXML; 
		        //window.alert("Reponse : "+xml_code);
		        var idXML = xml_code.getElementsByTagName('id');
		        if (idXML.length == 1) {
		        	id.value = idXML.item(0).getAttribute('value');
		        	if (id.value == idVal) window.alert("Modification effectuée");
		        	else window.alert("Enregistrement effectué");
		        } else {
		        	id.value = '';
		        	window.alert("Problème de mémorisation "+xml_code.getElementsByTagName('erreur').item(0).firstChild.data);
		        }
		   } else window.alert("Impossible d'accéder au serveur, vérifiez votre connection.");
		}
	};
	var codeXML = "";
	if (idVal == 0) codeXML = ('type=AlgoML&nom='+nom+'&codeXML='+algo);
	else codeXML = ('id='+idVal+'&type=AlgoML&nom='+nom+'&codeXML='+algo);
	//window.alert("Envoie de la requete au serveur : "+codeXML);
	xhr.open("POST", encodeURI("../../initMemory/put.php"), true); 
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
	xhr.send(codeXML);
	return true;
} 

function printAlgo(algo,nom) {
	xhr = createXhrObject();
	xhr.onreadystatechange = function(){
		if(xhr.readyState  == 4) {
		   if(xhr.status  == 200) {
		        var xml_code = xhr.responseXML; 
		        //window.alert("Reponse : "+xml_code);
		        var ficXML = xml_code.getElementsByTagName('file');
		        if (ficXML.length == 1) {
		        	var file = ficXML.item(0).firstChild.data;
					var fenetre = window.open(file,'toolbar=no,scrollbars=no,width=200,height=150');
					fenetre.title = "Algo";					fenetre.print();
		        } else {
		        	window.alert("Problème de traitement "+xml_code.getElementsByTagName('erreur').item(0).firstChild.data);
		        }	        
		   } else window.alert("Impossible d'accéder au serveur, vérifiez votre connection.");
		}
	};
	var codeXML = "";
	codeXML = ('type=AlgoML&nom='+nom+'&codeXML='+algo);
	//window.alert("Envoie de la requete au serveur : "+codeXML);
	xhr.open("POST", encodeURI("../../initMemory/print.php"), true); 
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
	xhr.send(codeXML);
	return true;
}
