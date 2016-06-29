angular.module('spender')
    .component('datetime', {
      require: {
        ngModelController: 'ngModel'
      },
      bindings: {},
      templateUrl: 'js/app/spender/datetime/datetime.html',
      controller: function($attrs, moment) {
        var ctrl = this;
        ctrl.today = new Date();
    
        $attrs.$observe('disabled', function(isDisabled) { ctrl.disabled = isDisabled; });

        ctrl.setValue = function() {
          // If both date and time are correct, let's set value
          if (ctrl.date && ctrl.time) {
            var value = moment(
                ctrl.date + 'T' + moment(ctrl.time).format('HH:mm:ss'),
                moment.ISO_8601
            );

            ctrl.ngModelController.$setViewValue(value.isValid() ? value.format() : null);
          } else if (ctrl.ngModelController.$viewValue) {
            // If user started removing data and there was previously a valid date set, let's flush it
            ctrl.ngModelController.$setViewValue(null);
          }
        };

        ctrl.$onInit = function() {
          ctrl.ngModelController.$render = function() {
            var datetime = ctrl.ngModelController.$viewValue;
            ctrl.time = datetime ? moment(moment(datetime).format('HH:mm'), 'HH:mm').toDate() : null;
            ctrl.date = datetime ? moment(datetime).format('YYYY-MM-DD') : null;
          };
        };
      }
    });
