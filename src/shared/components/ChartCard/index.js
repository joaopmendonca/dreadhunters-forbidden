import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';

import {
  PieChart,
  BarChart,
  LineChart
} from 'echarts/charts';

import {
  CanvasRenderer
} from 'echarts/renderers';

import styles from './ChartCard.module.css';

// registra apenas os componentes que vamos usar
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer
]);

export default function ChartCard({
  title,
  type,
  data,
  dataKey,
  colors = [],
  compactMode = false,
  additionalProps = {}
}) {
  // Gera a série e configurações comuns conforme o tipo
  const getOption = () => {
    const base = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          color: 'var(--light)',
          fontFamily: 'var(--font-serif)',
          fontSize: compactMode ? 14 : 18
        }
      },
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: { color: 'var(--light)' }
      },
      legend: type === 'pie' ? {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: 'var(--light)' }
      } : {
        data: [title],
        top: compactMode ? 25 : 30,
        textStyle: { color: 'var(--light)' }
      },
      grid: type === 'pie' ? undefined : {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        ...additionalProps.grid
      },
      xAxis: type === 'pie' ? undefined : {
        type: 'category',
        data: data.map(item => item.name || item.day || item.month),
        axisLine: { lineStyle: { color: 'var(--light)' } },
        axisLabel: { color: 'var(--light)' }
      },
      yAxis: type === 'pie' ? undefined : {
        type: 'value',
        axisLine: { lineStyle: { color: 'var(--light)' } },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        axisLabel: { color: 'var(--light)' }
      },
      series: []
    };

    switch (type) {
      case 'pie':
        base.series = [{
          name: title,
          type: 'pie',
          radius: compactMode ? ['30%', '50%'] : ['40%', '60%'],
          avoidLabelOverlap: !compactMode,
          label: { show: !compactMode },
          data: data.map((item, i) => ({
            name: item.name,
            value: item[dataKey],
            itemStyle: { color: colors[i % colors.length] }
          }))
        }];
        break;

      case 'bar':
        base.series = [{
          name: title,
          type: 'bar',
          data: data.map(item => item[dataKey]),
          itemStyle: { color: colors[0] }
        }];
        break;

      case 'line':
        base.series = [{
          name: title,
          type: 'line',
          data: data.map(item => item[dataKey]),
          smooth: true,
          lineStyle: { color: colors[0] },
          areaStyle: additionalProps.areaStyle || {}
        }];
        break;

      default:
        break;
    }

    return base;
  };

  return (
    <div className={`${styles.card} ${compactMode ? styles.compact : ''}`}>
      <ResponsiveChart option={getOption()} height={compactMode ? 220 : 300} />
    </div>
  );
}

// componente auxiliar para o responsivo
function ResponsiveChart({ option, height }) {
  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: `${height}px` }}
      notMerge
      lazyUpdate
    />
  );
}
