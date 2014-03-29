/**
 * Constructeur des objets de type auteur
 * 
 * @param {string} photo l'url de la photo de l'auteur
 * @param {string} nom le nom de l'auteur
 * @returns {auteur} un objet auteur
 */
function auteur(photo, nom) {
    this.nom = nom;
    this.photo = photo;
}
/**
 * Constructeur des objets de type commentaire
 * 
 * @param {string} contenu le contenu du commentaire
 * @param {auteur} auteur l'auteur du oommentaire
 * @returns {commentaire}
 */
function commentaire(contenu, auteur) {
    this.contenu = contenu;
    this.auteur = auteur;
    this.publication = null;
}
/**
 * constructeur des objets de type publication
 * 
 * @param {string} image
 * @param {string} description
 * @param {array} commentaires
 * @param {auteur} auteur
 * @returns {publication} objet de type publication
 */
function publication(image, description, commentaires, auteur) {
    for (commentaire in commentaires)
    {
        commentaire.publication = this;
    }
    this.commentaires = commentaires;
    this.image = image;
    this.description = description;
    this.auteur = auteur;
    this.ville = null;
    /**
     * Permet d'ajouter un commentaire
     * 
     * @param {commentaire} commentaire
     * @returns {commentaire}
     */
    this.addCommentaire = function(commentaire) {
        commentaire.publication = this;
        this.commentaires.push(commentaire);
    };
    /**
     * Permet d'effacer un commentaire
     * 
     * @param {int} index
     * @returns {commentaire}
     */
    this.retirerCommentaire = function(index) {
        this.commentaires.splice(index, 1);
        return this;
    };
}
/**
 * constructeur des objets de type ville
 * 
 * @param {string} nom
 * @param {array} publications
 * @returns {ville}
 */
function ville(nom, publications) {
    this.nom = nom;
    this.publications = publications;
    /**
     * Permet d'ajouter une publication
     * 
     * @param {publication} publication
     * @returns {ville}
     */
    this.addPublication = function(publication) {
        this.publications.push(publication);
        return this;
    };
    /**
     * Permet d'effacer une publication
     * 
     * @param {int} index
     * @returns {ville}
     */
    this.retirerPublication = function(index) {
        this.publications.splice(index, 1);
        return this;
    };
}
/**
 * Constructeur des objets de type province
 * 
 * @param {string} nom
 * @param {string} url
 * @param {string} image
 * @param {array} villes
 * @returns {province}
 */
function province(nom, url, image, villes) {
    this.nom = nom;
    this.url = url;
    this.image = image;
    this.villes = villes;
    /**
     * Permet d'ajouter une ville
     * 
     * @param {ville} ville
     * @returns {province}
     */
    this.addVille = function(ville) {
        this.villes.push(ville);
        return this;
    };
    this.retirerVille = function(index) {
        this.villes.splice(index, 1);
        return this;
    };
}
;


