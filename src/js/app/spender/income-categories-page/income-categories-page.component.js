angular.module('spender')
  .component('incomeCategoriesPage', {
    templateUrl: 'js/app/spender/income-categories-page/income-categories-page.html',
    controller: function(IncomeService, ChartService, IncomeCategoryService, $q) {
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
          ctrl.isLoaded[category.id] = IncomeCategoryService.update(category);
          return ctrl.isLoaded[category.id];
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          ctrl.isNewLoaded = IncomeCategoryService.add(ctrl.category).then(function(category) {
            ctrl.categories.push(category);

            return initCategory();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteCategory = function(category) {
        ctrl.isLoaded[category.id] = IncomeCategoryService.delete(category).then(function() {
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
