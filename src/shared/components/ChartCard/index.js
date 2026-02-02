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

// Funções auxiliares para manipular cores
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace('#', ''), 16);
  const R = (num >> 16) & 255;
  const G = (num >> 8) & 255;
  const B = num & 255;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

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
        top: 5,
        textStyle: {
          color: '#d4af37',
          fontFamily: 'Georgia, serif',
          fontSize: compactMode ? 14 : 16,
          fontWeight: 600,
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowBlur: 4
        }
      },
      tooltip: {
        trigger: type === 'pie' ? 'item' : 'axis',
        backgroundColor: 'rgba(20,20,20,0.95)',
        borderColor: '#d4af37',
        borderWidth: 1,
        textStyle: { color: '#f5f5f5', fontSize: 13 },
        padding: [10, 14],
        extraCssText: 'box-shadow: 0 4px 20px rgba(0,0,0,0.4); border-radius: 8px;'
      },
      legend: type === 'pie' ? {
        orient: 'horizontal',
        bottom: 10,
        textStyle: { color: '#b0b0b0', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 15
      } : {
        show: false
      },
      grid: type === 'pie' ? undefined : {
        left: '8%',
        right: '5%',
        bottom: '12%',
        top: compactMode ? 45 : 55,
        containLabel: true,
        ...additionalProps.grid
      },
      xAxis: type === 'pie' ? undefined : {
        type: 'category',
        data: data.map(item => item.name || item.day || item.month),
        axisLine: { lineStyle: { color: '#4a4a4a' } },
        axisLabel: { color: '#909090', fontSize: 10 },
        axisTick: { show: false }
      },
      yAxis: type === 'pie' ? undefined : {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: { color: '#909090', fontSize: 10 }
      },
      series: []
    };

    switch (type) {
      case 'pie':
        base.series = [{
          name: title,
          type: 'pie',
          radius: compactMode ? ['35%', '55%'] : ['40%', '65%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#1a1a1a',
            borderWidth: 2
          },
          label: {
            show: !compactMode,
            color: '#d0d0d0',
            fontSize: 11,
            formatter: '{b}: {c}'
          },
          emphasis: {
            label: { show: true, fontWeight: 'bold', fontSize: 13 },
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: data.map((item, i) => ({
            name: item.name,
            value: item[dataKey],
            itemStyle: { 
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[i % colors.length] },
                { offset: 1, color: adjustColor(colors[i % colors.length], -30) }
              ])
            }
          }))
        }];
        break;

      case 'bar':
        base.series = [{
          name: title,
          type: 'bar',
          data: data.map(item => item[dataKey]),
          barWidth: '60%',
          itemStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[0] },
              { offset: 1, color: adjustColor(colors[0], -40) }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: adjustColor(colors[0], 20) },
                { offset: 1, color: colors[0] }
              ])
            }
          }
        }];
        break;

      case 'line':
        base.series = [{
          name: title,
          type: 'line',
          data: data.map(item => item[dataKey]),
          smooth: 0.4,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { 
            color: colors[0], 
            width: 3,
            shadowColor: colors[0],
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          itemStyle: { 
            color: colors[0],
            borderColor: '#1a1a1a',
            borderWidth: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: hexToRgba(colors[0], 0.4) },
              { offset: 1, color: hexToRgba(colors[0], 0.02) }
            ])
          }
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
