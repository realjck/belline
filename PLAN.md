# Belline

Application compagnon pour les oracles Belline

> Oracle de Belline = Jeu de 53 cartes, rangées dans 7 groupes de 7 cartes (sauf les 4 premières). Voir le détail dans @assets/urls.md

Nous avons auparavant réalisé une application de YiJing, disponible ici : @assets/app_yijing/.

J'aimerais garder le même "look and feel" au niveau de l'application : 
- Même format 720px de large max, pensé pour Mobile First
- Même navbar, avec boutons préférences, info, thème sombre/clair
- Même modales de préférences et d'info
- Même boutons avec filets arrondis et même typo
- Garder les sons au clic sur les boutons (désactivable via les préf.)

AU NIVEAU TECHNIQUE :
- Localisation à prévoir (anglais / français, puis italien espagnol peut-être)
- Peut être fait en Vanilla JS, ou bien avec framework, selon ta racommandation.
- Pour l'instant nous ne ferons pas de PWA, mais peut-être ensuite.

Ce que l'on change :
- Les couleurs, trouver une nouvelle teinte neutre, plutôt dans les blancs cassés : #dccbaf en clair, et anthracite en sombre. On ajoutera un logo plus tard.

On changera bien entendu le contenu, voici pour la première version qu'ensuite nous ferons évoluer :

### Page "Home"
- titre : "L'Oracle de Belline", sous titre "Application compagnon"
- 2 boutons : "Les cartes" et "Consulter l'oracle"

### Page "Les Cartes"
On affichera ici une liste défilante des cartes de Belline.
On affichera chaque groupe avec le nom de sa planète au dessus, sauf le premier (4 premières cartes = pas de nom de groupe)
En dessous de chaque titre de groupe, on aura les cartes disposées sur une grille de 4 colonnes

Les couleurs des groupes titrés sont les suivantes :
- Soleil : #d47706
- Lune : #3c6382
- Mercure : #e64f3a
- Venus : #089992
- Mars : #b81540
- Jupiter : #0c2462
- Saturne : #814c9a

> Toutes les cartes en jpg sont disponibles ici @assets/cartes_illustrations

ATTENTION : Prévoir que la carte puisse contenir du texte localisé en superposition (nous ferons cela en détail lors d'une prochaine session)

Au clic sur une carte en petit :
> On voit la carte en gros (hauteur max dispo) : **Page "carte"**
> puis reclique une seconde fois : on voit le **Page "texte de la carte"**

Page "Texte de la carte" : 
- Se reférer à ce qu'il a été fait dans l'application app_yijing : tous les fichiers sont en markdown (à récupérer depuis @assets/cartes_textes_complets/), et nous afficherons donc le texte complet du fichier markdown correspondant à la carte. Plus tard nous ferons évoluer en ne séléctionnant que certaines parties, comme dans l'app Yijing.

Nous aurons les boutons retour et avance en bas de l'écran à gauche et à droite, commme sur l'app_yijing.

### Page "Consulter l'oracle"
Cela fera partie d'une prochaine session de travail.

Je te laisse donc commencer ce projet, tu peux me poser les questions nécessaires.
