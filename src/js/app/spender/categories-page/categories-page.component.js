angular.module('spender')
  .component('categoriesPage', {
    templateUrl: 'js/app/spender/categories-page/categories-page.html',
    controller: function($scope, CategoryService, ChartService, ExpenseService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
        ctrl.isNewLoaded = undefined;
      }

      function initCategories(reload) {
        return CategoryService.loadAll(reload).then(function(categories) {
          ctrl.categories = categories;
          ctrl.isLoaded = {};
          ctrl.updateSelectedColors();
        });
      }

      $scope.$watch(function() {
        return ExpenseService.getListChangedAt();
      }, function() {
        ctrl.expenses = ExpenseService.getAll();
        ctrl.categoriesChart = ChartService.buildCategoriesChart(ctrl.expenses, 'category');
      });

      initCategories();
      initCategory();

      ctrl.saveCategory = function(category) {
        if (category.name) {
          ctrl.isLoaded[category.id] = CategoryService.update(category);

          return ctrl.isLoaded[category.id];
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          ctrl.isNewLoaded = CategoryService.add(ctrl.category).then(function(category) {
            return initCategory();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteCategory = function(category) {
        ctrl.isLoaded[category.id] = CategoryService.delete(category);

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
