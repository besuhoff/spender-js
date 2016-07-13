angular.module('spender')
  .component('incomeCategoriesPage', {
    templateUrl: 'js/app/spender/income-categories-page/income-categories-page.html',
    controller: function($scope, IncomeService, ChartService, IncomeCategoryService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
        ctrl.isNewLoaded = undefined;
      }

      function initCategories(reload) {
        return IncomeCategoryService.loadAll(reload).then(function(categories) {
          ctrl.categories = categories;
          ctrl.isLoaded = {};
          ctrl.updateSelectedColors();
        });
      }

      $scope.$watch(function() {
        return IncomeService.getListChangedAt();
      }, function() {
        ctrl.incomes = IncomeService.getAll();
        ctrl.categoriesChart = ChartService.buildCategoriesChart(ctrl.incomes, 'incomeCategory');
      });

      ctrl.categories = false;

      initCategories();
      initCategory();

      ctrl.saveCategory = function(category) {
        if (category.name) {
          ctrl.isLoaded[category.id] = IncomeCategoryService.update(category);

          return ctrl.isLoaded[category.id];
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          ctrl.isNewLoaded = IncomeCategoryService.add(ctrl.category).then(function(category) {
            return initCategory();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteCategory = function(category) {
        ctrl.isLoaded[category.id] = IncomeCategoryService.delete(category);

        return ctrl.isLoaded[category.id];
      };

      ctrl.updateSelectedColors = function() {
        ctrl.selectedColors = ctrl.categories.map(function(c) { return c.color; });
        if (ctrl.category.color) {
          ctrl.selectedColors.push(ctrl.category.color);
        }
      };

      ctrl.hasChart = function() {
        return ctrl.categoriesChart && Object.keys(ctrl.categoriesChart).length > 0;
      };
    }
  });
