function getIndexedDB() {
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
}

function getIDBTransaction() {
    return window.IDBTransaction || window.webkitIDBTransaction;
}

var app = angular.module('congotour', ["ui.bootstrap"]);
app.config(function($routeProvider) {
    $routeProvider
            .when('/', {
        controller: 'AccueilCtrl',
        templateUrl: 'template/accueil.html'
    })
            .when('/provinces', {
        controller: 'ListeVillesCtrl',
        templateUrl: 'template/listeville.html'
    })
            .when('/provinces/ajouter', {
        controller: 'ajouterProvinceCtrl',
        templateUrl: 'template/formprovince.html'
    })
            .when('/provinces/:province/ajouter', {
        controller: 'ajouterVilleCtrl',
        templateUrl: 'template/formville.html'
    })
            .when('/villes/:ville', {
        controller: 'villeCtrl',
        templateUrl: 'template/ville.html'
    })
            .when('/villes/:ville/publier', {
        controller: 'publierCtrl',
        templateUrl: 'template/formpublication.html'
    })
            .when('/publications/:publication', {
        controller: 'publicationCtrl',
        templateUrl: 'template/publication.html'
    })
            .otherwise({
        redirectTo: '/'
    });
});
app.directive('butterbar', ['$rootScope', function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                element.addClass('hide');
                $rootScope.$on('$routeChangeStart', function() {
                    element.removeClass('hide');
                });
                $rootScope.$on('$routeChangeSuccess', function() {
                    element.addClass('hide');
                });
            }
        };
    }]);
app.factory("DB", ['$q', '$rootScope', function($q, $rootScope) {

        var defer = $q.defer();
        if ($rootScope.setUp !== false && $rootScope.setUp !== true) {

            $rootScope.setUp = false;
        }
        if ($rootScope.setUp === true) {
            return;
        }
        function init() {
            indexedDB = getIndexedDB();
            var openRequest = indexedDB.open("congotour", 8);
            openRequest.onerror = function(e) {
                console.log(e);
                defer.reject(e.value);
            };
            openRequest.onupgradeneeded = function(e) {

                var db = e.target.result;
                if (db.objectStoreNames.contains("ville")) {
                    db.deleteObjectStore("ville");
                }
                if (db.objectStoreNames.contains("publication")) {
                    db.deleteObjectStore("publication");
                }
                var storeville = db.createObjectStore("ville", {autoIncrement: true});
                storeville.createIndex('nom', "nom", {unique: false});
                storeville.createIndex('province', "province", {unique: false});
                var storepublication = db.createObjectStore("publication", {autoIncrement: true});
                storepublication.createIndex("tags", "tags", {unique: false, multiEntry: true});
                storepublication.createIndex('ville', "ville", {unique: false});
            }
            ;
            openRequest.onsuccess = function(e) {
                var db = e.target.result;
                db.onerror = function(event) {
                    // Generic error handler for all errors targeted at this database's
                    // requests!
                    defer.reject(e);
                };
                $rootScope.setUp = true;
                $rootScope.$apply(function() {

                    console.log('base de donnée chargée');
                    defer.resolve(db);
                });
            }
            ;

            return defer.promise;
        }
        return init().then();
    }]);
app.factory("provinces", [function() {
        return provinces;
    }]);
app.directive('onReadFile', function($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            var progress = $parse(attrs.onProgress)

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                reader.onprogress = function(onProgressEvent) {
                    progress(scope, {$evt: onProgressEvent});
                }
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent: onLoadEvent.target.result});
                    });
                };

                reader.readAsDataURL((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});