'use strict';

angular.module('ddsApp').controller('FoyerRessourceYearMoins2Ctrl', function($scope, $state, categoriesRnc, IndividuService, SituationService) {
    var today = $scope.situation.dateDeValeur;
    $scope.yearMoins2 = moment(today).subtract('years', 2).format('YYYY');
    $scope.debutAnneeGlissante = moment(today).subtract('years', 1).format('MMMM YYYY');

    $scope.individuRefs = [];
    SituationService.getIndividusSortedParentsFirst($scope.situation).forEach(function(individu) {
        var individuRef = {
            individu: individu,
            label: IndividuService.label(individu),
            rnc: []
        };
        categoriesRnc.forEach(function(categorieRnc) {
            var ressource = _.find(individu.ressources, { type: categorieRnc.id });
            var montant = ressource ? ressource.montant : undefined;
            individuRef.rnc.push({ categorie: categorieRnc, montant: montant});
        });
        var hasYM2Ressources = individuRef.rnc.some(function(rnc) { return rnc.montant !== undefined; });
        individuRef.display = IndividuService.isParent(individu) || hasYM2Ressources;
        $scope.individuRefs.push(individuRef);
    });

    $scope.display = function(individuRef) {
        individuRef.display = true;
    };

    $scope.getDefaultValue = function(individuRef, rncID) {
        var mapping = {
            rncRevenusActivite: 'revenusSalarie',
            rncPensionsRetraitesRentes: 'pensionsRetraitesRentes',
            rncAutresRevenus: 'allocationsChomage'
        };
        individuRef.individu.ressourcesYearlyApproximation = individuRef.individu.ressourcesYearlyApproximation || {};
        return individuRef.individu.ressourcesYearlyApproximation[mapping[rncID]];
    };

    $scope.submit = function() {
        $scope.individuRefs.forEach(function(individuRef) {
            // clean anciennes valeurs
            individuRef.individu.ressources = _.filter(individuRef.individu.ressources, function(ressource) {
                return ! _.find(categoriesRnc, { id: ressource.type });
            });

            // Remove from rnc the values that are not modified by the user
            individuRef.rnc = _.filter(individuRef.rnc, function(rnc) {
                return rnc.montant;
            });

            individuRef.rnc.forEach(function(rnc) {
                individuRef.individu.ressources.push({
                    periode: $scope.yearMoins2,
                    type: rnc.categorie.id,
                    montant: rnc.montant
                });
            });
        });

        $scope.$emit('rnc');
    };
});
