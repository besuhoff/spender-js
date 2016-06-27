/**
 * Fixes localization of a datepicker that cannot be configured
 * See https://github.com/angular-ui/bootstrap/issues/2072
 */
angular.module('spender')
    .directive('dateToIso', function dateToIso(moment) {
      var linkFunction = function (scope, element, attrs, ngModelCtrl) {

        ngModelCtrl.$parsers.push(function(datepickerValue) {
          return moment(datepickerValue).format("YYYY-MM-DD");
        });
      };

      return {
        restrict: "A",
        require: "ngModel",
        link: linkFunction
      };
    });
