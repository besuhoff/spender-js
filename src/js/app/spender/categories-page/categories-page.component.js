angular.module('spender')
  .component('categoriesPage', {
    templateUrl: 'js/app/spender/categories-page/categories-page.html',
    controller: function(CategoryService, ChartService, ExpenseService) {
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

      function initExpenses() {
        ExpenseService.loadAll().then(function(expenses) {
          ctrl.expenses = expenses;
          ctrl.categoriesChart = ChartService.buildCategoriesChart(expenses, 'category');
        });
      }

      ctrl.categories = false;
      ctrl.expenses = [];

      initExpenses();
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
            ctrl.categories.push(category);

            return initCategory();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteCategory = function(category) {
        ctrl.isLoaded[category.id] = CategoryService.delete(category).then(function() {
          ctrl.categories.splice(ctrl.categories.indexOf(category), 1);
        });

        return ctrl.isLoaded[category.id];
      };

      ctrl.updateSelectedColors = function() {
        ctrl.selectedColors = ctrl.categories.map(function(c) { return c.color; });
        if (ctrl.category.color) {
          ctrl.selectedColors.push(ctrl.category.color);
        }
      };
    }
  });
