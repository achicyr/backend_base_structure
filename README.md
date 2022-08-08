# backend_base_structure

## CRÉER UN FICHIER .env
si des données sensibles sont utilisé (ce qui n'est pas encore le cas à l'heure où j'écris ces lignes), il faudra créer ce fichier "./.env" contenant les informations que je liste ci-après:
- PORT (Number)
- APP_SECRET (String)
- ...

## BONS À SAVOIR: 
COMMENT ET POURQUOI FAIRE TOURNER ECMAScript MODULE SYNTAXE
- https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
=> by adding the property "type":"module" to package.json.
**...MAIS IL SEMBLE QUE CE N'A PAS FONCTIONNÉ .... '(**)

