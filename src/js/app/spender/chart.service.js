angular.module('spender')
  .service('ChartService', function() {
    this.buildChart = function (transactions) {
      var chartMap = {},
        paymentMethodsMap = {},
        datesMap = {};

      // Create a widely rerefied matrix of transactions
      transactions.forEach(function (e) {
        var date = e.createdAt.split('T')[0],
          currency = e.paymentMethod.currency;
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

        paymentMethodsMap[currency][e.paymentMethodId] = e.paymentMethod.name;
        datesMap[currency][date] = date;
        chartMap[currency][e.paymentMethodId][date] += +e.amount;
      });

      var chart = {},
        colors = [
          "#E53935",
          "#546E7A",
          "#D81B60",
          "#757575",
          "#8E24AA",
          "#6D4C41",
          "#5E35B1",
          "#F4511E",
          "#3949AB",
          "#FB8C00",
          "#1E88E5",
          "#FFB300",
          "#039BE5",
          "#FDD835",
          "#00ACC1",
          "#C0CA33",
          "#00897B",
          "#7CB342",
          "#43A047"
        ];

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
            line.push(chartMap[currency][paymentMethodId] && chartMap[currency][paymentMethodId][date] || 0);
          });

          chart[currency].datasets.push({
            label: paymentMethodsMap[currency][paymentMethodId],
            borderWidth: 0,
            backgroundColor: colors[paymentMethodIndex % colors.length],
            hoverBackgroundColor: colors[paymentMethodIndex % colors.length]
          });

          chart[currency].data.push(line);
        })
      });

      return chart;
    };
  });