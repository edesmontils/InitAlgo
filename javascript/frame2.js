/*
Fonctions définies :
	- CreerImage(Conteneur,ImageName,TypeImage,x,y,lien) : positionne une image
	
	- CreerTraitAB(Conteneur,ax,ay,bx,by) : crée un trait entre deux points par étirement de "pixelnoir"
	
	- CreerBlock(Conteneur,BlockName,TypeStructure,x,y,longueur,hauteur) : crée un nouveau block cliquable vers le menu gauche dans le Conteneur
		+ ajoute onclick='menu_gauche(this,event);' au bloc.
		
	- Creercondition(Conteneur,ImageName,x,y,image) : crée un block condition (Si, Tant-que...)
		+ ajoute onchange=\"changevalue(this);\" à la condition
		
	- CreerPara(Conteneur, s) : crée un bloc avec un parallélogramme (utilisé pour les entrée/sortie), le parametre s détermine si c'est une entrée ou une sortie (s in ("Entree", "Sortie"))
		+ ajoute onchange=\"changevalue(this);\" à l'élément
		
	- changevalue(conteneur) : change la classe associée à un conteneur (???)
	
	- Creertexte(Conteneur,texte,x,y) : ajoute un texte à un conteneur (???)
	
	- Redimensionner(Conteneur,event) : Action sur "+"ou "-" pour redimensionner un conteneur ; fait référence à "selection" ; Appelle :
		* "-" : Effacerfils(Conteneur.parentNode), RedessineParent(Conteneur.parentNode.parentNode), 
		* "+" : Montrerfils(Conteneur.parentNode), RedessineParent(Conteneur.parentNode)
		
	- Effacerfils(Conteneur) : cache les fils d'un bloc pour le réduire
	
	- Montrerfils(Conteneur) : rend visible les fils d'un bloc pour le reconstruire
	
	- InitialisePage(BlockX,BlockY,BlockLongueur,BlockHauteur) : met en place l'algo vide Début-...-fin ; Appelle :
		* CreerBlock pour le bloc principal
		* CreerImage deux fois pour "Début" et "Fin"
		
	- AjouteStructure(TypeStructure) : ajoute une structure dans un bloc et le signe '-' pour redimmensionner ; met la partie gauche à vide ; Appelle
		* AjouteXXX avec XXX la structure
		* RedessineParent(selection.parentNode)
		
	- Ajoutesialorssinon(Conteneur) : ajoute uns structure Si ; Appelle :
		* CreerconditionConteneur,'condition1',fixe,2*fixe,condition2)
		* CreerBlock deux fois (Alors et Sinon)
		* Redessinesialorssinon(Conteneur)
		
	- AjouteTantQueFaire(Conteneur) : ajoute une structure Tant Que ; Appelle :
		* Creercondition(Conteneur,'condition1',fixe,3*fixe,condition)
		* CreerBlock
		* RedessineTantQueFaire(Conteneur)
		
	- AjouteRepeterJusquA(Conteneur) : ajoute une structure Répéter ; Appelle :
		* Creercondition(Conteneur,'condition1',...)
		* CreerBlock
		* RedessineRepeterJusquA(Conteneur)
		
	- AjouteAffectation(Conteneur) : ajoute une affectation selon que c'est une "initialisation", une "Affectation" ou une "incrémentation" ; Appelle :
		* CreerImage pour la flèche
		
	- AjouteBouclePour(Conteneur) : ajoute une répétitive Pour ; Appelle :
		* CreerBlock pour l'initialisation, les instructions et l'incrémentation
		* Creercondition
		* AjouteAffectation deux fois pour l'initialisation et pour l'incrémentation
		* RedessineBouclePour(Conteneur)
		
	- AjouteEntreeSortie(Conteneur, s) : ajoute une instruction E/S (s dans {"Entree", "Sortie"}) ; Appelle :
		* CreerPara(Conteneur, s)
		* RedessineEntreeSortie(Conteneur, s)
	
	- RedessineEntreeSortie(Conteneur, s) : raffraichie le dessin d'une instruction d'entrée/sortie ; Appelle : 
		* CreerTraitAB deux fois
		* Creertexte avec soit "Lire" soit "Ecrire"
		
	- RedessineParent(Conteneur) : redessine toute les acsendants (récursive) ; Appelle :
		* RedessineXXX selon le type de structure 
		* RedessineParent(Conteneur.parentNode)
		* RedessineBody(Conteneur) - arrêt de la récursivité
		
	- RedessineSuperBlock(Conteneur) : redessine le "super-block" ; Appelle :
		* CreerTraitAB plusieurs fois en fonction de ses fils et calcul la longueur maximale
		
	- RedessineInput() : redessine tous les objets de formulaire de type "input" (conditions...)
	
	- Redessinesialorssinon(Conteneur) : redessine SiAlorsSinon ; Appelle :
		* CreerTraitAB plusieurs fois pour faire tous les traits
		* Creertexte deux fois pour mettre le "Vrai" et le "Faux"
		
	- RedessineTantQueFaire(Conteneur) : redessine le Tant Que ; Appelle :
		* CreerTraitAB plusieurs fois
		* CreerImage pour la flèche
		* Creertexte deux fois pour mettre le "Vrai" et le "Faux"
		
	- RedessineRepeterJusquA(Conteneur)
		* CreerTraitAB plusieurs fois
		* CreerImage pour la flèche
		* Creertexte deux fois pour mettre le "Vrai" et le "Faux"
		
	- RedessineAffectation(Conteneur)
	
	- RedessineBouclePour(Conteneur) : redessine le Tant Que ; Appelle :
		* CreerTraitAB plusieurs fois
		* CreerImage pour la flèche
		* Creertexte deux fois pour mettre le "Vrai" et le "Faux"
		
	- RedessineBody(Conteneur) : redessine le corps de la page ; Appelle :
		* RedessineInput()
		
	- transformer_en_superblock(Conteneur) : vide un bloc et le renome "super-bloc"
	
	- inserer(position,event) : insère un nouveau bloc "avant" ou "après" (position) le bloc courant ; Appelle :
		* transformer_en_superblock(SuperBlock)
		* CreerBlock
		* selectionbody()
		* RedessineSuperBlock(SuperBlock)
		* RedessineParent(SuperBlock.parentNode)
		
	- SupprimerBlock(event) : supprime un bloc ; Appelle :
		* RedessineParent(selection.parentNode)
		* selectionbody()
		
	- menu_gauche(Conteneur,event)
		+ ajoute " onclick=\"AjouteStructure('XXXX');\" aux images.
		+ ajout parfois " onclick=\"SupprimerBlock(event)\" , "   onclick='javascript:inserer(\"avant\",event);' et "   onclick='javascript:inserer(\"apres\",event);'>"
	
	- selectionbody() : enlève la sélection et vide la partie gauche
*/

//alert("frame2.js !");

//====================================================================================================
// textes des info-bulles
var bulleCondition = "Insérez ici une valeur booléenne,<br/>par exemple<br/>i=3<br/>((i=j) et (z=5))<br/>ou machaine=\"ceci est une chaine\"";
var bulleEntree = "Insérez ici le nom d'une variable à lire,<br/>par exemple r";
var bulleSortie = "Insérez ici ce que vous voulez afficher à l'ecran,<br/>par exemple:<br/>  \"Le rayon du cercle est: \",r";
var bulleAffectationVariable = "Insérez ici le nom d'une variable,<br/>par exemple i";
var bulleAffectationValeur = "Insérez ici la valeur, par exemple 3";

//var bulle = "";

//====================================================================================================
// Les images et icones utiles
var pixelnoir = new Image();
pixelnoir.src = 'images/PixelNoir.png';
var debut = new Image();
debut.src = 'images/Debut.png';
var fin = new Image();
fin.src = 'images/Fin.png';
var condition = new Image();
condition.src = 'images/condition.png';
var condition2 = new Image();
condition2.src = 'images/condition2.png';
var condition3 = new Image();
condition3.src = 'images/condition3.png';

var flecheHaut = new Image();
flecheHaut.src = 'images/flecheHaut.png';
var plus = new Image();
plus.src = 'images/plus.png';
plus.title = 'Restaurer';
var moin = new Image();
moin.src = 'images/moin.png';
moin.title = 'Reduire';

var flecheaffect = new Image();
flecheaffect.src='images/flechaffectation.png';
flecheaffect.title='Affectation';

var BouclePour = new Image();
BouclePour.src = 'images/BouclePour.png';
var Entree = new Image();
Entree.src = 'images/Entree.png';		 
var Sortie = new Image();
Sortie.src = 'images/Sortie.png';
var TantQueFaire = new Image();
TantQueFaire.src = 'images/TantQueFaire.png';
var RepeterJusquA = new Image();
RepeterJusquA.src = 'images/RepeterJusquA.png';
var SiAlorsSinon = new Image();
SiAlorsSinon.src = 'images/SiAlorsSinon.png';
var Insere_avant =new Image();
Insere_avant.src= 'images/Insere_avant.png';
var Insere_apres =new Image();
Insere_apres.src= 'images/Insere_apres.png';
var supprimer =new Image();
supprimer.src= 'images/supprimer.png';
var Affectation =new Image();
Affectation.src= 'images/Affectation.png';

var Parallelograme =new Image();
Parallelograme.src= 'images/parallelograme.png';

//====================================================================================================
// Variable globale indiquant le bloc sélectionné
var selection = null;

//====================================================================================================
// Quelques constantes
var fixe = 20;
var BorderTaille = 3;
BlockLongueurDefaut = 200;
BlockHauteurDefaut = 50;
	    	
//====================================================================================================
function CreerImage(Conteneur,ImageName,TypeImage,x,y,lien){
	Conteneur.innerHTML += "<img class="+ImageName
	                        +" title="+TypeImage
	                        +" style='position:absolute;left:"+x
	                        +";top:"+y
	                        +";' src='"+lien
	                        +"' />";		
}			
					
//====================================================================================================
function CreerTraitAB(Conteneur,ax,ay,bx,by){
	if (ay==by){//c'est un trait horizontal
  		if(ax < bx){ //ax est a gauche de bx
	  		x = ax;
			longueur = bx - ax;
		}else{ //ax est a droite de bx
	  		x = bx;
			longueur = ax - bx;
		}
  		y = ay;
  		hauteur = 1;
	}else if(ax==bx){//verticale
  		if(ay < by){ //ay est au dessus de by
	  		y = ay;
			hauteur = by - ay;
		} else { //ay est en dessous de by
	  		y = by;
			hauteur = ay - by;
		}
  		x = ax;		
  		longueur = 1;
	}				
	Conteneur.innerHTML += "<img class='trait' style='position:absolute;left:"+x
   							+";top:"+y
   							+";' src="+pixelnoir.src
   							+" height="+hauteur
   							+" width="+longueur
   							+" />";
 }    		
		
//====================================================================================================
function CreerBlock(Conteneur,BlockName,TypeStructure,x,y,longueur,hauteur){			 
	longueur -= 2*BorderTaille;
	hauteur -= 2*BorderTaille;	 
	Conteneur.innerHTML += "<div class='"+BlockName
							+"' title='"+TypeStructure
							+"' style='cursor:pointer;position:absolute;width:"+longueur
							+";height:"+hauteur
							+";left:"+x
							+";top:"+y
							+";border-width:"+BorderTaille
							+";border-color:#7d888e;border-style:solid;' onclick='menu_gauche(this,event);'></div>";		
}	
	
//====================================================================================================
function Creercondition(Conteneur,ImageName,x,y,image) {
	if (document.all){
		LienBaliseA = ' href=# ';
	}else {LienBaliseA = '';}
	Conteneur.innerHTML += "<div class="+ImageName+" title=condition style='position:absolute;width:"+image.width
							+";height:"+image.height
							+";left:"+x
							+";top:"+y
							+"; background-image:url("+image.src
							+");' ><a class=info "+LienBaliseA
							+" ><input class=vide value=vide  style='position:absolute;width:"+(image.width-45)
							+";left:20;top:"+(image.height/2-10)
							+";' type='text' onchange=\"changevalue(this);\" >"
							+"<span>"+bulleCondition+"</span></a></div>";					
}

		
//====================================================================================================
function CreerPara(Conteneur, s){//créer un bloc avec un parallélogramme (utilisé pour les entrée/sortie), le parametre s détermine si c'est une entré ou une sortie

	if (document.all){
		LienBaliseA = ' href=# ';
	} else {LienBaliseA = '';}

	if (s=='Entree') {
		Conteneur.innerHTML += "<div  class=Para  style='position:absolute;width:"+Parallelograme.width+
								";height:"+Parallelograme.height
								+";left:0;top:0; background-image:url("+Parallelograme.src
								+");' ><a class=info "+LienBaliseA
								+" ><input class=vide value=vide  style='position:absolute;width:"+(Parallelograme.width-45)
								+";left:20;top:"+(Parallelograme.height/2-5)
								+";' type='text' onchange=\"changevalue(this);\" >"
								+"<span>"+bulleEntree+"</span></a></div>";
	} else if (s=='Sortie') {
		Conteneur.innerHTML += "<div  class=Para  style='position:absolute;width:"+Parallelograme.width
								+";height:"+Parallelograme.height
								+";left:0;top:0; background-image:url("+Parallelograme.src
								+");' ><a class=info "+LienBaliseA
								+" ><input class=vide value=vide  style='position:absolute;width:"+(Parallelograme.width-45)
								+";left:20;top:"+(Parallelograme.height/2-5)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleSortie+"</span></a></div>";
	} else {
		Conteneur.innerHTML += "<div  class=Para  style='position:absolute;width:"+Parallelograme.width
								+";height:"+Parallelograme.height
								+";left:0;top:0; background-image:url("+Parallelograme.src
								+");' ><a class=info "+LienBaliseA
								+" ><input class=vide value=vide  style='position:absolute;width:"+(Parallelograme.width-45)
								+";left:20;top:"+(Parallelograme.height/2-5)
								+";' type='text' onchange=\"changevalue(this);\" ></a></div>";
	}
}

//====================================================================================================
function changevalue(conteneur) {conteneur.className=conteneur.value;}

//====================================================================================================
function Creertexte(Conteneur,texte,x,y) {
	Conteneur.innerHTML += "<div class=texte style='position:absolute;width:50;left:"+x
							+";top:"+y
							+";'>"+texte
							+"</div>";	
}
				
//====================================================================================================
function Redimensionner(Conteneur,event){
	if (document.all) {event.cancelBubble = true;}
    else {event.stopPropagation();}
    
    // Gestion du bloc sélectionné
	if (selection != null) {
		selection.style.borderColor = '#7d888e';
		// On efface le frame de gauche
		parent.frames["gauche"].window.document.getElementsByTagName('td')[0].innerHTML = "";
		// on annule la sélection		
        selection = null;
	}
	
	// redimmensionnement du bloc sélectionné
	if (Conteneur.src==moin.src) { // "-"
		Conteneur.src=plus.src;
		Conteneur.title = plus.title;
		Conteneur.parentNode.style.width=100;
		Conteneur.parentNode.style.height=plus.height;
		Conteneur.parentNode.style.background='#7d888e';
		Effacerfils(Conteneur.parentNode);
		RedessineParent(Conteneur.parentNode.parentNode);	
	} else { // "+"
		Conteneur.src=moin.src;
		Conteneur.title = moin.title;
		Conteneur.parentNode.style.background='#FFFFFF';
		Montrerfils(Conteneur.parentNode);			
		RedessineParent(Conteneur.parentNode);			
	}
}

//====================================================================================================
function Effacerfils(Conteneur){		   
	var fils = Conteneur.childNodes; 
  	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
       if( (fils[i].nodeType==1) && (fils[i].className!='plus')) {fils[i].style.visibility ='hidden';} 			
    }
}

//====================================================================================================
function Montrerfils(Conteneur){		
	var fils = Conteneur.childNodes; 
  	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
        if( (fils[i].nodeType==1) && (fils[i].className!='plus')) {fils[i].style.visibility ='';} 			
    }
}		
		
//====================================================================================================
function InitialisePage(BlockX,BlockY,BlockLongueur,BlockHauteur){		  
	Conteneur = document.getElementById("body");	
	CreerBlock(Conteneur,'blockPrincipal','block',BlockX,BlockY,BlockLongueur,BlockHauteur);
	DebutX = BlockX + (BlockLongueur / 2) - (debut.width / 2);
	DebutY = BlockY - debut.height;
	CreerImage(Conteneur,'debut','debut',DebutX,DebutY,debut.src);
	FinX = BlockX + (BlockLongueur / 2) - (fin.width / 2);
	FinY = BlockY + BlockHauteur;
	CreerImage(Conteneur,'fin','fin',FinX,FinY,fin.src);
}  
				
//====================================================================================================
function AjouteStructure(TypeStructure){

	//on ajoute l'image moins dans le bloc sélectionné (pour le redimmensionner éventuellement)		
	selection.innerHTML += "<img class='plus' src="+moin.src+"  onclick=\"Redimensionner(this,event)\">";
	
	if (selection.title == 'block'){		  
		if (TypeStructure == 'Tant que...faire...'){AjouteTantQueFaire(selection);}				  
		else if (TypeStructure == "Répéter... jusqu à"){AjouteRepeterJusquA(selection);}
		else if (TypeStructure == 'Affectation'){AjouteAffectation(selection);}
		else if (TypeStructure =='Si... alors... sinon...'){Ajoutesialorssinon(selection);}
		else if (TypeStructure =='Boucle Pour'){AjouteBouclePour(selection);}
		else if (TypeStructure =='Entree'){AjouteEntreeSortie(selection, 'Entree');}
		else if (TypeStructure =='Sortie'){AjouteEntreeSortie(selection, 'Sortie');}
		selection.style.borderColor='#7d888e';
		parent.frames["gauche"].window.document.getElementsByTagName('td')[0].innerHTML = "";
		RedessineParent(selection.parentNode);		
		selection=null;
	}
}		
		
//====================================================================================================
function Ajoutesialorssinon(Conteneur){	
	//redimensionnement du block
	HauteurConteneur = 6*fixe + condition2.height + BlockHauteurDefaut - 2*BorderTaille;
	LongueurConteneur = 3*fixe+ 2*BlockLongueurDefaut - 2*BorderTaille;			
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;
	//on precise que le conteneur est une structure Si alors sinon
	Conteneur.title = 'Si... alors... sinon...';
	//ajout de la condition			
	Creercondition(Conteneur,'condition1',fixe,2*fixe,condition2);
	//ajout des blocks de traitement
	CreerBlock(Conteneur,'block1','block',fixe,3*fixe + condition2.height,BlockLongueurDefaut,BlockHauteurDefaut);
	CreerBlock(Conteneur,'block2','block',2*fixe+BlockLongueurDefaut,3*fixe + condition2.height,BlockLongueurDefaut,BlockHauteurDefaut);
	Redessinesialorssinon(Conteneur);
}	

//====================================================================================================
function AjouteTantQueFaire(Conteneur){	
	//redimensionnement du block
	HauteurConteneur = 7*fixe + condition.height + BlockHauteurDefaut - 2*BorderTaille;
	LongueurConteneur = 3*fixe + condition.width + BlockLongueurDefaut - 2*BorderTaille;			
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;
	//on precise que le conteneur est une structure Tant que...faire...
	Conteneur.title = 'Tant que...faire...';
	//ajout de la condition			
	Creercondition(Conteneur,'condition1',fixe,3*fixe,condition);
	//ajout du block de traitement
	CreerBlock(Conteneur,'block1','block',fixe + condition.width ,4*fixe + condition.height,BlockLongueurDefaut,BlockHauteurDefaut);
	RedessineTantQueFaire(Conteneur);				
}
 
//====================================================================================================
function AjouteRepeterJusquA(Conteneur){
	//redimensionnement du block
	HauteurConteneur = 6*fixe + condition2.height + BlockHauteurDefaut - 2*BorderTaille;
	if (BlockLongueurDefaut > condition2.width){
		LePlusLong = BlockLongueurDefaut;
	} else {LePlusLong = condition2.width;}
	LongueurConteneur = 6*fixe + LePlusLong - 2*BorderTaille;			
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;
	//on precise que le conteneur est une structure Tant que...faire...
	Conteneur.title = "Répéter... jusqu'à";
	//ajout de la condition			
	Creercondition(Conteneur,'condition1',(LongueurConteneur / 2)-(condition2.width/2),4*fixe+BlockHauteurDefaut,condition2);
	//ajout du block de traitement
	CreerBlock(Conteneur,'block1','block',(LongueurConteneur / 2)-(BlockLongueurDefaut/2) ,2*fixe,BlockLongueurDefaut,BlockHauteurDefaut);
	RedessineRepeterJusquA(Conteneur);				
}
               
//====================================================================================================
function AjouteAffectation(Conteneur){	
	//redimensionnement du block					 
	Conteneur.style.width = BlockLongueurDefaut - 2*BorderTaille; 
	Conteneur.style.height = BlockHauteurDefaut - 2*BorderTaille;
	//on precise que le conteneur est une structure Affectation
	if (!((Conteneur.title=='initialisation') || (Conteneur.title=='incrémentation'))){ Conteneur.title = "Affectation";}
	//on ajoute le champ texte
	if (document.all){
		LienBaliseA = ' href=# ';
	}else {LienBaliseA = '';}
	
	if ( Conteneur.title == "Affectation"){
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='vide' value='vide'  style='position:absolute;width:50;left:5;"+
								"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationVariable
								+"</span></a>";
		CreerImage(Conteneur,'flecheaffect','\'\'',85,parseInt(Conteneur.style.height)/2-parseInt(flecheaffect.height)/2,flecheaffect.src);	        
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='vide' value='vide'  style='position:absolute;width:50;left:110;"
								+"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationValeur
								+"</span></a>";     
	} else if ( Conteneur.title == "initialisation") {
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='i' value='i'  style='position:absolute;width:50;left:15;"
								+"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationVariable
								+"</span></a>";
		CreerImage(Conteneur,'flecheaffect','\'\'',75,parseInt(Conteneur.style.height)/2-parseInt(flecheaffect.height)/2,flecheaffect.src);	        
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='0' value='0'  style='position:absolute;width:50;left:120;"
								+"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationValeur
								+"</span></a>";     
	} else if( Conteneur.title == "incrémentation") {
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='i' value='i'  style='position:absolute;width:50;left:15;"
								+"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationVariable
								+"</span></a>";
		CreerImage(Conteneur,'flecheaffect','\'\'',75,parseInt(Conteneur.style.height)/2-parseInt(flecheaffect.height)/2,flecheaffect.src);	        
		Conteneur.innerHTML += "<a class=info "+LienBaliseA
								+" ><input class='i+1' value='i+1'  style='position:absolute;width:50;left:120;"
								+"top:"+(parseInt(Conteneur.style.height)/2-16/2)
								+";' type='text' onchange=\"changevalue(this);\" ><span>"+bulleAffectationValeur
								+"</span></a>";     
	}
}

//====================================================================================================
function AjouteBouclePour(Conteneur){				  	  
	//redimensionnement du block
	HauteurConteneur = 8*fixe + condition.height + 3*BlockHauteurDefaut - 2*BorderTaille;
	LongueurConteneur = 4*fixe + condition.width - 2*BorderTaille;			
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;
	//on precise que le conteneur est une structure Tant que...faire...
	Conteneur.title = 'Boucle Pour';
	//ajout de l'initialisation
	CreerBlock(Conteneur,'blockinit','initialisation',fixe + condition.width ,4*fixe + condition.height,BlockLongueurDefaut,BlockHauteurDefaut);
	//ajout de la condition			
	Creercondition(Conteneur,'condition1',fixe,3*fixe,condition3);
	//ajout du block de traitement
	CreerBlock(Conteneur,'block1','block',fixe + condition.width ,4*fixe + condition.height,BlockLongueurDefaut,BlockHauteurDefaut);
	//ajout du block d'incrémentation
	CreerBlock(Conteneur,'blockincr','incrémentation',fixe + condition.width ,4*fixe + condition.height,BlockLongueurDefaut,BlockHauteurDefaut);	
	
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'condition1') {condition1 = fils[i];}
			else if (fils[i].className == 'block1') {block1 = fils[i];}
			else if (fils[i].className == 'blockinit') {blockinit = fils[i];}
			else if (fils[i].className == 'blockincr') {blockincr = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	
	blockinit.title='initialisation';
	AjouteAffectation(blockinit);
	
	blockinit.style.borderWidth=1;
	condition1.getElementsByTagName('input')[0].value="i<=5";
	condition1.getElementsByTagName('input')[0].className="i<=5";
	
	blockincr.title='incrémentation';
	AjouteAffectation(blockincr);
	
	blockincr.style.borderWidth=1;
	RedessineBouclePour(Conteneur);				
}

//====================================================================================================
function AjouteEntreeSortie(Conteneur, s){           
	//redimensionnement du block					 
	Conteneur.style.width = BlockLongueurDefaut - 2*BorderTaille; 
	Conteneur.style.height = BlockHauteurDefaut - 2*BorderTaille;
	
	if (s=='Entree'){Conteneur.title = "Entree";
	} else if (s=='Sortie'){Conteneur.title = "Sortie";}
	
	CreerPara(Conteneur, s);	     
	RedessineEntreeSortie(Conteneur, s);
}

//====================================================================================================
function RedessineEntreeSortie(Conteneur, s){
	//on parcourt tous les fils de ce noeud, on récupère condition1 et block1, on efface les traits
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'Para') {Para = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	//on récupere les tailles
	ParaLef = parseInt(Para.style.left); 
	ParaTop = parseInt(Para.style.top); 
	ParaWidth = parseInt(Para.style.width);
	ParaHeight = parseInt(Para.style.height);
	//redimensionnement du block
	HauteurConteneur = 2*fixe + ParaHeight  - 2*BorderTaille;
	LongueurConteneur = 2*fixe + ParaWidth - 2*BorderTaille;
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;
	//positionement du parallelograme
	Para.style.left=fixe;
	Para.style.top=fixe;					
	ParaLef = parseInt(Para.style.left); 
	ParaTop = parseInt(Para.style.top); 
	//creation des traits
	ax = (LongueurConteneur /2);						 
	CreerTraitAB(Conteneur,ax ,0,ax ,fixe);			
	CreerTraitAB(Conteneur,ax ,ParaTop +ParaHeight ,ax,HauteurConteneur );		
	
	if (s=='Entree'){Creertexte(Conteneur,'Lire:',55,25);
	} else if (s=='Sortie'){Creertexte(Conteneur,'Ecrire:',55,25);}	
}

//====================================================================================================		
function RedessineParent(Conteneur){			
	if  (Conteneur!=null)  {
		if ((Conteneur != document.getElementById("body")) ){
		//on redessine ce block
		if (Conteneur.title == 'Tant que...faire...'){RedessineTantQueFaire(Conteneur);}
		else if (Conteneur.title == 'super block'){ RedessineSuperBlock(Conteneur); }
		else if (Conteneur.title == "Répéter... jusqu'à"){ RedessineRepeterJusquA(Conteneur); } 
		else if (Conteneur.title == 'Affectation'){ RedessineAffectation(Conteneur); } 
		else if (Conteneur.title == 'Si... alors... sinon...'){Redessinesialorssinon(Conteneur); }
		else if (Conteneur.title == 'Boucle Pour'){RedessineBouclePour(Conteneur); }
		else if (Conteneur.title == 'Entree'){RedessineEntreeSortie(Conteneur, 'Entree'); }
		else if (Conteneur.title == 'Sortie'){RedessineEntreeSortie(Conteneur, 'Sortie'); }
		RedessineParent(Conteneur.parentNode);
		} else {
			//on est sur le body, on le redessine	
			RedessineBody(Conteneur);       
		}
	}
}
		
//====================================================================================================
function RedessineSuperBlock(Conteneur){			
	//on supprime tout les anciens traits et on cherche la largeur max des fils du super block
	var fils = Conteneur.childNodes; 
	var largeurmax=0;
	for(var i = 0; i < fils.length; i++){ 
		if ((fils[i].nodeType==1)&& (fils[i].className != 'plus')  ){ //si c'est un Objet Element 
			if (fils[i].className == 'trait'){
				Conteneur.removeChild(fils[i]);
				i--;
			} else if (parseInt(fils[i].style.width)>largeurmax) {
				largeurmax=parseInt(fils[i].style.width);
			}
		}
	} 
	largeurmax+=2*fixe-2*BorderTaille;			
	//on refait les traits et on positionne les blocks fils
	var fils = Conteneur.childNodes; 
	var hauteur=0;
	var nbfils=fils.length;
	for(var i = 0; i < nbfils; i++){ 
		if ((fils[i].nodeType==1)&& (fils[i].className != 'plus')  ){ //si c'est un Objet Element	
			CreerTraitAB(Conteneur,largeurmax/2+BorderTaille,hauteur,largeurmax/2+BorderTaille, hauteur+fixe); 	
			fils[i].style.top=hauteur+fixe;
			fils[i].style.left=largeurmax/2 - parseInt(fils[i].style.width)/2;	
			hauteur+=parseInt(fils[i].style.height)+fixe+2*BorderTaille;	
		}						
	}
	//dernier trait
	CreerTraitAB(Conteneur,largeurmax/2+BorderTaille,hauteur,largeurmax/2+BorderTaille, hauteur+fixe); 	
	hauteur+=fixe;
	//on redimenssione le super block
	Conteneur.style.height=hauteur;
	Conteneur.style.width=largeurmax+2*BorderTaille;
}
	
//====================================================================================================    
function RedessineInput(){
	ListeInput = document.getElementsByTagName('input');
	NbInput = ListeInput.length;
	for(i=0;i<NbInput;i++){
		ListeInput[i].value = ListeInput[i].className;
	}
}	
		
//====================================================================================================
function Redessinesialorssinon(Conteneur){
	//on parcourt tous les fils de ce noeud, on récupere condition1, block1 et block2, on efface les traits
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'condition1') {condition1 = fils[i];}
			else if (fils[i].className == 'block1') {block1 = fils[i];}
			else if (fils[i].className == 'block2') {block2 = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	//on récupere les tailles
	block1Lef = parseInt(block1.style.left); 
	block1Top = parseInt(block1.style.top); 
	block1Width = parseInt(block1.style.width) + 2*BorderTaille;
	block1Height = parseInt(block1.style.height) + 2*BorderTaille;
	condition1Lef = parseInt(condition1.style.left); 
	condition1Top = parseInt(condition1.style.top); 
	condition1Width = parseInt(condition1.style.width);
	condition1Height = parseInt(condition1.style.height);
	block2Lef = parseInt(block2.style.left); 
	block2Top = parseInt(block2.style.top); 
	block2Width = parseInt(block2.style.width) + 2*BorderTaille;
	block2Height = parseInt(block2.style.height) + 2*BorderTaille;
	//positionnement des block		
	if (block1Height>=block2Height) {
		block2.style.top=3*fixe + condition1Height+block1Height/2-block2Height/2;	
		block1.style.top=3*fixe + condition1Height;
	} else {
		block1.style.top=3*fixe +condition1Height+block2Height/2-block1Height/2;	
		block2.style.top=3*fixe + condition1Height;
	}
	if (block1Width>condition1Width) {ecart3=block1Width/2-condition1Width/2;}
	else {ecart3=0;}
	condition1.style.left=ecart3+fixe;
	condition1Lef = parseInt(condition1.style.left); 
	block1.style.left=condition1Lef+condition1Width/2-block1Width/2;		
	block1Lef = parseInt(block1.style.left); 
	block2.style.left=fixe+block1Width+block1Lef;
	block2Lef = parseInt(block2.style.left); 
	block2Top = parseInt(block2.style.top); 
	block1Top = parseInt(block1.style.top); 
	//redimensionnement du block
	max=0;
	if (block1Height>=block2Height) {max=block1Height;} else {max=block2Height;}
	HauteurConteneur = 6*fixe + condition1Height + max - 2*BorderTaille;
	LongueurConteneur =block2Lef+block2Width+fixe- 2*BorderTaille;
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;					
	//creation des traits
	ax = (LongueurConteneur /2);			 
	CreerTraitAB(Conteneur,ax ,0,ax ,fixe);
	CreerTraitAB(Conteneur,ax ,fixe,condition1Lef+condition1Width/2,fixe);
	CreerTraitAB(Conteneur,condition1Lef+condition1Width/2,fixe,condition1Lef+condition1Width/2,2*fixe );
	CreerTraitAB(Conteneur,block1Lef+block1Width/2 ,condition1Top+condition1Height,block1Lef+block1Width/2,block1Top);
	CreerTraitAB(Conteneur,block1Lef+block1Width/2 ,block1Top+block1Height,block1Lef+block1Width/2,HauteurConteneur-fixe);
	CreerTraitAB(Conteneur,block1Lef+block1Width/2,HauteurConteneur-fixe,ax,HauteurConteneur-fixe);
	CreerTraitAB(Conteneur,ax,HauteurConteneur-fixe, ax, HauteurConteneur);
	CreerTraitAB(Conteneur,condition1Lef+condition1Width,2*fixe+condition1Height/2, block2Lef+block2Width/2 ,2*fixe+condition1Height/2);
	CreerTraitAB(Conteneur,block2Lef+block2Width/2 ,2*fixe+condition1Height/2,block2Lef+block2Width/2,block2Top);
	CreerTraitAB(Conteneur,block2Lef+block2Width/2,block2Top+block2Height,block2Lef+block2Width/2,HauteurConteneur-2*fixe);
	CreerTraitAB(Conteneur,block2Lef+block2Width/2,HauteurConteneur-2*fixe,block1Lef+block1Width/2 ,HauteurConteneur-2*fixe);
	Creertexte(Conteneur,'Vrai',condition1Lef+condition1Width/2+5, condition1Top+condition1Height);
	Creertexte(Conteneur,'Faux',condition1Lef+condition1Width+5,condition1Top+condition1Height/2-15);
}
	
//====================================================================================================
function RedessineTantQueFaire(Conteneur){
	//on parcour tous les fils de ce noeud, on récupere condition1 et block1, on efface les traits
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'condition1') {condition1 = fils[i];}
			else if (fils[i].className == 'block1') {block1 = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	//on récupere les tailles
	block1Lef = parseInt(block1.style.left); 
	block1Top = parseInt(block1.style.top); 
	block1Width = parseInt(block1.style.width) + 2*BorderTaille;
	block1Height = parseInt(block1.style.height) + 2*BorderTaille;
	condition1Lef = parseInt(condition1.style.left); 
	condition1Top = parseInt(condition1.style.top); 
	condition1Width = parseInt(condition1.style.width);
	condition1Height = parseInt(condition1.style.height);
	//redimensionnement du block
	HauteurConteneur = 7*fixe + condition1Height + block1Height - 2*BorderTaille;
	LongueurConteneur = 3*fixe + condition1Width + block1Width - 2*BorderTaille;
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;					
	//creation des traits
	ax = (LongueurConteneur /2);						 
	CreerTraitAB(Conteneur,ax ,0,ax ,fixe);			
	CreerTraitAB(Conteneur,ax ,HauteurConteneur - fixe ,ax,HauteurConteneur );					
	CreerTraitAB(Conteneur,ax ,fixe,fixe + condition1Width /2 - 1 ,fixe );			
	CreerTraitAB(Conteneur,fixe + condition1Width /2 - 1 ,fixe,fixe + condition1Width /2 - 1 ,3*fixe);			
	CreerTraitAB(Conteneur,fixe + condition1Width /2 , condition1Height + 3*fixe,fixe + condition1Width /2  ,HauteurConteneur - fixe );
	CreerTraitAB(Conteneur,fixe + condition1Width /2  ,HauteurConteneur - fixe, ax ,HauteurConteneur - fixe );			
	ax = fixe + condition1Width + block1Width /2;
	CreerTraitAB(Conteneur,fixe + condition1Width ,3*fixe + condition1Height /2 ,ax,3*fixe + condition1Height /2 );		
	CreerTraitAB(Conteneur,ax,3*fixe + condition1Height /2 ,ax , 4*fixe + condition1Height);			
	CreerTraitAB(Conteneur,ax ,4*fixe + condition1Height + block1Height,ax ,5*fixe + condition1Height + block1Height);		
	CreerTraitAB(Conteneur,ax ,5*fixe + condition1Height + block1Height ,LongueurConteneur - fixe ,5*fixe + condition1Height + block1Height);		
	CreerTraitAB(Conteneur,LongueurConteneur - fixe ,5*fixe + condition1Height + block1Height,LongueurConteneur - fixe ,2*fixe );			
	CreerTraitAB(Conteneur,LongueurConteneur - fixe ,2*fixe,fixe + condition1Width /2 ,2*fixe);
	CreerImage(Conteneur,'flecheHaut','\'\'',LongueurConteneur - fixe - flecheHaut.width /2,6*fixe,flecheHaut.src);	
	Creertexte(Conteneur,'Vrai',condition.width+fixe,condition.height/2+3*fixe-17);
	Creertexte(Conteneur,'Faux',condition.width/2+fixe+5,condition.height+3*fixe);
}
		
//====================================================================================================
function RedessineRepeterJusquA(Conteneur){		  
	//on parcour tous les fils de ce noeud, on récupere condition1 et block1, on efface les traits
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'condition1') {condition1 = fils[i];}
			else if (fils[i].className == 'block1') {block1 = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	//on récupere les tailles
	block1Lef = parseInt(block1.style.left); 
	block1Top = parseInt(block1.style.top); 
	block1Width = parseInt(block1.style.width) + 2*BorderTaille;
	block1Height = parseInt(block1.style.height) + 2*BorderTaille;
	condition1Lef = parseInt(condition1.style.left); 
	condition1Top = parseInt(condition1.style.top); 
	condition1Width = parseInt(condition1.style.width);
	condition1Height = parseInt(condition1.style.height);
	//redimensionnement du block                       
	HauteurConteneur = 6*fixe + condition1Height + block1Height - 2*BorderTaille;
	if (block1Width > condition1Width){
		LePlusLong = block1Width;
	} else { LePlusLong = condition1Width;}
	LongueurConteneur = 6*fixe + LePlusLong - 2*BorderTaille;	
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;					
	//on replace la condition au bon endroit
	condition1.style.left = LongueurConteneur / 2 - condition1Width / 2;
	condition1.style.top = 4*fixe+block1Height;        
	//on recentre le block1
	block1.style.left = LongueurConteneur / 2 - block1Width / 2;
	//creation des traits
	MilieuConteneur = (LongueurConteneur /2);			 
	CreerTraitAB(Conteneur,MilieuConteneur ,0,MilieuConteneur ,2*fixe);
	CreerTraitAB(Conteneur,MilieuConteneur ,2*fixe +block1Height,MilieuConteneur ,4*fixe +block1Height);
	CreerTraitAB(Conteneur,MilieuConteneur ,4*fixe +block1Height + condition1Height,MilieuConteneur ,HauteurConteneur);
	CreerTraitAB(Conteneur,MilieuConteneur ,fixe,LePlusLong / 2 + MilieuConteneur+2*fixe,fixe);
	CreerTraitAB(Conteneur,LePlusLong / 2 + MilieuConteneur +2*fixe,fixe,LePlusLong / 2 + MilieuConteneur +2*fixe,4*fixe + block1Height + condition1Height/2 +1);
	CreerTraitAB(Conteneur,LePlusLong / 2 + MilieuConteneur +2*fixe,4*fixe + block1Height + condition1Height/2,MilieuConteneur + condition1Width/2 ,4*fixe + block1Height + condition1Height/2);
	CreerImage(Conteneur,'flecheHaut','\'\'',LePlusLong / 2 + MilieuConteneur +2*fixe - flecheHaut.width /2,6*fixe,flecheHaut.src);	
	Creertexte(Conteneur,'Vrai',MilieuConteneur + 5,4*fixe + block1Height + condition1Height);
	Creertexte(Conteneur,'Faux',MilieuConteneur + condition1Width/2,4*fixe + block1Height + condition1Height/2 + 2);
}

//====================================================================================================
function RedessineAffectation(Conteneur){		  
	Conteneur.style.width = BlockLongueurDefaut - 2*BorderTaille; 
	Conteneur.style.height = BlockHauteurDefaut - 2*BorderTaille;
}

//====================================================================================================
function RedessineBouclePour(Conteneur){
	//on parcour tous les fils de ce noeud, on récupere condition1 et block1, on efface les traits
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'condition1') {condition1 = fils[i];}
			else if (fils[i].className == 'block1') {block1 = fils[i];}
			else if (fils[i].className == 'blockinit') {blockinit = fils[i];}
			else if (fils[i].className == 'blockincr') {blockincr = fils[i];}
			else if (fils[i].className == 'plus') {}
			else {
				Conteneur.removeChild(fils[i]);
				i--;
			} 						 					 
		} 			
	}
	//on récupere les tailles
	block1Lef = parseInt(block1.style.left); 
	block1Top = parseInt(block1.style.top); 
	block1Width = parseInt(block1.style.width) + 2*BorderTaille;
	block1Height = parseInt(block1.style.height) + 2*BorderTaille;
	blockinitLef = parseInt(blockinit.style.left); 
	blockinitTop = parseInt(blockinit.style.top); 
	blockinitWidth = parseInt(blockinit.style.width) + 2;
	blockinitHeight = parseInt(blockinit.style.height) + 2;
	blockincrLef = parseInt(blockincr.style.left); 
	blockincrTop = parseInt(blockincr.style.top); 
	blockincrWidth = parseInt(blockincr.style.width) + 2;
	blockincrHeight = parseInt(blockincr.style.height) + 2;
	condition1Lef = parseInt(condition1.style.left); 
	condition1Top = parseInt(condition1.style.top); 
	condition1Width = parseInt(condition1.style.width);
	condition1Height = parseInt(condition1.style.height);
	//redimensionnement du block                       
	if (block1Width>=condition1Width) {largmax=block1Width;} else {largmax=condition1Width}
	if (blockincrWidth>=largmax) {largmax=blockincrWidth+2*fixe;} else {largmax+=2*fixe;}
	if (blockinitWidth>=largmax) {largmax=blockinitWidth;} 
	HauteurConteneur = 8*fixe + condition1Height + block1Height+blockincrHeight+blockinitHeight - 2*BorderTaille;
	LongueurConteneur = largmax+2*fixe - 2*BorderTaille;	
	Conteneur.style.width = LongueurConteneur; 
	Conteneur.style.height = HauteurConteneur;					
	//on repositionne le block init
	blockinit.style.left = LongueurConteneur / 2 - blockinitWidth / 2;
	blockinit.style.top=fixe;
	//on replace la condition au bon endroit
	condition1.style.left = LongueurConteneur / 2 - condition1Width / 2;
	condition1.style.top = 3*fixe+blockinitHeight;        
	//on repositionne le block1
	block1.style.left = LongueurConteneur / 2 - block1Width / 2;
	block1.style.top=4*fixe+blockinitHeight+condition1Height ;
	//on repositionne le block incr
	blockincr.style.left = LongueurConteneur / 2 - blockincrWidth / 2;
	blockincr.style.top=5*fixe+blockinitHeight+condition1Height+block1Height ;
	condition1Lef = parseInt(condition1.style.left); 
	condition1Top = parseInt(condition1.style.top); 
	//creation des traits
	MilieuConteneur = (LongueurConteneur /2);			 
	CreerTraitAB(Conteneur,MilieuConteneur ,0,MilieuConteneur ,fixe);
	CreerTraitAB(Conteneur,MilieuConteneur ,fixe +blockinitHeight,MilieuConteneur ,3*fixe +blockinitHeight);
	CreerTraitAB(Conteneur,MilieuConteneur ,3*fixe +blockinitHeight+condition1Height,MilieuConteneur ,4*fixe +blockinitHeight+condition1Height);
	CreerTraitAB(Conteneur,MilieuConteneur ,4*fixe +blockinitHeight+condition1Height+block1Height,MilieuConteneur ,5*fixe +blockinitHeight+condition1Height+block1Height);
	CreerTraitAB(Conteneur,MilieuConteneur ,5*fixe +blockinitHeight+condition1Height+block1Height+blockincrHeight ,MilieuConteneur ,6*fixe +blockinitHeight+condition1Height+block1Height+blockincrHeight);
	CreerTraitAB(Conteneur,MilieuConteneur ,6*fixe +blockinitHeight+condition1Height+block1Height+blockincrHeight, LongueurConteneur-fixe,6*fixe +blockinitHeight+condition1Height+block1Height+blockincrHeight );
	CreerTraitAB(Conteneur, LongueurConteneur-fixe,6*fixe +blockinitHeight+condition1Height+block1Height+blockincrHeight, LongueurConteneur-fixe, 2*fixe+ blockinitHeight );
	CreerTraitAB(Conteneur, LongueurConteneur-fixe, 2*fixe+ blockinitHeight,MilieuConteneur, 2*fixe+ blockinitHeight  );
	CreerTraitAB(Conteneur, condition1Lef, condition1Top+ condition1Height /2, fixe, condition1Top+ condition1Height /2 );
	CreerTraitAB(Conteneur, fixe, condition1Top+ condition1Height /2,fixe,HauteurConteneur-fixe   );
	CreerTraitAB(Conteneur,fixe,HauteurConteneur-fixe , MilieuConteneur, HauteurConteneur-fixe  );
	CreerTraitAB(Conteneur, MilieuConteneur, HauteurConteneur-fixe, MilieuConteneur, HauteurConteneur  );
	CreerImage(Conteneur,'flecheHaut','\'\'',LongueurConteneur-fixe - flecheHaut.width /2,8*fixe,flecheHaut.src);	
	Creertexte(Conteneur,'Faux',fixe+10,condition1Top+ condition1Height /2-15);
	Creertexte(Conteneur,'Vrai',MilieuConteneur + 5,condition1Top+ condition1Height);
}		

//====================================================================================================
function RedessineBody(Conteneur){	  				  
	//boucle sur tous les fils du meme niveau 
	var fils = Conteneur.childNodes; 
	var nbFils = fils.length; 
	for(var i = 0; i < nbFils; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'debut') {Ledebut = fils[i];}
			if (fils[i].className == 'blockPrincipal') {LeblockPrincipal = fils[i];}
			if (fils[i].className == 'fin') {Lafin = fils[i];}					 
		} 
	}						
	LeblockPrincipalLef = parseInt(LeblockPrincipal.style.left); 
	LeblockPrincipalTop = parseInt(LeblockPrincipal.style.top); 
	LeblockPrincipalWidth = parseInt(LeblockPrincipal.style.width) + 2*BorderTaille;
	LeblockPrincipalHeight = parseInt(LeblockPrincipal.style.height) + 2*BorderTaille;
	DebutX = LeblockPrincipalLef + (LeblockPrincipalWidth / 2) - (debut.width / 2);
	DebutY = LeblockPrincipalTop - debut.height;
	FinX = LeblockPrincipalLef + (LeblockPrincipalWidth / 2) - (fin.width / 2);
	FinY = LeblockPrincipalTop + LeblockPrincipalHeight;
	Ledebut.style.left = DebutX;
	Ledebut.style.top = DebutY;		
	Lafin.style.left = FinX;
	Lafin.style.top = FinY;	
	//on change le fond (d'un bloc 'ouvert') et on le remet normal pour palier à un bug d'affichage de firefox
	if (parseInt(LeblockPrincipal.style.height) > plus.height){
		LeblockPrincipal.style.background='#7d888e';
		LeblockPrincipal.style.background='#FFFFFF';
	}		
	//on actualise les valeurs des champs input car ils sont effacé avec firefox lorsqu'on fait un InnerHtml
	RedessineInput();
}  	

//====================================================================================================
function transformer_en_superblock(Conteneur){
	var fils = Conteneur.childNodes;     
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className != 'plus') {
				Conteneur.removeChild(fils[i]);
				i--;
			} 			
		}
	}
	Conteneur.title='super block';
}

//====================================================================================================
function inserer(position,event){
	if (document.all){event.cancelBubble = true;}
	else {event.stopPropagation(); }
	selection.style.borderColor='#7d888e';	 
	//on definit ce qu'est le super block 
	SuperBlock = selection.parentNode;
	//si il n'existe pas encore de super block on le cree et place dedans le block selectionné   
	if (SuperBlock.title!='super block') {
		var copie_block=selection.cloneNode(true);
		SuperBlock = selection;
		transformer_en_superblock(SuperBlock);
		copie_block.style.left=fixe-BorderTaille;
		copie_block.style.top=2*fixe+BlockHauteurDefaut;    
		SuperBlock.appendChild(copie_block);
		selection = copie_block;		 
	}
	//on marque le block selectionné pour pouvoir le recuperer ensuite, car la creation d'un block pose probleme 
	selection.className = 'selection';		
	//creation d'un sous block non positionné dans le super block 
	CreerBlock(SuperBlock,'nouveau','block',parseInt(SuperBlock.style.width)/2-BlockLongueurDefaut/2,fixe,BlockLongueurDefaut,BlockHauteurDefaut);
	//on récupere l'instance du sous block créé et de celui selectionné en parcourant les fils de super block
	var fils = SuperBlock.childNodes;     
	for(var i = 0; i < fils.length; i++){ 
		if(fils[i].nodeType==1){ //si c'est un Objet Element 
			if (fils[i].className == 'nouveau') {SousBlockVide = fils[i];}
			else if (fils[i].className == 'selection') {selection = fils[i];}  			
		}
	}
	SousBlockVide.className = 'sous block';
	selection.className = 'sous block';
	//on met le sous block au bon endroit
	if (position=='avant'){//on rajoute un block vide avant le block selectionne				     
		SuperBlock.insertBefore(SousBlockVide,selection);				         
	}else{		   
		SuperBlock.insertBefore(SousBlockVide,selection.nextSibling);        
	} 	
	SuperBlock.style.width = parseInt(SuperBlock.style.width)+2*fixe;
	SuperBlock.style.height = parseInt(SuperBlock.style.height)+3*fixe+BlockHauteurDefaut;
	selectionbody();
	RedessineSuperBlock(SuperBlock);
	RedessineParent(SuperBlock.parentNode);
}

//====================================================================================================
function SupprimerBlock(event){
	if (document.all){event.cancelBubble = true;}
	else { event.stopPropagation(); }
	//si le block a effacer est dans un super block
	if (selection.parentNode.title == 'super block'){
		SuperBlock = selection.parentNode;
		//on supprime le block selectionné
		SuperBlock.removeChild(selection);
		//on regarde si il ne reste plus qu'un seul sous block dans le super block			 
		var nb_sous_block = 0;
		var fils = SuperBlock.childNodes;     
		for(var i = 0; i < fils.length; i++){ 
			if(fils[i].nodeType==1){ 
				if (fils[i].className == 'sous block') {
					nb_sous_block += 1;
					sous_block = fils[i]; 
				} 			
			}
		}
		if(nb_sous_block == 1){
			//Si l'on a qu'un seul sous block dans le conteneur, le conteneur ne sert plus, on le supprime
			sous_block.className = SuperBlock.className;
			sous_block.style.left = SuperBlock.style.left;
			sous_block.style.top = SuperBlock.style.top;					
			Conteneur = SuperBlock.parentNode;						
			Conteneur.replaceChild(sous_block, SuperBlock);					
			SuperBlock = Conteneur;													 
		} 				 					  		
		RedessineParent(SuperBlock);				
	} else {//le block selectionné n'est pas dans un super block, on le transforme en block vide		  			
		var selectionListe = selection.childNodes; 
		while(selection.hasChildNodes()){selection.removeChild(selectionListe[0]);} 
		selection.title= 'block';
		selection.style.width = BlockLongueurDefaut;
		selection.style.height = BlockHauteurDefaut;			  
		selection.style.borderColor='#7d888e';
		RedessineParent(selection.parentNode);			
	}		
	selectionbody();			
}

//====================================================================================================
function menu_gauche(Conteneur,event){	  
	if (document.all){event.cancelBubble = true;}
	else { event.stopPropagation(); }
	if (parseInt(Conteneur.style.height) > plus.height){
		ColonneGauche = parent.frames["gauche"].window.document.getElementsByTagName('td');
		ColonneGauche[0].innerHTML ="";
		if (Conteneur.title=='block') {//block vide
			if(Conteneur.parentNode.title=='super block'){//si le block vide est contenu dans un super block il est supprimable
				ColonneGauche[0].innerHTML += "<img style='cursor:pointer;' src="+supprimer.src
												+" onclick=\"SupprimerBlock(event)\"><br><br>";
			}
			ColonneGauche[0].innerHTML += "<img style='cursor:pointer;' src="+Affectation.src
											+" onclick=\"AjouteStructure('Affectation');\"><br><br>"+
										  "<img style='cursor:pointer;' src="+Entree.src
											+" onclick=\"AjouteStructure('Entree')\"><br><br>"+
										  "<img style='cursor:pointer;' src="+Sortie.src
										  	+" onclick=\"AjouteStructure('Sortie')\"><br><br>"+
										  "<img style='cursor:pointer;' src="+TantQueFaire.src
										  	+" onclick=\"AjouteStructure('Tant que...faire...');\"><br><br>"+
										  "<img style='cursor:pointer;' src="+RepeterJusquA.src
										  	+" onclick=\"AjouteStructure('Répéter... jusqu à');\"><br><br>"+
										  "<img style='cursor:pointer;' src="+SiAlorsSinon.src
										  	+" onclick=\"AjouteStructure('Si... alors... sinon...');\"><br><br>"+
										  "<img style='cursor:pointer;' src="+BouclePour.src
										  	+" onclick=\"AjouteStructure('Boucle Pour');\">";
			Conteneur.style.borderColor='red';     
		}else if ((Conteneur.title!='initialisation') && (Conteneur.title!='incrémentation')) {//block non vide
			ColonneGauche[0].innerHTML += "<img style='cursor:pointer;' src="+supprimer.src
											+" onclick=\"SupprimerBlock(event)\"><br><br>";
			if(Conteneur.title!='super block'){//on ne peut ajouter un block avant / apres que si le block selectionné n'est pas un super block
				ColonneGauche[0].innerHTML += "<img style='cursor:pointer;' src="+Insere_avant.src
												+"   onclick='javascript:inserer(\"avant\",event);'><br><br>"+
											  "<img style='cursor:pointer;' src="+Insere_apres.src
											  	+"   onclick='javascript:inserer(\"apres\",event);'>";
			}
			Conteneur.style.borderColor='green';
		}
		if ((selection != null)&&(selection != Conteneur)) {selection.style.borderColor='#7d888e';}
		// Le bloc devient alors la sélection !!!
		selection=Conteneur;  
	}
}

//====================================================================================================
function selectionbody(){
	if (selection != null) {selection.style.borderColor='#7d888e';}
	selection=null;
	parent.frames["gauche"].window.document.getElementsByTagName('td')[0].innerHTML = "";
}