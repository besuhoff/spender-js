angular.module('spender')
  .service('CacheService', function Service(IncomeCategoryService, IncomeService, CategoryService, ExpenseService,
                                            PaymentMethodService, CurrencyService,
                                            $q, $rootScope) {

    var that = this,
      _incomeCategories = [],
      _categories = [],
      _expenses = [],
      _incomes = [],
      _paymentMethods = [],
      _currencies = [];

    that.prepareExpense = function(expense) {
      expense.category = CategoryService.getOne(+expense.categoryId);
      expense.paymentMethod = PaymentMethodService.getOne(+expense.paymentMethodId);
      if (expense.targetIncomeId) {
        expense.targetIncome = IncomeService.getOne(+expense.targetIncomeId);
        expense.targetIncome.sourceExpense = expense;
      }
    };

    that.prepareIncome = function(income) {
      income.paymentMethod = PaymentMethodService.getOne(+income.paymentMethodId);
      income.incomeCategory = IncomeCategoryService.getOne(+income.incomeCategoryId);
    };

    that.preparePaymentMethod = function(paymentMethod) {
      paymentMethod.currency = CurrencyService.getOne(+paymentMethod.currencyId);
    };

    that.prepareEverything = function() {
      _paymentMethods.forEach(function(paymentMethod) {
        that.preparePaymentMethod(paymentMethod);
      });

      _expenses.forEach(function(expense) {
        that.prepareExpense(expense);
      });

      _incomes.forEach(function(income) {
        that.prepareIncome(income);
      });
    };

    that.refreshPaymentMethods = function() {
      return PaymentMethodService.loadAll(true).then(function(paymentMethods) {
        _paymentMethods = paymentMethods;

        that.prepareEverything();
        PaymentMethodService.recordListChange();
        return _paymentMethods
      });
    };

    that.initPaymentMethodDependencies = function() {
      $rootScope.$watch(
        function() { return IncomeService.getListChangedAt(); },
        function(newDate, oldDate) { if (newDate !== oldDate) { that.refreshPaymentMethods(); } }
      );

      $rootScope.$watch(
        function() { return ExpenseService.getListChangedAt(); },
        function(newDate, oldDate) { if (newDate !== oldDate) { that.refreshPaymentMethods(); } }
      );
    };

    that.loadAll = function(reload) {
      return $q.all({
        incomeCategories: IncomeCategoryService.loadAll(reload),
        categories: CategoryService.loadAll(reload),
        expenses: ExpenseService.loadAll(reload),
        incomes: IncomeService.loadAll(reload),
        currencies: CurrencyService.loadAll(reload),
        paymentMethods: PaymentMethodService.loadAll(reload)
      }).then(function(results) {
        _incomeCategories = results.incomeCategories;
        _categories = results.categories;
        _expenses = results.expenses;
        _incomes = results.incomes;
        _currencies = results.currencies;
        _paymentMethods = results.paymentMethods;

        that.prepareEverything();

        [
          IncomeService,
          ExpenseService,
          PaymentMethodService,
          IncomeCategoryService,
          CategoryService,
          CurrencyService
        ].forEach(function(service) {
          service.recordListChange();
        });

        that.initPaymentMethodDependencies();
      });
    }


  });