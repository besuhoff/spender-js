angular.module('spender')
  .component('colorPicker', {
    require: {
      ngModelController: 'ngModel'
    },
    bindings: {
      disabledOptions: '<?'
    },
    templateUrl: 'js/app/spender/color-picker/color-picker.html',
    controller: function ($element, $document, $scope) {
      var ctrl = this;

      ctrl.colors = [
        "#67B4D2",
        "#73CF76",
        "#A5DCF2",
        "#FFAF6B",
        "#FF837C",
        "#93AFF8",
        "#FFEDAE",
        "#7CBCE4",
        "#7FE7E8",
        "#D2FB97",
        "#B0B9EC",
        "#A4FDC6",
        "#A4E28B",
        "#FFD9B7",
        "#E7A6C9",
        "#74C9CD",
        "#FFB0AE",
        "#D29CFC",
        "#9DF7F2",
        "#C1C2D1"
      ];

      $document.on('click', function(e) {
        if (!$element.has(e.target).length) {
          ctrl.isOpen = false;
          $scope.$apply();
        }
      });

      ctrl.disabledOptions = ctrl.disabledOptions || [];

      ctrl.setColor = function(value) {
        if (!ctrl.isOptionsDisabled(value)) {
          ctrl.ngModelController.$setViewValue(value);
        }
      };

      ctrl.isOptionsDisabled = function(color) {
        return this.disabledOptions.indexOf(color) !== -1;
      }
    }
  });