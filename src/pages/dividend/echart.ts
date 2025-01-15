// import * as echarts from 'echarts';

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);
// var option;

// function randomData() {
//   now = new Date(+now + oneDay);
//   value = value + Math.random() * 21 - 10;
//   return {
//     name: now.toString(),
//     value: [
//       [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
//       Math.round(value)
//     ]
//   };
// }
// let data = [];
// let now = new Date(1997, 9, 3);
// let oneDay = 24 * 3600 * 1000;
// let value = Math.random() * 1000;
// for (var i = 0; i < 1000; i++) {
//   data.push(randomData());
// }
// option = {
//   title: {
//     text: 'Dynamic Data & Time Axis'
//   },
//   tooltip: {
//     trigger: 'axis',
//     formatter: function (params) {
//       params = params[0];
//       var date = new Date(params.name);
//       return (
//         date.getDate() +
//         '/' +
//         (date.getMonth() + 1) +
//         '/' +
//         date.getFullYear() +
//         ' : ' +
//         params.value[1]
//       );
//     },
//     axisPointer: {
//       animation: false
//     }
//   },
//   xAxis: {
//     type: 'time',
//     splitLine: {
//       show: false
//     }
//   },
//   yAxis: {
//     type: 'value',
//     boundaryGap: [0, '100%'],
//     splitLine: {
//       show: false
//     }
//   },
//   series: [
//     {
//       name: 'Fake Data',
//       type: 'line',
//       showSymbol: false,
//       data: data
//     }
//   ]
// };
// setInterval(function () {
//   for (var i = 0; i < 5; i++) {
//     data.shift();
//     data.push(randomData());
//   }
//   myChart.setOption({
//     series: [
//       {
//         data: data
//       }
//     ]
//   });
// }, 1000);

// option && myChart.setOption(option);

const Options = {
    legend: {
        orient: 'vertical',
        textStyle: {
            color: 'white',
            fontSize: 16,
        },
        top: 50,
        right: 20,
    },

    tooltip: {
        show: false,
        trigger: 'axis',
        alwaysShowContent: true,
        formatter: function (params: any) {
            let result = params.map(function (item: any) {
                console.log(item)
                return `<span>${item.seriesName}: <span style="color: ${item.value > 0 ? 'red' : 'green'}">${item.value}</span></span>`;
            });
            return result.join('<br/>');
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: "category",
        animation: false,
        min: 'dataMin',  // 自动设置最小值
        max: 'dataMax',  // 自动设置最大值
        splitLine: {
            show: false
        },
        axisLine: {
            onZero: true,
            show: false   // 隐藏 x 轴的坐标线
        },
        offset: 20,
        axisTick: {
            show: false   // 隐藏 x 轴的刻度
        },
        axisLabel: {
            interval: 10,  // 显示所有标签
            color: '#FFe119',  // 设置 x 轴刻度标签颜色为黄色
            verticalAlign: 'middle'  // 标签垂直居中
        },
        nameTextStyle: {
            color: '#FFe119',  // 黄色字体颜色
            fontSize: 16,      // 字体大小
            fontWeight: 'bold', // 字体加粗
        },
        boundaryGap: false,
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        animation: false,
        splitLine: {
            show: false
        },
        min: 250000,
        axisLabel: {
            color: '#FFe119'  // 设置 x 轴刻度标签颜色为黄色
        },
        nameTextStyle: {
            color: '#FFe119',  // 黄色字体颜色
            fontSize: 16,      // 字体大小
            fontWeight: 'bold' // 字体加粗
        },
        splitNumber: 4, // 设置 5 个分隔
    },
    grid: {
        top: 80,
        left: 70,
        right: 40,
        bottom: 50
    }
}
export default {}