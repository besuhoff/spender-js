angular.module('spender')
  .component('incomeCategoriesPage', {
    templateUrl: 'js/app/spender/income-categories-page/income-categories-page.html',
    controller: function(IncomeService, ChartService, IncomeCategoryService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
      }

      function initCategories(reload) {
        return IncomeCategoryService.loadAll(reload).then(function(categories) {
          ctrl.categories = categories;
        });
      }

      function initIncomes() {
        IncomeService.loadAll().then(function(incomes) {
          ctrl.incomes = incomes;
          ctrl.categoriesChart = ChartService.buildCategoriesChart(incomes, 'incomeCategory');
        });
      }

      ctrl.categories = false;
      ctrl.incomes = [];

      initIncomes();
      initCategories();
      initCategory();

      ctrl.saveCategory = function(category) {
        if (category.name) {
          return IncomeCategoryService.update(category).then(function() {
            return initCategories(true);
          });
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          return IncomeCategoryService.add(ctrl.category).then(function () {
            return initCategories(true).then(function () {
              initCategory();
            });
          })
        }
      };

      ctrl.deleteCategory = function(category) {
        return IncomeCategoryService.delete(category).then(function() {
          return initCategories(true);
        })
      };
    }
  });
