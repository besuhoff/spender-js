angular.module('spender')
  .component('incomeCategoriesPage', {
    templateUrl: 'js/app/spender/income-categories-page/income-categories-page.html',
    controller: function(IncomeCategoryService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
      }

      function initCategories() {
        return IncomeCategoryService.loadAll().then(function(categories) {
          ctrl.categories = categories;
        });
      }

      initCategories();
      initCategory();

      ctrl.saveCategory = function(category) {
        if (category.name) {
          return IncomeCategoryService.update(category).then(function() {
            return initCategories();
          });
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.name) {
          return IncomeCategoryService.add(ctrl.category).then(function () {
            return initCategories().then(function () {
              initCategory();
            });
          })
        }
      };

      ctrl.deleteCategory = function(category) {
        return IncomeCategoryService.delete(category).then(function() {
          return initCategories();
        })
      };
    }
  });
