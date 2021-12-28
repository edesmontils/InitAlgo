/* 
Fonctions définies :
	- exe(Conteneur) : cette fonction identifie le bloc principal et appelle la fonction récursive d'execution d'un bloc
	- executer(Conteneur) : fonction récursive permettant d'executer le bloc Conteneur, tout ses fils et tout les bloc suivant celui-ci
	- popup(page) : ouvre une nouvelle page ???
	
Nécessite le chargement préalable de "analyseur.js"
*/
//alert("frame0.js !");

//====================================================================================================
function trim(CdC) {return CdC.replace(/(?:^\s+|\s+$)/g, "");}

//====================================================================================================
function instructionbidonservanatoutstopper(){Error("Fin de l'exécution !");exit();}

//====================================================================================================
function rechercheVariable(nom) {
	var trouve=false; 
	var j = 0;
	//on parcour le tableau de variable
	while ((j < parent.TabVariables.length) && (!trouve)){ 												
		trouve= (parent.TabVariables[j][0]==nom);
		if (!trouve) j += 1;
	}
	if (trouve) return j;
    else return -1;
}

//====================================================================================================
function popup(page) {
	window.open(page);
	bodypage = window.document.getElementsByTagName("body-main")[0];				
}

//====================================================================================================
function exe(Conteneur){ 
	//cette fonction identifie le bloc principal et appelle la fonction récursive d'execution d'un bloc
	//on vide le tableau de variable car on recommence une nouvelle éxecution
	parent.TabVariables=[[]]; 
	var fils = Conteneur.childNodes; 
    alert("---> Début Algorithme <---");
	for(var i = 0; i < fils.length-1; i++){ //parcours des fils de conteneur
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			executer(fils[i]);
		}
	}
	alert("---> Fin Algorithme <---");
} 

//====================================================================================================
function executer(Conteneur){
	//fonction récursive permettant d'executer le bloc Conteneur, tout ses fils et tout les bloc suivant celui-ci
	if (Conteneur.title == 'Sortie') { 
		//si le bloc est une sortie											
		execSortie(Conteneur);
	} else if (Conteneur.title == 'Entree') {
		//si le bloc est une entrée
		execEntree(Conteneur);
	} else if (Conteneur.title == 'Tant que...faire...') {  
		//si c'est un bloc tant que faire								 
		execTantQue(Conteneur);																			
	} else if (Conteneur.title == "Répéter... jusqu'à") {
		//si c'est un bloc répéter jusqu'a
		execRepeterJusqua(Conteneur);
	} else if ((Conteneur.title == 'Affectation')
	           ||(Conteneur.title == 'initialisation')
	           ||(Conteneur.title == 'incrémentation'))  {
		//s'il sagit d'un bloc d'affectation ou de l'initialisation ou de l'incrémentation d'une boucle pour
		execAffectation(Conteneur);
	} else if (Conteneur.title == 'Si... alors... sinon...') {
		//si c'est un si alors sinon
		execSiAlorsSinon(Conteneur);						 
	} else if (Conteneur.title == 'Boucle Pour') {
		//si c'est une boucle pour
		execPour(Conteneur);						
	} else if (Conteneur.title == 'super block') { //si c'est un super bloc, on execute les blocs fils
		var petifils = Conteneur.childNodes; 
		for(var z = 0; z < petifils.length-1; z++){ 
			if(petifils[z].nodeType==1){ //si c'est un Objet Element 
				if (petifils[z].className == 'sous block') {
					executer(petifils[z]);		
				}
			}
		}			  
	}
}

//====================================================================================================
// Ajouter un parcours initial pour repérer les variables... ???
function toAlgoML(Conteneur, zoneNom){ //alert("toAlgoML");
	//cette fonction identifie le bloc principal et appelle la fonction récursive de souvegarde d'un bloc
	var fils = Conteneur.childNodes;
	var nom = zoneNom.value;
	var chaine = "";//"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" ;
	var dec = "  ";
	//chaine += "<?xml-stylesheet type=\"text/xsl\" href=\"../xml/AlgoML.xsl\"?>\n";
	//chaine += "<!--DOCTYPE Algorithm SYSTEM \"http://www.desmontils.net/tools/AlgoML/AlgoML.dtd\"-->\n";
	chaine += "<Algorithm id=\""+nom+"\" name=\""+nom+"\" Author=\"initAlgo\" Version=\"1\">\n";
	chaine += "  <Imports_list>\n    <Import id=\"Ecrire\" type=\"function\"/>\n    <Import id=\"Lire\" type=\"function\"/>\n    <Import id=\"out\" type=\"global\"/>\n    <Import id=\"in\" type=\"global\"/>\n  </Imports_list>\n";
	parent.TabVariables=[]; 
	//recupVariables(Conteneur);
    var chaineCode = "  <Code>\n";
	for(var i = 0; i < fils.length-1; i++){ //parcours des fils de conteneur
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			chaineCode += save_conteneur(fils[i], dec);
		}
	}
	chaineCode += "  </Code>\n";

	if (parent.TabVariables.length>0) {
		var j = 0;
		chaine += "  <VarDecl>\n";
		//on parcour le tableau de variable
		while (j < parent.TabVariables.length){ 												
			nom = parent.TabVariables[j][0];
			typeNom = parent.TabVariables[j][1];
			chaine += "    <Var id=\"" + nom + "\" Type=\""+typeNom+"\"/>\n";
			j += 1;
		}
		chaine += "  </VarDecl>\n";
	}

    chaine += chaineCode;
	chaine += "</Algorithm>\n";
	//alert(chaine);
	return chaine;
} 

//====================================================================================================
function saveAlgo(Conteneur,zoneNom,zoneId){ //alert("Enegistrement");
	var algoXML = toAlgoML(Conteneur, zoneNom);
	putAlgo(zoneId, algoXML, zoneNom);
	//alert("TODO");} 
//====================================================================================================
function loadAlgo(Conteneur,zoneNom,zoneId){ //alert("Chargement");
	alert("TODO");} 
//====================================================================================================
function seeAlgo(Conteneur,zoneNom,zoneId){ //alert("Impression");
	var algoXML = toAlgoML(Conteneur, zoneNom);
	printAlgo(algoXML,zoneNom.value);
	//alert("fin");} 

//====================================================================================================
function save_conteneur(Conteneur, dec){
	var chaine = "";
	dec += "  ";
	//fonction récursive permettant d'executer le bloc Conteneur, tout ses fils et tout les bloc suivant celui-ci
	if (Conteneur.title == 'Sortie') { 
		//si le bloc est une sortie											
		chaine = saveSortie(Conteneur, dec);
	} else if (Conteneur.title == 'Entree') {
		//si le bloc est une entrée
		chaine = saveEntree(Conteneur, dec);
	} else if (Conteneur.title == 'Tant que...faire...') {  
		//si c'est un bloc tant que faire								 
		chaine = saveTantQue(Conteneur, dec);																			
	} else if (Conteneur.title == "Répéter... jusqu'à") {
		//si c'est un bloc répéter jusqu'a
		chaine = saveRepeterJusqua(Conteneur, dec);
	} else if ((Conteneur.title == 'Affectation')
	           ||(Conteneur.title == 'initialisation')
	           ||(Conteneur.title == 'incrémentation'))  {
		//s'il sagit d'un bloc d'affectation ou de l'initialisation ou de l'incrémentation d'une boucle pour
		chaine = saveAffectation(Conteneur, dec);
	} else if (Conteneur.title == 'Si... alors... sinon...') {
		//si c'est un si alors sinon
		chaine = saveSiAlorsSinon(Conteneur, dec);						 
	} else if (Conteneur.title == 'Boucle Pour') {
		//si c'est une boucle pour
		chaine = savePour(Conteneur, dec);						
	} else if (Conteneur.title == 'super block') { //si c'est un super bloc, on execute les blocs fils
		var petifils = Conteneur.childNodes; 
		//alert('super block');
		//chaine = "<Code>\n";
		for(var z = 0; z < petifils.length-1; z++){ 
			if(petifils[z].nodeType==1){ //si c'est un Objet Element 
				if (petifils[z].className == 'sous block') {
					chaine += save_conteneur(petifils[z], dec);		
				}
			}
		}
		//chaine += "</Code>\n";		  
	}
	return chaine;
}

//====================================================================================================
function execSortie(Conteneur) {
	var Expression=Conteneur.getElementsByTagName('input')[0].value;
	//on évalue ce qu'il y a dans le champ de saisie du bloc c'est dans analyseur.js
	var Resultat=parent.AnalyseExpression(Expression,parent.TabVariables); 
	if (Resultat != undefined) {
		//ouvre une boite de dialogue permettant d'aficher le résultat de l'évaluation du champs de saisie
		alert(Resultat);
	}
}

//====================================================================================================
function saveSortie(Conteneur, dec) {
	var Expression=Conteneur.getElementsByTagName('input')[0].value;
	tabExp = Expression.split(",");
	var chaine = dec+"<Call name=\"Ecrire\">\n";//+dec+"  <ParamVal name=\"out\"/>\n";
	var i = 0;
	var long = tabExp.length;
	while(i<long) {
		tabExp[i] = trim(tabExp[i]);
		if (parent.EstVariable(tabExp[i])) {
			chaine += dec+"  <ParamVal name=\""+tabExp[i]+"\"/>\n";
			if (rechercheVariable(tabExp[i])<0) parent.TabVariables.push([tabExp[i],"Valeur"]);
		} else { 
			chaine += dec+"  <ParamVal>"+tabExp[i]+"</ParamVal>\n";
		}
		i += 1;
	}
	return chaine+dec+"</Call>\n";
}

//====================================================================================================
function execEntree(Conteneur) {
	var nomvar=Conteneur.getElementsByTagName('input')[0].value;
	if (!parent.EstVariable(nomvar)){
		//on vérifie que ce qui est dans le champ de saisie correspont à un nom de variable correcte
		//on affiche un message d'erreur si ce n'est pas un nom de variable correcte
 		alert(nomvar+" est incorrecte, execution intérompue");
 		//pour intérompre totalement l'execution on appelle une instruction fictive
  		instructionbidonservanatoutstopper();																						
	}
	do {//tant que la saisie vaut null ou que l'analyse de la saisie renvoie 
		//ouvre une boite de dialogue permettant à l'utilisateur d'entrer quelque chose
		var saisie = prompt("", "");
		if (saisie!=null) { //si la saisie est différent de null (si il n'a pas cliquer sur annuler)
			var saisiana=parent.AnalyseExpression(saisie,parent.TabVariables); //on évalue la saisie
			if (saisiana == undefined){
				alert(saisie+" est incorecte, recommencez"); //en cas de saisie incorrecte, message d'erreur
			}
		}
	} while ((saisie==null) || (saisiana == undefined));
	var trouve=false; 
	//on parcour le tableau de variable
	for(var j = 0; j < parent.TabVariables.length; j++){ 												
		if (parent.TabVariables[j][0]==nomvar){//si on a trouvé la variable dans le tableau de variable on met à jour sa valeur
			parent.TabVariables[j][1]=saisiana;				
			trouve=true;
		}
	}
	if (!trouve){ 
		//si on n'a pas trouvé la valeur dans le tableau on l'ajoute avec sa valeur
		  parent.TabVariables.push([nomvar,saisiana]);
			 
	}
}

//====================================================================================================
function saveEntree(Conteneur, dec) {
	var nomvar=Conteneur.getElementsByTagName('input')[0].value;
	if (rechercheVariable(nomvar)<0) parent.TabVariables.push([nomvar,"Valeur"]);
	var res = dec+"<Call name=\"Lire\">\n";
	//res += dec+"  <ParamVal name=\"in\"/>\n";
	res += dec+"  <ParamVal name=\""+nomvar+"\"/>\n"+dec+"</Call>\n";
}

//====================================================================================================
function execTantQue(Conteneur) {
	var petifils = Conteneur.childNodes; 
	//on parcour ses fils
	for(var z = 0; z < petifils.length-1; z++){ 
		if (petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].className == 'block1'){//on a trouvé le bloc fils
				 var block=petifils[z]; 
			} else if (petifils[z].className == 'condition1'){//on a trouvé la condition
					//on analyse ceu qu'il y a dans le champ de saisie de la condition
					var Expression=petifils[z].getElementsByTagName('input')[0].value;
					var condition=parent.AnalyseExpression(Expression,parent.TabVariables); 
			}
		}
	}
	if (typeof(condition)=="boolean"){	//si on a bien trouvé un boléen												
 		//tant que la condition est vrai on execute le bloc fils
		while (parent.AnalyseExpression(Expression,parent.TabVariables))  {
			executer(block);
		}								
	} else {
		//message d'erreur et intéruption de l'execution si l'analyse du champ de la condition n'a pas renvoyé un booléen
		 alert("Attention "+Expression+" n'est pas une expression booléenne valide");
		  instructionbidonservanatoutstopper();
	}
}

//====================================================================================================
function saveTantQue(Conteneur, dec) {
	var petifils = Conteneur.childNodes; 
	var chaine = dec+"<While>\n";
	//on parcour ses fils
	for(var z = 0; z < petifils.length-1; z++){ 
		if (petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].className == 'block1'){//on a trouvé le bloc fils
				 chaine += save_conteneur(petifils[z], dec+"  "); 
			} else if (petifils[z].className == 'condition1'){//on a trouvé la condition
					//on analyse ceu qu'il y a dans le champ de saisie de la condition
					var Expression=petifils[z].getElementsByTagName('input')[0].value;
					chaine += dec+"  <Cond>"+Expression+"</Cond>\n"+dec+"<Code>\n";
			}
		}
	}
	chaine += dec+"  </Code>\n"+dec+"</While>\n";
	return chaine;
}

//====================================================================================================
function execRepeterJusqua(Conteneur) {
	 //même principe qu'avec tant que faire, en utilisant do {} while au lieu de while {}.
	var petifils = Conteneur.childNodes; 		 
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element			
			if (petifils[z].className == 'block1'){
				var block=petifils[z]; 
			} else if (petifils[z].className == 'condition1'){
				var Expression = petifils[z].getElementsByTagName('input')[0].value;
			}
		}
	}
		do { 
			executer(block);
		var condition=parent.AnalyseExpression(Expression,parent.TabVariables); 
		if (typeof(condition)!="boolean"){		
		alert("Attention "+Expression+" n'est pas une expression booléenne valide");
			 instructionbidonservanatoutstopper();
		}
	} while (!condition);
}

//====================================================================================================
function saveRepeterJusqua(Conteneur, dec) {
	 //même principe qu'avec tant que faire, en utilisant do {} while au lieu de while {}.
	var petifils = Conteneur.childNodes; 
	var chaine = dec+"<Repeat>\n"+dec+"  <Code>\n\n";
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element			
			if (petifils[z].className == 'block1'){
				var block=petifils[z]; 
				chaine += save_conteneur(block, dec);
			} else if (petifils[z].className == 'condition1'){
				var Expression = petifils[z].getElementsByTagName('input')[0].value;
				chaine += dec+"  </Code>\n"+dec+"  <Cond>"+Expression+"</Cond>\n";
			}
		}
	}
	chaine += "</Repeat>\n";
	return chaine;
}

//====================================================================================================
function execAffectation(Conteneur) {
	var nomvariable=Conteneur.getElementsByTagName('input')[0].value;
	var Expression=Conteneur.getElementsByTagName('input')[1].value;
	var Resultat=parent.AnalyseExpression(Expression,parent.TabVariables); 
	if (!parent.EstVariable(nomvariable)){
		alert(nomvariable+" est incorecte, execution interrompue");
  		instructionbidonservanatoutstopper();
	}
	if (Resultat == undefined){
		alert(Expression+" est incorecte, execution interrompue");
 		 instructionbidonservanatoutstopper();
	} else {
		var trouve=false;
		for(var j = 0; j < parent.TabVariables.length; j++){ 		
			if (parent.TabVariables[j][0]==nomvariable){
				parent.TabVariables[j][1]=Resultat;
				trouve=true;
			}
		}
		if (!trouve){ 
			  parent.TabVariables.push([nomvariable,Resultat]);	 
		}
	}		
}

//====================================================================================================
function saveAffectation(Conteneur, dec) {
	var nomvariable=Conteneur.getElementsByTagName('input')[0].value;
	var Expression=Conteneur.getElementsByTagName('input')[1].value;
	if (rechercheVariable(nomvariable)<0) parent.TabVariables.push([nomvariable,"Valeur"]);
	return dec+"<Let Var=\""+nomvariable+"\">"+Expression+"</Let>\n";
}

//====================================================================================================
function execSiAlorsSinon(Conteneur){
	var block1;
	var block2;							 
	var petifils = Conteneur.childNodes; 
	//on parcour les fils pour indentifier les 2 blocs fils et la condition
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].className == 'block1'){ 	
				block1=petifils[z];																							
			} else if (petifils[z].className == 'block2'){
				block2=petifils[z];						
			} else if (petifils[z].className == 'condition1'){
				var Expression=petifils[z].getElementsByTagName('input')[0].value;
			}
		}
	}		  
																				
	if (typeof(	parent.AnalyseExpression(Expression,parent.TabVariables))!="boolean"){		
		alert("Attention "+Expression+" n'est pas une expression booléenne valide");
		instructionbidonservanatoutstopper();
	}
	//si l'analyse de l'expression renvoie true, on execute block1, sinon block2
	if (parent.AnalyseExpression(Expression,parent.TabVariables)){
		 executer(block1);
	} else executer(block2);
}

//====================================================================================================
function saveSiAlorsSinon(Conteneur, dec){
	var block1;
	var block2;							 
	var petifils = Conteneur.childNodes; 
	var chaine = dec+"<If>\n";
	//on parcour les fils pour indentifier les 2 blocs fils et la condition
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].className == 'block1'){ 	
				block1=petifils[z];
				chaine += dec+"  <Then><Code>\n"+save_conteneur(block1, dec+"  ")+dec+"  </Code></Then>\n";
			} else if (petifils[z].className == 'block2'){
				block2=petifils[z];
				chaine += dec+"  <Else><Code>\n"+save_conteneur(block2,dec+"  ")+"  </Code></Else>\n";
			} else if (petifils[z].className == 'condition1'){
				var Expression=petifils[z].getElementsByTagName('input')[0].value;
				chaine += dec+"  <Cond>"+Expression+"</Cond>\n";
			}
		}
	}		  
	chaine += dec+"</If>\n";
	return chaine;
}

//====================================================================================================
function execPour(Conteneur) {
	var petifils = Conteneur.childNodes; 	 
	var blockinit;
	var blockincr;
	var block1;
	//on parcour les fils pour identifier l'initialisation, l'incrémentation le bloc fils et la condition
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].title == 'initialisation') {
					 		 blockinit=petifils[z];		
			} else if (petifils[z].title == 'incrémentation') {
					 blockincr= petifils[z];
			} else if (petifils[z].className == 'block1'){
				block1=petifils[z];
			} else if (petifils[z].className == 'condition1'){
				var Expression=petifils[z].getElementsByTagName('input')[0].value;
			}
		}
	}	
	//on execute l'initialisation
	executer(blockinit);
			
	if (typeof(	parent.AnalyseExpression(Expression,parent.TabVariables))!="boolean"){		
		alert("Attention "+Expression+" n'est pas une expression booléenne valide");
		instructionbidonservanatoutstopper();
	}
	
	while  (parent.AnalyseExpression(Expression,parent.TabVariables)) {//tant que la condition est vrai
		 executer(block1);//on execute le bloc fils
		 executer(blockincr);//on incrémente
	}
}

//====================================================================================================
function savePour(Conteneur,dec) {
	var petifils = Conteneur.childNodes; 	 
	var blockinit;
	var blockincr;
	var block1;
	var chaine = dec+"<For-c>\n";
	//on parcour les fils pour identifier l'initialisation, l'incrémentation le bloc fils et la condition
	for(var z = 0; z < petifils.length-1; z++){ 
		if(petifils[z].nodeType==1){ //si c'est un Objet Element 
			if (petifils[z].title == 'initialisation') {
				blockinit=petifils[z];
				chaine += save_conteneur(blockinit,dec);
			} else if (petifils[z].title == 'incrémentation') {
				blockincr= petifils[z];
				chaine += save_conteneur(blockincr,dec);
			} else if (petifils[z].className == 'block1'){
				block1=petifils[z];
				chaine += dec+"  <Code>\n"+save_conteneur(block1, dec+"  ")+dec+"  </Code>\n";
			} else if (petifils[z].className == 'condition1'){
				var Expression=petifils[z].getElementsByTagName('input')[0].value;
				chaine += dec+"  <Cond>"+Expression+"</Cond>\n";
			}
		}
	}	
	chaine += dec+"</For-c>\n";
	return chaine;
}

