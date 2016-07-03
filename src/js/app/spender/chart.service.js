angular.module('spender')
  .service('ChartService', function(moment) {
    function _buildChart(chartMap, paymentMethodsMap, datesMap, datasetConfig) {
      datasetConfig = datasetConfig || {};

      var chart = {};

      // Fill everything with zeros
      Object.keys(chartMap).forEach(function (currency) {
        chart[currency] = {
          datasets: [],
          data: [],
          options: {
            scales: {
              xAxes: [{
                type: 'category',
                barPercentage: 1.0,
                categoryPercentage: 1.0,
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            }
          }
        };

        var datePoints = Object.keys(datesMap[currency]).sort(),
          startDateMoment = moment(datePoints[0], 'YYYY-MM-DD'),
          startDateMomentFormatted = startDateMoment.format('YYYY-MM-DD'),
          endDate = datePoints[datePoints.length - 1];

        while(startDateMomentFormatted < endDate) {
          startDateMoment.add(1, 'days');
          startDateMomentFormatted = startDateMoment.format('YYYY-MM-DD');

          if (datePoints.indexOf(startDateMomentFormatted) === -1) {
            datePoints.push(startDateMomentFormatted);
          }
        }

        datePoints = datePoints.sort();
        chart[currency].labels = datePoints;

        Object.keys(paymentMethodsMap[currency]).forEach(function(paymentMethodId, paymentMethodIndex) {
          var line = [];

          datePoints.forEach(function(date) {
            line.push(+((chartMap[currency][paymentMethodId] && chartMap[currency][paymentMethodId][date] || 0).toFixed(2)));
          });

          chart[currency].datasets.push(angular.extend({}, datasetConfig, {
            label: paymentMethodsMap[currency][paymentMethodId].name,
            borderColor: paymentMethodsMap[currency][paymentMethodId].color,
            hoverBorderColor: paymentMethodsMap[currency][paymentMethodId].color,
            backgroundColor: 'rgba(' + hex(paymentMethodsMap[currency][paymentMethodId].color) + ',' + (datasetConfig.backgroundOpacity || '0.5') + ')',
            hoverBackgroundColor: 'rgba(' + hex(paymentMethodsMap[currency][paymentMethodId].color) + ','  + (datasetConfig.backgroundOpacity || '0.5') + ')',
            pointBorderColor: paymentMethodsMap[currency][paymentMethodId].color,
            pointHoverBorderColor: paymentMethodsMap[currency][paymentMethodId].color,
            pointHoverBackgroundColor: paymentMethodsMap[currency][paymentMethodId].color,
            pointBackgroundColor: "#fff"
          }));

          chart[currency].data.push(line);
        });
      });

      return chart;
    }

    function _fillInMaps(transactions, chartMap, paymentMethodsMap, datesMap) {
      transactions.forEach(function(e) {
        var currency = e.paymentMethodCurrency,
          date = e.createdAt.split('T')[0];

        if (!chartMap[currency]) {
          chartMap[currency] = {};
        }

        if (!datesMap[currency]) {
          datesMap[currency] = {};
        }

        if (!paymentMethodsMap[currency]) {
          paymentMethodsMap[currency] = {};
        }

        if (!chartMap[currency][e.paymentMethodId]) {
          chartMap[currency][e.paymentMethodId] = {};
        }

        if (chartMap[currency][e.paymentMethodId][date] === undefined) {
          chartMap[currency][e.paymentMethodId][date] = 0;
        }

        paymentMethodsMap[currency][e.paymentMethodId] = {
          name: e.paymentMethodName,
          color: e.paymentMethodColor
        };
        datesMap[currency][date] = date;
        chartMap[currency][e.paymentMethodId][date] += +e.amount;
      });
    }

    this.buildTransactionsChart = function(transactions) {
      var chartMap = {},
        paymentMethodsMap = {},
        datesMap = {};

      // Create a widely rarefied matrix of transactions
      _fillInMaps(transactions, chartMap, paymentMethodsMap, datesMap);

      return _buildChart(chartMap, paymentMethodsMap, datesMap, { borderWidth: 0, backgroundOpacity: 1  });
    };

    this.buildBalanceChart = function(expenses, incomes, paymentMethods) {
      var chartMap = {},
        paymentMethodsMap = {},
        datesMap = {},
        totalsMap = {};

      // Get all transactions sorted by reverse date order to do a retrospective analysis
      var transactions = incomes.concat(
        expenses.map(function(expense) {
          var e = angular.copy(expense);
          e.amount *= -1;
          return e;
        })
      ).sort(function(a, b) {
        return a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0;
      });

      paymentMethods.forEach(function(paymentMethod) {
        // set initial values for retrospective
        totalsMap[paymentMethod.id] = +paymentMethod.incomes - +paymentMethod.expenses;
      });

      _fillInMaps(transactions, chartMap, paymentMethodsMap, datesMap);

      Object.keys(chartMap).forEach(function(currency) {
        var datePoints = Object.keys(datesMap[currency]).sort(),
          startDateMoment = moment(datePoints[0], 'YYYY-MM-DD'),
          startDateMomentFormatted = startDateMoment.format('YYYY-MM-DD'),
          endDate = datePoints[datePoints.length - 1];

        while(startDateMomentFormatted < endDate) {
          startDateMoment.add(1, 'days');
          startDateMomentFormatted = startDateMoment.format('YYYY-MM-DD');

          if (datePoints.indexOf(startDateMomentFormatted) === -1) {
            datePoints.push(startDateMomentFormatted);
          }
        }

        datePoints = datePoints.sort();
        datePoints.reverse();

        Object.keys(chartMap[currency]).forEach(function(paymentMethodId) {
          var previousChange = 0;
          datePoints.forEach(function(date) {
            totalsMap[paymentMethodId] -= previousChange;
            previousChange = chartMap[currency][paymentMethodId][date] || 0;
            chartMap[currency][paymentMethodId][date] = totalsMap[paymentMethodId];
          });
        });
      });

      return _buildChart(chartMap, paymentMethodsMap, datesMap, { lineTension: 0,  backgroundOpacity: 0.25 });
    };

    this.buildCategoriesChart = function(transactions, categoryKey) {
      var categoriesMap = {};

      // Fill everything with zeros
      var chart = {};

      transactions.forEach(function(e) {
        var categoryId = e[categoryKey + 'Id'],
          currency = e.paymentMethodCurrency;

        if (!categoriesMap[currency]) {
          categoriesMap[currency] = {};
        }

        if (!categoriesMap[currency][categoryId]) {
          categoriesMap[currency][categoryId] = {
            label: e[categoryKey + 'Name'],
            color: e[categoryKey + 'Color'],
            total: 0
          };
        }

        categoriesMap[currency][categoryId].total += +e.amount;
      });

      Object.keys(categoriesMap).map(function(currency) {
        var colors = [],
          data = [],
          labels = [];

        Object.keys(categoriesMap[currency]).map(function(key) {
          data.push(categoriesMap[currency][key].total);
          labels.push(categoriesMap[currency][key].label);
          colors.push(categoriesMap[currency][key].color);
        });

        chart[currency] = {
          labels: labels,
          data: [data],
          options: {},
          datasets: [{
            borderColor: colors,
            hoverBorderColor: colors,
            backgroundColor: colors,
            hoverBackgroundColor: colors
          }]
        };
      });

      return chart;
    };

    function hex(hex) {
      if (/^#/.test(hex)) {
        hex = hex.slice(1);
      }
      if (hex.length !== 3 && hex.length !== 6) {
        throw new Error("Invaild hex String");
      }

      var digit = hex.split("");

      if (digit.length === 3) {
        digit = [digit[0], digit[0], digit[1], digit[1], digit[2], digit[2]]
      }
      var r = parseInt([digit[0], digit[1]].join(""), 16);
      var g = parseInt([digit[2], digit[3]].join(""), 16);
      var b = parseInt([digit[4], digit[5]].join(""), 16);
      return [r, g, b];
    }
  });
