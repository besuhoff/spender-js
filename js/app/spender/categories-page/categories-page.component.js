angular.module('spender')
  .component('categoriesPage', {
    templateUrl: 'js/app/spender/categories-page/categories-page.html',
    controller: function(DataService, CategoryService) {
      var ctrl = this;

      function initCategory() {
        ctrl.category = {};
      }

      function initCategories() {
        return CategoryService.loadAll().then(function(categories) {
          ctrl.categories = categories;
        });
      }

      initCategories();
      initCategory();

      ctrl.saveCategory = function(category) {
        if (category.Name) {
          return CategoryService.update(category).then(function() {
            return initCategories();
          });
        }
      };

      ctrl.addCategory = function() {
        if (ctrl.category.Name) {
          return CategoryService.add(ctrl.category).then(function () {
            return initCategories().then(function () {
              initCategory();
            });
          })
        }
      };

      ctrl.deleteCategory = function(category) {
        return CategoryService.delete(category).then(function() {
          return initCategories();
        })
      };
    }
  });
