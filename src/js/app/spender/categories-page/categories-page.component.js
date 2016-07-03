angular.module('spender')
  .component('categoriesPage', {
    templateUrl: 'js/app/spender/categories-page/categories-page.html',
    controller: function(CategoryService, ChartService, ExpenseService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
      }

      function initCategories(reload) {
        return CategoryService.loadAll(reload).then(function(categories) {
          ctrl.categories = categories;
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
          return CategoryService.update(category).then(function() {
            return initCategories(true);
          });
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          return CategoryService.add(ctrl.category).then(function () {
            return initCategories(true).then(function () {
              initCategory();
            });
          })
        }
      };

      ctrl.deleteCategory = function(category) {
        return CategoryService.delete(category).then(function() {
          return initCategories(true);
        })
      };

      ctrl.updateSelectedColors = function() {
        ctrl.selectedColors = ctrl.categories.map(function(c) { return c.color; });
      }
    }
  });
