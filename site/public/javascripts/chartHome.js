$(function () {
  function setValue(op) {
    var a = [];
    switch(op){
      case 0:
      a.push(0);
      for(var i = 0; i < 5; i++){
        a.push(Number(data[0][i]));
      }

      break;
      case 1:
      a.push(0);
      for(var i = 0; i < 5; i++){
        a.push(Number(data[1][i]));
      }
      break;
      case 2:
      a.push(0);
      for(var i = 0; i < 5; i++){
        a.push(Number(data[2][i]));
      }
      break;
      case 3:
      a.push(0);
      for(var i = 0; i < 5; i++){
        a.push(Number(data[3][i]));
      }
      break;
      default:
      console.log("err");
      break;
    }
    return a;
  }

  
  Highcharts.setOptions({
    colors: ['#3C85F7', '#FF0000', '#00FF00', '#9fdbea']
  });

  $('#areaChart').highcharts({
    chart: {
      type: 'areaspline',
      zoomType: 'x'
    },
    title: { text: null },
    legend: { enabled: true },

    xAxis: {
      type: 'datetime',
      categories: [
        '',
        cate[0][4],
        cate[1][4],
        cate[2][4],
        cate[3][4],
        cate[4][4]
      ],
      min: 0.5,
      max: 5,
      plotLines: [{
        color: '#3C85F7',
        dashStyle: 'solid',
        value: '3',
        width: '1'
      }]
    },

    yAxis: {
      title: {
        text: null
      }
    },

    tooltip: {
      shared: true
    },

    credits: {
      enabled: false
    },

    plotOptions: {
      areaspline: {
        fillOpacity: 0.8
      },
      series: {
        marker: { enabled: false },
        lineWidth: 0
      }
    },

    series: [{
      name: 'option1',
      data: setValue(0)
    },{
      name: 'option2',
      data: setValue(1)
    },{
      name: 'option3',
      data: setValue(2)
    },{
      name: 'option4',
      data: setValue(3)
    }]
  });
});