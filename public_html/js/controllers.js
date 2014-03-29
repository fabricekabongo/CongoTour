app.controller('AccueilCtrl', function($scope, DB) {
    DB.then(function(db) {
    });
})
        .controller('ListeVillesCtrl', function($scope, DB, provinces) {
    DB.then(function(db) {
        $scope.provinces = [];
        var trans = db.transaction(['ville'], "readwrite");
        var store = trans.objectStore('ville');
        for (var i = 0; i < provinces.items.length; i++) {
            var view = {province: provinces.items[i], villes: []};
            $scope.provinces.push(view);
            var cursorRequest = store.index("province").openCursor($scope.provinces[i].province.url);

            cursorRequest.onsuccess = function(e) {
                var cursor = e.target.result;
                if (cursor) {
                    for (var y = 0; y < $scope.provinces.length; y++) {

                        if ($scope.provinces[y].province.url === cursor.value.province) {
                            $scope.provinces[y].villes.push({id: cursor.primaryKey, ville: cursor.value});
                        }
                    }
                    $scope.$apply();
                    cursor.continue();
                }


            };
            cursorRequest.onerror = function(e) {
                console.log("erreur");
                console.log(e);
            };
        }

    });
})
        .controller('villeCtrl', function($scope, DB, $routeParams, provinces) {
    var ensuite = DB.then(function(db) {
        var idVille = $routeParams.ville;
        $scope.villeid = idVille;
        var trans = db.transaction(['ville'], "readwrite");
        var villeStore = trans.objectStore('ville');
        var keyRange = IDBKeyRange.bound((idVille * 1), (idVille * 1));
        var villeRequest = villeStore.openCursor(keyRange);
        villeRequest.onsuccess = function(e) {
            if (e.target.result) {
                $scope.ville = e.target.result.value;
                $scope.ville.publications = [];
                $scope.province = provinces.chercherProvince($scope.ville.province);
                $scope.$apply();
                e.target.result.continue();
            }
        };
        villeRequest.onerror = function(e) {
            console.log("erreur");
            console.log(e);
        };
        return db;
    });
    ensuite.then(function(db) {
        var trans = db.transaction(['publication'], "readwrite");
        var store = trans.objectStore('publication');
        var cursorRequest = store.index("ville").openCursor($routeParams.ville);
        cursorRequest.onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                $scope.ville.publications.push({id: cursor.primaryKey, publication: cursor.value});
                $scope.$apply();
                cursor.continue();
            }


        };
        cursorRequest.onerror = function(e) {
            console.log("erreur");
            console.log(e);
        };
    });
})
        .controller('publicationCtrl', function($scope, DB, $routeParams,$location) {
    console.log($location);
    DB.then(function(db) {
        $scope.path = $location.$$absUrl;
        var idPublication = $routeParams.publication;
        $scope.publicationid = idPublication;
        var trans = db.transaction(['publication'], "readwrite");
        var publicationStore = trans.objectStore('publication');
        var keyRange = IDBKeyRange.bound((idPublication * 1), (idPublication * 1));
        var publicationRequest = publicationStore.openCursor(keyRange);
        publicationRequest.onsuccess = function(e) {
            if (e.target.result) {
                $scope.publication = e.target.result.value;
                $scope.$apply();
                e.target.result.continue();
            }
        };
        publicationRequest.onerror = function(e) {
            console.log("erreur");
            console.log(e);
        };
        return db;
    });
})
        .controller('publierCtrl', function($scope, DB, $routeParams,$location) {
    $scope.loading = 0;
    DB.then(function(db) {
        var idVille = $routeParams.ville;
        $scope.villeid = idVille;
        var trans = db.transaction(['ville'], "readwrite");
        var villeStore = trans.objectStore('ville');
        var keyRange = IDBKeyRange.bound((idVille * 1), (idVille * 1));
        var villeRequest = villeStore.openCursor(keyRange);
        villeRequest.onsuccess = function(e) {
            if (e.target.result) {
                $scope.ville = e.target.result.value;
                $scope.province = provinces.chercherProvince($scope.ville.province);
                $scope.$apply();
                e.target.result.continue();
            }
        };
        villeRequest.onerror = function(e) {
            console.log("erreur");
            console.log(e);
        };
        $scope.image = null;
        $scope.getContent = function(content) {
            $scope.image = content;
        };
        $scope.progress = function(evt) {
            $scope.$apply(function() {
                if (evt.lengthComputable) {
                    var loaded = (evt.loaded / evt.total);
                    if (loaded <= 1) {
                        $scope.loading = loaded * 100;
                    }
                }
            });
        };
        $scope.ajouterPublication = function() {
            var transaction = db.transaction(["publication"], "readwrite");
            transaction.oncomplete = function(event) {
                console.log("All done!");
                $location.path('/villes/'+idVille);
                $scope.$apply();
            };
            transaction.onerror = function(event) {
// Don't forget to handle errors!
                console.log(event);
            };
            var objectStore = transaction.objectStore("publication");
            //use put versus add to always write, even if exists
            var requet = objectStore.put({image: $scope.image, ville: idVille, description: $scope.description});
            requet.onsuccess = function(event) {
                console.log('publication ajoutée')
                $scope.image = "";
                $scope.description = "";
                $scope.$apply();
            };
        };
    });
})
        .controller('ajouterProvinceCtrl', function($scope, DB, $location) {
    $scope.loading = 0;
    DB.then(function(db) {
        $scope.image = null;
        $scope.getContent = function(content) {
            $scope.image = content;
        };
        $scope.progress = function(evt) {
            $scope.$apply(function() {
                if (evt.lengthComputable) {
                    var loaded = (evt.loaded / evt.total);
                    if (loaded <= 1) {
                        $scope.loading = loaded * 100;
                    }
                }
            });
        };
        $scope.ajouterProvince = function() {
            var transaction = db.transaction(["province"], "readwrite");
            transaction.oncomplete = function(event) {
                console.log("All done!");
            };
            transaction.onerror = function(event) {
// Don't forget to handle errors!
                console.log(event);
            };
            var objectStore = transaction.objectStore("province");
            //use put versus add to always write, even if exists
            var requet = objectStore.put({nom: $scope.nom, url: $scope.url, image: $scope.image});
            requet.onsuccess = function(event) {
                $location.path('/provinces');
            };
        };
    });
})
        .controller('ajouterVilleCtrl', function($scope, DB, $routeParams, provinces, $location) {
    DB.then(function(db) {

        var url = $routeParams.province;
        $scope.province = provinces.chercherProvince(url);
        $scope.ajouterVille = function() {
            var transaction = db.transaction(["ville"], "readwrite");
            transaction.oncomplete = function(event) {
                console.log("All done!");
            };
            transaction.onerror = function(event) {
// Don't forget to handle errors!
                console.log(event);
            };
            var villeStore = transaction.objectStore("ville");
            //use put versus add to always write, even if exists
            var request = villeStore.put({nom: $scope.nom, province: $scope.province.url});
            request.onsuccess = function(event) {
                $location.path('/provinces');
            };
        };
    });
});