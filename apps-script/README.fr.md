# Alertes Combinatorics-LSM1

## Installation

1. Créer un projet sur https://script.new et le nommer **Combinatorics-LSM1 — Alertes**.
2. Remplacer `Code.gs` par le fichier fourni et ajouter un fichier HTML nommé `Widget` contenant `Widget.html`.
3. Dans les paramètres du projet, afficher le manifeste `appsscript.json`, puis y copier le manifeste fourni. Enregistrer.
4. **Déployer → Nouveau déploiement → Application Web** : exécuter en tant que propriétaire, accès **Tout le monde**. Autoriser la lecture de Drive, l’envoi de courriels et la gestion du déclencheur. Le code limite la lecture au dossier du cours ; l’autorisation Google de lecture porte néanmoins sur Drive.
5. Dans l’éditeur, exécuter `initializeCourse` une fois. Seul le propriétaire peut lancer cette fonction. Elle établit la référence initiale sans envoyer d’alerte et installe une vérification horaire. Ne pas partager le projet avec les étudiants.
6. Copier l’URL de déploiement terminée par `/exec` dans `webAppUrl`, dans `assets/course-updates.js`. Publier les modifications du site.
7. Ouvrir cette URL et le site dans une fenêtre privée pour vérifier l’accès sans connexion. Faire une inscription avec une adresse de test autorisée ; confirmer, ajouter un document public de test au dossier puis exécuter `initializeCourse`. Vérifier l’alerte et le désabonnement.

## Fonctionnement

- Dossier surveillé : `1UjDDTHxBOWgyOfvKD9Ov06tSq1WuuK6s`, sous-dossiers compris. Raccourcis exclus.
- Les fichiers doivent être accessibles à tous ou à toute personne disposant du lien. Aucun réglage de partage n’est modifié.
- Détection des ajouts, changements de nom et dates de modification. Les suppressions ne déclenchent pas d’alerte.
- Les fichiers déjà présents lors de la première exécution constituent la référence, sans notification.
- Les adresses restent dans les propriétés privées du script. Confirmation sous 24 h, suppression au désabonnement et purge des demandes expirées à la prochaine exécution.
- Les visites du lien de confirmation ou de désabonnement ne modifient rien avant le clic explicite sur le bouton.
- L’iframe affiche la date détectée et la dernière vérification. Le lien de secours permet l’inscription si le navigateur bloque l’intégration.
- Limites configurées : 300 fichiers publics, 250 inscriptions, 20 courriels de confirmation par jour. Les envois d’alertes respectent le quota Google disponible en réservant 10 destinataires. Les destinataires en attente sont traités aux prochaines vérifications, avec regroupement des mises à jour.
- En cas d’échec entre l’envoi d’un courriel et l’enregistrement de son état, un doublon reste possible à la reprise.
- Les quotas et interruptions Google peuvent retarder les alertes. Contrôler **Exécutions** en cas de problème ; la date de dernière vérification reste visible.

## Maintenance

Après une modification du script : **Déployer → Gérer les déploiements → Modifier → Nouvelle version**. Conserver le même déploiement pour garder l’URL.
Pour suspendre les alertes : supprimer le déclencheur horaire `poll_` depuis la page **Déclencheurs** du projet.
Les données privées ne doivent jamais être copiées dans le dépôt GitHub.

Documentation : [applications Web](https://developers.google.com/apps-script/guides/web), [déclencheurs](https://developers.google.com/apps-script/guides/triggers/installable), [quotas](https://developers.google.com/apps-script/guides/services/quotas).
