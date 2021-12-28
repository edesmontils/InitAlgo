//table des symboles
var ListeToken ;

//Une partie des symboles utilisés dans la grammaire
//On peut modifier ces symboles qu'avec des lettres en minuscule et symoble sans espaces
var Vrai = "vrai";
var Faux = "faux";
var Non = "non";
var Pi = "pi";
var Racine = "racine";
var Exponentiel = "exp";
var Cosinus = "cos";
var Sinus = "sin";
var Tangente = "tan";
var Absolue = "abs";
var Logarithme = "ln";
var Different = "!=";
var Ou = "ou";
var Et = "et";
var Egale = "=";
var Factorielle = "!";

//Messages d'erreur
var TexteErreur = "Erreur, ";
var TexteErreurExpression = TexteErreur+"expression incorrecte : ";
var TexteVariableInconnue = TexteErreur+"variable non reconnue : ";
var TexteSymboleInconnu = TexteErreur+"symbole non reconnu : ";
var TexteManqueParenthese = TexteErreur+"il manque une parenthèse ouvrante apres la fonction : ";
var TextePeutPasSuivre = " ne peut pas être suivi de ";
var TexteParenthesesVides = TexteErreur+"parentheses vides !";
var TexteManqueOuvrante = TexteErreur+"il y a moins de parenthèse ouvrante que de fermante !";
var TexteManqueFermante = TexteErreur+"il y a plus de parenthèse ouvrante que de fermante !";
var TexteDivisionZero = TexteErreur+"division par zéro !";
var TexteModZero = TexteErreur+"mod de 0 !";
var TexteDivZero = TexteErreur+"div de 0 !";
var TexteRacineNegative = TexteErreur+"racine d'un nombre négatif !";
var TexteFactorielleNegative = TexteErreur+"factorielle d'un nombre négatif !";


//Variable permettant si une alerte a déja été envoyé
var AlertEnvoye = false;

//Fonction principale permettant de passer par les trois phases de l'analyse
function AnalyseExpression(Expression,TabVariables){ 
      //on verifie que l'expression existe vraiment 
      if (Expression == null){
			     if(AlertEnvoye == false) alert(TexteErreurExpression+Expression);
			     return ;
			}else{  
			 // on met tous les caractere en minuscule, ceci pour que l'expression ne soit pas sensible a la casse 
        Expression = Expression.toLowerCase(); 
				//on initialise la table des symboles       
        ListeToken = new Array(); 
				//Premiere partie : Analyse lexicale pour découper l'expression en mots reconnus
        AnalyseLexicale(Expression,TabVariables);	
				//Deuxieme partie : Analyse syntaxique permettant de creer l'abre de syntaxe abstraite 			
				AnalyseSyntaxique();	
				//On verifie que dans la table des symboles il n'existe qu'un seul arbre, sinon il y a eu une erreur
				if(ListeToken.length == 1){			
				   //Troisieme partie : Analyse semantique pour détécter les erreurs de sens en evaluant l'arbre precedent.
					 //Ce qui poura donner le resultat final de l'expression
				   var Resultat = AnalyseSemantique(ListeToken[0]);
					 //Si le resultat a pour type un nombre alors que ça n'en est pas un, il y a eu une erreur
					 if (isNaN(Resultat)&&(typeof(Resultat)=="number")){
					    if(AlertEnvoye == false) alert(TexteErreurExpression+Expression);
							return;
					 }else return Resultat;
				}else {
				  //il y a plusieurs arbres dans la table des symbobles, donc la réduction n'est pas complete : Erreur !
				  if(AlertEnvoye == false) alert(TexteErreurExpression+Expression);
				  return ;
				}
			}				
		}
    
		//Constructeur de noeud 
    function Token(Valeur,FilsGauche, FilsDroit, Type) {				
				this.Valeur = Valeur;
        this.FilsGauche = FilsGauche;
				this.FilsDroit = FilsDroit;
      	this.Type = Type;
   }
	 
   //Constructeur de noeud par copie
	 function CopieDeToken(TokenAcopier) {				
				this.Valeur = TokenAcopier.Valeur;
        this.FilsGauche = TokenAcopier.FilsGauche;
				this.FilsDroit = TokenAcopier.FilsDroit;				
      	this.Type = TokenAcopier.Type;
   }
	 
	 //Construit un noeud et le rajoute dans la table des symboles
   function AjouteToken( tableau,chaine,Type){ 
	         //créé un noeud (une feuille) contenant la valeur du Token et son type          
           NewToken = new Token(chaine,null,null,Type);
					 //On ajoute ce noeud dans la table des symboles
           tableau.push(NewToken);
        }
	//Ajoute un noeud existant dans la table des symboles			
	 function AjouteToken2( tableau,TokenAajouter){           
           NewToken = new Token(TokenAajouter.Valeur,TokenAajouter.FilsGauche,TokenAajouter.FilsDroit,TokenAajouter.Type);
           tableau.push(NewToken);
        }
	
	//Fonction booléenne permettant de savoir si le paramètre d'entré est une lettre			
	function EstLettre(lettre){	
	   var reg = /^[a-zA-Z]$/;
     return (reg.exec(lettre)!=null);		 
	}
	
	//Fonction booléenne permettant de savoir si le paramètre d'entré est un chiffre
  function EstChiffre(chiffre){ 
	   var reg = /^\d$/;
     return (reg.exec(chiffre)!=null);
  }
  
	//Fonction booléenne permettant de savoir si le paramètre d'entré est un nombre	
	function EstNombre(nombre){ //reel ou entier
	   var reg = /^\d+[.]?\d*$/;		 
     return (reg.exec(nombre)!=null);			
  }
	
	//on regarde si un mot donné peut etre vu comme un nom de variable			
	function EstVariable(Mot){		
     	var reg = /^[a-zA-Z]+\w*$/;
      return (reg.exec(Mot)!=null);	
	}
	
	//on regarde si l'on reconnait un mot clé a partir de la position i de lecture dans l'expression 			
  function MotClePositionI(expression,ListeMotCle,i){	 		 
        j=0;	    
				
			MotCle = "";
			while (j != ListeMotCle.length){ 
			    MotCleCourant =ListeMotCle[j];
			    if((expression.indexOf(MotCleCourant, i)==i)&&(MotCleCourant.length > MotCle.length)){
					  MotCle = MotCleCourant;
					 }			           
          j++;
        }			
						
		 //si un mot clé composé de lettres a été trouvé, on regarde ce qu'il y a apres pour etre certain
		 //par exemple, si 'et' est trouvé mais que la chaine est 'etat' ce n'est donc pas un mot clé
	  		
		if((expression.indexOf(MotCle,i)== i)&&(MotCle!= "")){					
		   //si il reste des caracteres apres le mot clé reconnu on regarde si ce n'été pas plutot une variable                 
			 if(expression.length > MotCle.length + i){ 	
			    if(EstVariable(MotCle + expression.charAt(MotCle.length + i))){MotCle = null;}
			 }	 
		 }else{MotCle = null;}        		 
	 return MotCle;
	}
	
	//on regarde si l'on reconnait un nombre a partir de la position i de lecture dans l'expression
	function NombrePositionI(expression,i){			  	
	  Nombre = null;
	  j = i;	
	  while ((expression.length > j)&& EstNombre(expression.substring(i,j+1))){
	    Nombre = expression.substring(i,j+1);		
	  	j++; 
	  }	
	  return Nombre;		
	}
	
	//on regarde si l'on reconnait une variable a partir de la position pos de lecture dans l'expression
	function VariablePositionI(expression,pos){	  
		Variable = null;			
	  j = pos;		
	
	  while ((expression.length > j)&& (EstVariable(expression.substring(pos,j+1)))){	    
			Variable = expression.substring(pos,j+1);				
		  j++;
	  }			
	
	  return Variable;
	}
	
	//on regarde si l'on reconnait une chaine a partir de la position pos de lecture dans l'expression
	function ChainePositionI(expression,pos){
	  Chaine = null;		
		
	  //on vérifie que le premier caractere est : " 			
	  if(expression.charAt(pos)=="\""){
		  //on cherche la prochaine occurrence de : "
			PosFin = expression.indexOf("\"", pos+1);
			if (PosFin != -1){ Chaine = expression.substring(pos,PosFin+1);}			
		}	
	  return Chaine;
	}
	
	//Fonction permettant d'obtenir la valeur d'une variable si elle est dans le tableau rassemblant toutes les variables
	function ValeurVariable(Variable,TabVariables){
	    i=0;
		valeur = null;
			while((TabVariables.length > i)&&(valeur == null)){
        if(TabVariables[i][0]==Variable){valeur = TabVariables[i][1];}			
			  i++;
			}	
		return valeur;	
	}
			
	//Fonction calculant la factorielle d'un nombre		
	function factorielle(n){
       if (n<0) {return "### Erreur ###";}
       else {
          if (n == 0) {return 1;}
          else {return n * factorielle (n-1);}
       }
   }


		
			
			
	// Premiere partie de l'analyse			
	function AnalyseLexicale(expression,TabVariables){	
	//Liste rassemblant tous les noms de fonction unaire utilisable		
    FonctionUnaire = new Array(Racine,Exponentiel,Cosinus,Tangente,Sinus,Absolue,Logarithme);	
	//Liste rassemblant tous les mots clé et symbole possible a rechercher en priorité dans l'expression
	  var ListeMotCle = new Array(Racine,Vrai,Faux,Non,Exponentiel,Cosinus,Tangente,Sinus,Absolue,Factorielle,"mod","div",Logarithme,Different,">=","<","<=",Ou,Pi,Et,Egale,"(",")","+","-","*","/",">",",","^");
	 
	 
	  //on parcourt toute la chaine expression pour reconnaitre les tokens
	  pos = 0;		
	  while (pos != expression.length ){
         //on regarde si l'on reconnait un mot clé a partir de la position de lecture dans l'expression         
        MotCle = MotClePositionI(expression,ListeMotCle,pos);				 
				if (MotCle != null){
				  // Un mot clé a été reconnu				   
				   if ((MotCle==Vrai)||(MotCle==Faux)){//si c'est un booleen
					   AjouteToken(ListeToken,MotCle,"b");
					 }else if (MotCle== Pi){//si c'est pi
					   AjouteToken(ListeToken,Math.PI,"n");
					 }else if(IsInArray(MotCle, FonctionUnaire)){
					   AjouteToken(ListeToken,MotCle,"FONCTIONUNAIRE");
					 }else AjouteToken(ListeToken,MotCle,MotCle);				   		   
					 pos += MotCle.length;
				}else{
				     //on n'a pas reconnu de mot clé
				     //on regarde si ce ne serait pas un nombre (reel ou entier)
			       Nombre = NombrePositionI(expression,pos);	
			       if (Nombre!= null){
				      	AjouteToken(ListeToken,Nombre,"n");
				      	pos += Nombre.length;
				     }else{
				         //on regarde si c'est une chaine de caractere encadré : "chaine"				           
							   Chaine = ChainePositionI(expression,pos);					         
							   if (Chaine!= null){	
										AjouteToken(ListeToken,Chaine,"c");
			     	        pos += Chaine.length;
			           }else{									      		
			    	         // on regarde si c'est une variable
				             Variable = VariablePositionI(expression,pos);					                
									   if (Variable!= null){				                   
												 //on regarde si c'est une variable connue
										     Valeur = ValeurVariable(Variable,TabVariables);
												 //si c'est une variable connue												 
												 if (Valeur!= null){
													    if (typeof(Valeur)=="boolean"){	 
														    //on ajoute la valeur de la variable en précisant que c'est un booleen
														    if(Valeur== true){AjouteToken(ListeToken,Vrai,"b");}
																else if(Valeur== false){AjouteToken(ListeToken,Faux,"b");}
															}else if(typeof(Valeur) == "string"){	
																 //on ajoute la valeur de la variable en précisant que c'est une chaine  
															   AjouteToken(ListeToken,"\""+Valeur+"\"","c");
															}else if(typeof(Valeur)=="number"){	
																 	//on ajoute la valeur de la variable en précisant que c'est une chaine  
															    AjouteToken(ListeToken,Valeur,"n");																		      
															}		
												 }else{
												     //La variable est inconnue
													   alert(TexteVariableInconnue+Variable);
														 //Pour éviter d'envoyer deux fois un message d'erreur, on mémorise qu'une alerte a deja été envoyée
														 AlertEnvoye = true;
														 //On ajoute un Token erroné dans la table des symboles, sinon l'erreur serait ignorée dans la suite de l'analyse
														 AjouteToken(ListeToken,Variable,"VariableInconnue");
													 }													 
				                 pos += Variable.length;
				               }else {
					                    if (expression.charAt(pos)!=" "){
															   //Le symbole est inconnu
															   alert(TexteSymboleInconnu+expression.charAt(pos));
																 AlertEnvoye = true;
															   AjouteToken(ListeToken,expression.charAt(pos),"Symbole Inconnu");
																 }
					                    pos++;
					                    }
				            }
				        }		 		 
				    }
		   } 		   
              
				               
           
	} 
	
	//Fonction permettant de connaitre le type d'un Token (noeud) a la position 'pos' de la table des symboles
	function TypeTokenPosI(pos){	
	 if (ListeToken[pos]!= null){ return ListeToken[pos].Type}
	  else return "error";	
	} 
  
	//Fonction booléenne recherchant l'existance d'une valeur dans un tableau
	function IsInArray(valeur, tableau){ 
	   for(j in tableau){
			 if (tableau[j]==valeur){return true}
		 }	
	 return false;
	}
	
	
	// Deuxieme partie de l'analyse	 
  function AnalyseSyntaxique(){		
	   
		 //Table des symboles temporaire qui remplacera celle d'origine 
	   liste = new Array();
		 //Listes rassemblants plusieurs symboles
		 OCOMP = new Array("<",">","<=",">=");
		 OEGALEDIFF = new Array(Egale,Different);
		 OAMUL = new Array("*","/");	
		
				
		//on détecte certaine erreur de syntaxe facilement trouvable
		 var ListeTermeNonRepetable = new Array("+","^","div","mod",Et,Ou);
		 ListeTermeNonRepetable = ListeTermeNonRepetable.concat(OCOMP,OEGALEDIFF,OAMUL);
		 var CompteNbParenthese = true;
		 var NbParentheseOuvrante = 0;
		 var NbParentheseFermante = 0;		 
		 
		 for(var i=0;i in ListeToken;i++){      
		 if (TypeTokenPosI(i) == "FONCTIONUNAIRE"){			  
				 if (TypeTokenPosI(i+1) != "(") {				         
				      alert(TexteManqueParenthese+ListeToken[i].Valeur+" !");
							AlertEnvoye = true;
				      CompteNbParenthese = false;
					}			
			 } 
			 else if ((IsInArray(TypeTokenPosI(i), ListeTermeNonRepetable))||(TypeTokenPosI(i)=="-")){						
					if ((IsInArray(TypeTokenPosI(i+1), ListeTermeNonRepetable))||(TypeTokenPosI(i+1)==Factorielle)) {				      
							alert(TexteErreur+ListeToken[i].Valeur+TextePeutPasSuivre+ListeToken[i+1].Valeur+" !");
							AlertEnvoye = true;				      
					}	
					else if (TypeTokenPosI(i+1)==")"){
					  alert(TexteErreur+ListeToken[i].Valeur+TextePeutPasSuivre+") !");
						AlertEnvoye = true;
					}								 
			 }
			 else if (TypeTokenPosI(i) == "("){
			    NbParentheseOuvrante++;
			    if ((IsInArray(TypeTokenPosI(i+1), ListeTermeNonRepetable)||(TypeTokenPosI(i+1)==Factorielle))) {
				      alert(TexteErreur+ListeToken[i].Valeur+TextePeutPasSuivre+ListeToken[i+1].Valeur+" !");
							AlertEnvoye = true;				      
					}	
					else if (TypeTokenPosI(i+1)==")"){
					  alert(TexteParenthesesVides);
						AlertEnvoye = true;
					}		
				}	
				else if (TypeTokenPosI(i) == ")"){
			    NbParentheseFermante++;
			    if (TypeTokenPosI(i+1)=="(") {
				      alert(TexteErreur+ListeToken[i].Valeur+TextePeutPasSuivre+ListeToken[i+1].Valeur+" !");
							AlertEnvoye = true;				      
					}								 
			 } 	 
			
						  
     }
		 //on compare les nombres de parentheses ouvrantes et fermantes
		 if(CompteNbParenthese == true){
		    if(NbParentheseOuvrante < NbParentheseFermante) {
				       alert(TexteManqueOuvrante);
							 AlertEnvoye = true;
				}else if(NbParentheseOuvrante > NbParentheseFermante){
				    alert(TexteManqueFermante);
						AlertEnvoye = true;
						}
		 }
			
		
		//on commence véritablement la construction de l'arbre syntaxique abstraite 
		Modification = true;
		while (Modification ){
		//parcour de la liste de tokens (table des symboles) et choix de l'action associé a chaque type de token
		Position = 0;		
		Modification = false;
		while (Position < ListeToken.length ){ 
			  	 
		  if (TypeTokenPosI(Position) == "(") {AjouteToken2(liste,AS_parentheses(Position));}					
			else if (TypeTokenPosI(Position) == "FACTEUR") {AjouteToken2(liste,AS_FACTEUR(Position));}
			else if (TypeTokenPosI(Position) == "TERME") {AjouteToken2(liste,AS_TERME(Position));}
			else if (TypeTokenPosI(Position) == "EB") {AjouteToken2(liste,AS_EB(Position));}
			else if (TypeTokenPosI(Position) == "EA") {AjouteToken2(liste,AS_EA(Position));}	
			else if (TypeTokenPosI(Position) == "EX") {AjouteToken2(liste,AS_EX(Position));}		
			else if (TypeTokenPosI(Position) == "CHAINE") {AjouteToken2(liste,AS_CHAINE(Position));}			
			else if (TypeTokenPosI(Position) == Non) {AjouteToken2(liste,AS_non(Position));}
			else if (TypeTokenPosI(Position) == "FONCTIONUNAIRE") {AjouteToken2(liste,AS_FonctionUnaire(Position));}			
			else if (TypeTokenPosI(Position) == "-") {AjouteToken2(liste,AS_moins(Position));}
			
			else if (TypeTokenPosI(Position) == "n") {AjouteToken2(liste,AS_Simple(Position,"FACTEUR"));}
			else if (TypeTokenPosI(Position) == "c") {AjouteToken2(liste,AS_Simple(Position,"CHAINE"));}
			else if (TypeTokenPosI(Position) == "b") {AjouteToken2(liste,AS_Simple(Position,"EB"));}	
			else if (IsInArray(TypeTokenPosI(Position), OCOMP)) {AjouteToken2(liste,AS_Simple(Position,"OCOMP"));}
			else if (IsInArray(TypeTokenPosI(Position), OEGALEDIFF)) {AjouteToken2(liste,AS_Simple(Position,"OEGALEDIFF"));}
			else if (IsInArray(TypeTokenPosI(Position), OAMUL)) {AjouteToken2(liste,AS_Simple(Position,"OAMUL"));}
										
			else if (TypeTokenPosI(Position) != "error"){AjouteToken2(liste,ListeToken[Position]);}			
			
			Position++;			
		}
		ListeToken = new Array(); 
		ListeToken = liste;
		liste = new Array();
		}
			
	
	}
	//Fonction d'analyse syntaxique simple permettant de changer le type d'un Token
	function AS_Simple(i,TypeDeRenvoie){
	  LEToken = new CopieDeToken(ListeToken[i]);
		LEToken.Type = TypeDeRenvoie;		
		Modification = true;
		return LEToken;
	}
	
	//Si on lit une parenthese ouvrante
	function AS_parentheses(i){	  
		// EB -> (EB)
		if((TypeTokenPosI(i+1) == "EB")&&(TypeTokenPosI(i+2) == ")")){
		  LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			Modification = true;
		  Position+=2; 	
		 return LEToken;
		}
		// FACTEUR -> (EA)
	  else if ((TypeTokenPosI(i+1) == "EA")&&(TypeTokenPosI(i+2) == ")")&&(! IsInArray(TypeTokenPosI(i-1), FonctionUnaire))){
		 LEToken = new CopieDeToken(ListeToken[i+1]);
		 LEToken.Type = "FACTEUR";
		 Modification = true;
		 Position+=2;
		 return LEToken;
		}		
	  else return  ListeToken[i];	
	}
	
	//Si on lit un Token de type FACTEUR	
	function AS_FACTEUR(i){
	// TERME -> FACTEUR OAMUL TERME
	 if((TypeTokenPosI(i+1) == "OAMUL")&&(TypeTokenPosI(i+2) == "TERME")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "TERME";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
	 // FACTEUR -> FACTEUR ^ FACTEUR
	 else if((TypeTokenPosI(i+1) == "^")&&(TypeTokenPosI(i+2) == "FACTEUR")&&(TypeTokenPosI(i+3) != Factorielle)){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "FACTEUR";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
		// FACTEUR -> FACTEUR div FACTEUR
		//et FACTEUR -> FACTEUR mod FACTEUR
	 else if(((TypeTokenPosI(i+1) == "div")||(TypeTokenPosI(i+1) == "mod"))&&(TypeTokenPosI(i+2) == "FACTEUR")&&(TypeTokenPosI(i-1) != "mod")&&(TypeTokenPosI(i-1) != "div")&&(TypeTokenPosI(i-1) != "^")&&(TypeTokenPosI(i+3) != "^")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "FACTEUR";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
		// FACTEUR -> FACTEUR !
	 else if(TypeTokenPosI(i+1) == "!"){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "FACTEUR";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = null;
		  Modification = true;
			Position+=1; 	
		 return LEToken;
		}
		// TERME -> FACTEUR
	  else if ((TypeTokenPosI(i+1) != "OAMUL")&&(TypeTokenPosI(i+1) != "^")&&(TypeTokenPosI(i-1) != "^")&&(TypeTokenPosI(i+1) != "mod")&&(TypeTokenPosI(i-1) != "mod")&&(TypeTokenPosI(i+1) != "div")&&(TypeTokenPosI(i-1) != "div")){			 
		 return AS_Simple(i,"TERME");
		}
		else return  ListeToken[i];	
	}
	
	//Si on lit un Token de type TERME		
	function AS_TERME(i){
	// FACTEUR -> TERME + TERME
	// et FACTEUR -> TERME - TERME
	 if((TypeTokenPosI(i-1) != "OAMUL")&&((TypeTokenPosI(i+1) == "+")||(TypeTokenPosI(i+1) == "-"))&&(TypeTokenPosI(i+2) == "TERME")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "FACTEUR";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
		// EA -> TERME
	  else if ((TypeTokenPosI(i-1) != "OAMUL")&&(TypeTokenPosI(i+1) != "+")&&(TypeTokenPosI(i+1) != "-")&&(TypeTokenPosI(i-1) != "+")&&(TypeTokenPosI(i-1) != "-")){			 
		 return AS_Simple(i,"EA");
		}
		else return  ListeToken[i];	
	}	
	
	//Si on lit un Token de type FONCTIONUNAIRE
	function AS_FonctionUnaire(i){
  	// FACTEUR -> FONCTIONUNAIRE ( EA	)		
	 if((TypeTokenPosI(i+1) == "(")&&(TypeTokenPosI(i+2) == "EA")&&(TypeTokenPosI(i+3) == ")")){
	    LEToken = new CopieDeToken(ListeToken[i]);
			LEToken.Type = "FACTEUR";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i+2]);
		  LEToken.FilsDroit = null;
		  Modification = true;
			Position+=3; 	
		 return LEToken;
		}
		else return  ListeToken[i];	
	}	
	
	//Si on lit un Token de type EB	
	function AS_EB(i){
	// EB -> EB et EB
	 if((TypeTokenPosI(i+1) == Et)&&(TypeTokenPosI(i+2) == "EB")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
	// EB -> EB ou EB
	 else if((TypeTokenPosI(i+1) == Ou)&&(TypeTokenPosI(i+2) == "EB")&&(TypeTokenPosI(i-1) != Et)&&(TypeTokenPosI(i+3) != Et)){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}	
		// EB -> EB OEGALEDIFF EB 
	 else if((TypeTokenPosI(i+1) == "OEGALEDIFF")&&(TypeTokenPosI(i+2) == "EB")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
		  Position+=2; 	
		 return LEToken;
		}
	// EX -> EB
	 else if((TypeTokenPosI(i-1) != "(")&&(TypeTokenPosI(i+1) != ")")&&(TypeTokenPosI(i-1) != "OEGALEDIFF")&&(TypeTokenPosI(i+1) != "OEGALEDIFF")&&(TypeTokenPosI(i-1) != Non)&&(TypeTokenPosI(i-1) != Ou)&&(TypeTokenPosI(i+1) != Ou)&&(TypeTokenPosI(i-1) != Et)&&(TypeTokenPosI(i+1) != Et)){
	   return AS_Simple(i,"EX");
		}		
		else return  ListeToken[i];	
	}	
	
	//Si on lit un Token de type EA
	function AS_EA(i){
	// EB -> EA OCOMP EA
	// EB -> EA OEGALEDIFF EA
	if(((TypeTokenPosI(i+1) == "OCOMP")||(TypeTokenPosI(i+1) == "OEGALEDIFF"))&&(TypeTokenPosI(i+2) == "EA")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}	
	// EX -> EA
	 else if((TypeTokenPosI(i-1) != "(")&&(TypeTokenPosI(i+1) != ")")&&(TypeTokenPosI(i-1) != "OEGALEDIFF")&&(TypeTokenPosI(i+1) != "OEGALEDIFF")&&(TypeTokenPosI(i-1) != "OCOMP")&&(TypeTokenPosI(i+1) != "OCOMP")&&(TypeTokenPosI(i-1) != "+")&&(TypeTokenPosI(i-1) != "-")){
	   return AS_Simple(i,"EX");
		}		
		else return  ListeToken[i];	
	}	
	
	//Si on lit un Token de type CHAINE	
	function AS_CHAINE(i){
	// CHAINE -> CHAINE '+' CHAINE
	 if((TypeTokenPosI(i+1) == "+")&&(TypeTokenPosI(i+2) == "CHAINE")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "CHAINE";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
			Position+=2; 	
		 return LEToken;
		}
		// EB -> CHAINE OEGALEDIFF CHAINE
	  else if ((TypeTokenPosI(i+1) == "OEGALEDIFF")&&(TypeTokenPosI(i+2) == "CHAINE")&&(TypeTokenPosI(i+3) != "+")&&(TypeTokenPosI(i-1) != "+")){			 
		  LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
		  Position+=2; 	
		 return LEToken;
		}
		// EX -> CHAINE
	 else if((TypeTokenPosI(i+1) != "OEGALEDIFF")&&(TypeTokenPosI(i-1) != "OEGALEDIFF")&&(TypeTokenPosI(i+1) != "+")&&(TypeTokenPosI(i-1) != "+")){
	     return AS_Simple(i,"EX");		
		}
		else return  ListeToken[i];		
	}
	
	//Si on lit un Token de type 'non'		
	function AS_non(i){
	// EB ->  'non' EB
	 if(TypeTokenPosI(i+1) == "EB"){
	    LEToken = new CopieDeToken(ListeToken[i]);
			LEToken.Type = "EB";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i+1]);
		  LEToken.FilsDroit = null;
		  Modification = true;
		  Position+=1; 	
		 return LEToken;
		}
		else return  ListeToken[i];	
	}	
	
	//Si on lit un Token de type '-'
	function AS_moins(i){	
	   // FACTEUR ->  '-' FACTEUR
	    if((TypeTokenPosI(i-1)!=")")&&(TypeTokenPosI(i-1)!="FACTEUR")&&(TypeTokenPosI(i-1)!="TERME")&&(TypeTokenPosI(i-1)!="EA")&&(TypeTokenPosI(i+1) == "FACTEUR")&&(TypeTokenPosI(i+2) != "^")&&(TypeTokenPosI(i+2) != Factorielle)){
	       LEToken = new CopieDeToken(ListeToken[i]);
			   LEToken.Type = "FACTEUR";
			   LEToken.FilsGauche = new CopieDeToken(ListeToken[i+1]);
		     LEToken.FilsDroit = null;
		     Modification = true;
		     Position+=1; 	
		     return LEToken;
		   }			 
			 else return  ListeToken[i];		
	}		
	
	//Si on lit un Token de type EX		
	function AS_EX(i){
	// EX ->  EX , EX
	 if((TypeTokenPosI(i+1) == ",")&&(TypeTokenPosI(i+2) == "EX")){
	    LEToken = new CopieDeToken(ListeToken[i+1]);
			LEToken.Type = "EX";
			LEToken.FilsGauche = new CopieDeToken(ListeToken[i]);
		  LEToken.FilsDroit = new CopieDeToken(ListeToken[i+2]);
		  Modification = true;
		  Position+=2; 	
		 return LEToken;
		}
		else return  ListeToken[i];	
	}	
		
		
	// Troisieme partie de l'analyse	
	// On parcourt récursivement chaque noeud de l'arbre pour l'evaluer
	// On ne tient plus compte des types des Tokens, mais bien de leurs valeurs
	function AnalyseSemantique(Arbre){
	  //si c'est un nombre
	  if (EstNombre(Arbre.Valeur)||(typeof(Arbre.Valeur)=="number")){			           
        return parseFloat(Arbre.Valeur);}
		//si c'est une chaine		
		else if (Arbre.Valeur == ChainePositionI(Arbre.Valeur,0)){			   
		    return Arbre.Valeur.substring(1,Arbre.Valeur.length-1);
		}	
		//si c'est le booleen Vrai	
		else if (Arbre.Valeur == Vrai )
		    return true;
		//si c'est le booleen Faux		
		else if (Arbre.Valeur == Faux )
		    return false;		
		//si c'est une addition		
    else if (Arbre.Valeur == '+')
        return AnalyseSemantique(Arbre.FilsGauche) + AnalyseSemantique(Arbre.FilsDroit);
    //si c'est une soustraction ou un moins unaire
		else if (Arbre.Valeur == '-'){		   
		    var PartieGauche = AnalyseSemantique(Arbre.FilsGauche);				 
				if (Arbre.FilsDroit == null){ 
				    //c'est le moins unaire
				    return - PartieGauche;
				 }else {return PartieGauche - AnalyseSemantique(Arbre.FilsDroit);}
				}
		//si c'est une multiplication		
    else if (Arbre.Valeur == '*')
        return AnalyseSemantique(Arbre.FilsGauche) * AnalyseSemantique(Arbre.FilsDroit);
		//si c'est une division
		else if (Arbre.Valeur == '/'){
		    var PartieDroite = AnalyseSemantique(Arbre.FilsDroit);
        //on verifie qu'on ne fait pas une division par zéro
				if (PartieDroite == 0){ 
				     alert(TexteDivisionZero);
						 AlertEnvoye = true;
				}else return AnalyseSemantique(Arbre.FilsGauche) / AnalyseSemantique(Arbre.FilsDroit);			
		}
		//si c'est une égalité
		else if (Arbre.Valeur == Egale)
        return AnalyseSemantique(Arbre.FilsGauche) == AnalyseSemantique(Arbre.FilsDroit);
		//si c'est une difference
		else if (Arbre.Valeur == Different)
        return AnalyseSemantique(Arbre.FilsGauche) != AnalyseSemantique(Arbre.FilsDroit);	
		//si c'est inferieur
		else if (Arbre.Valeur == '<')
        return AnalyseSemantique(Arbre.FilsGauche) < AnalyseSemantique(Arbre.FilsDroit);	
		//si c'est supérieur
		else if (Arbre.Valeur == '>')
        return AnalyseSemantique(Arbre.FilsGauche) > AnalyseSemantique(Arbre.FilsDroit);	
		//si c'est inferieur ou égale
		else if (Arbre.Valeur == '<=')
        return AnalyseSemantique(Arbre.FilsGauche) <= AnalyseSemantique(Arbre.FilsDroit);	
		//si c'est superieur ou égale
		else if (Arbre.Valeur == '>=')
        return AnalyseSemantique(Arbre.FilsGauche) >= AnalyseSemantique(Arbre.FilsDroit);						
		//si c'est le NON booleen
		else if (Arbre.Valeur == Non)
        return ! AnalyseSemantique(Arbre.FilsGauche);			
		//si c'est le ET booleen
		else if (Arbre.Valeur == Et)
        return AnalyseSemantique(Arbre.FilsGauche) && AnalyseSemantique(Arbre.FilsDroit);	
		//si c'est le OU booleen
		else if (Arbre.Valeur == Ou)
        return AnalyseSemantique(Arbre.FilsGauche) || AnalyseSemantique(Arbre.FilsDroit);							
	  //si c'est la virgule permettant la concatenation
		else if (Arbre.Valeur == ','){
		    var PartieGauche = AnalyseSemantique(Arbre.FilsGauche);
				var PartieDroite = AnalyseSemantique(Arbre.FilsDroit);				
				if(PartieGauche === true) PartieGauche = Vrai;
				if(PartieGauche === false) PartieGauche = Faux;
				if(PartieDroite === true) PartieDroite = Vrai;
				if(PartieDroite === false) PartieDroite = Faux;
        return PartieGauche + PartieDroite;
		}	
		//si c'est une puissance
		else if (Arbre.Valeur == '^')
        return Math.pow(AnalyseSemantique(Arbre.FilsGauche), AnalyseSemantique(Arbre.FilsDroit));			
		//si c'est un modulo
		else if (Arbre.Valeur == 'mod'){
		       var PartieDroite = AnalyseSemantique(Arbre.FilsDroit);
			     //on verifie que l'on ne fait pas un mod de zéro
					 if (PartieDroite == 0){
					      alert(TexteModZero);
								AlertEnvoye = true;
					 }else return AnalyseSemantique(Arbre.FilsGauche) % PartieDroite;
				}		
		//si c'est un div
		else if (Arbre.Valeur == 'div'){
		    var PartieGauche = AnalyseSemantique(Arbre.FilsGauche);
				var PartieDroite = AnalyseSemantique(Arbre.FilsDroit);	
		    //on verifie que l'on ne fait pas un div de zéro
				if (PartieDroite == 0) {
				   alert(TexteDivZero);
					 AlertEnvoye = true;
				}else{
		      var Resultat = PartieGauche / PartieDroite;
          if (Resultat > 0) {return Math.floor(Resultat);}
				  else {return - Math.floor(Math.abs(Resultat));}
				}				
		}	
		
 //Fonctions unaires :
			
		//si c'est la fonction racine carrée	
		else if (Arbre.Valeur == Racine)
		  {
			 var PartieGauche = AnalyseSemantique(Arbre.FilsGauche);
			 //on verifie que la valeur est bien positive pour faire la racine carrée
			 if (PartieGauche <0){
			    alert(TexteRacineNegative);
					AlertEnvoye = true;			    
			 }else return Math.sqrt(PartieGauche);				
			}	
		//si c'est la fonction exponentiel	
		else if (Arbre.Valeur == Exponentiel)
        return Math.exp(AnalyseSemantique(Arbre.FilsGauche));	
		//si c'est la fonction cosinus
		else if (Arbre.Valeur == Cosinus)
        return Math.cos(AnalyseSemantique(Arbre.FilsGauche));	
		//si c'est la fonction tangente
		else if (Arbre.Valeur == Tangente)
        return Math.tan(AnalyseSemantique(Arbre.FilsGauche));
		//si c'est la fonction sinus
		else if (Arbre.Valeur == Sinus)
        return Math.sin(AnalyseSemantique(Arbre.FilsGauche));	
		//si c'est la fonction absolue
		else if (Arbre.Valeur == Absolue)
        return Math.abs(AnalyseSemantique(Arbre.FilsGauche));			
		//si c'est la fonction logarithme
		else if (Arbre.Valeur == Logarithme)
        return Math.log(AnalyseSemantique(Arbre.FilsGauche));					
		//si c'est la fonction factorielle
		else if (Arbre.Valeur == Factorielle){
		  var PartieGauche = AnalyseSemantique(Arbre.FilsGauche);
			//on verifie que la valeur est bien positive pour faire la factorielle
			if (PartieGauche <0){
			   alert(TexteFactorielleNegative);
				 AlertEnvoye = true;
			}else return factorielle(PartieGauche);				
		}			
		
		
		
										
	}
				
		
		
	
	