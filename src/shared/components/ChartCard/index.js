import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent
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

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  GraphicComponent,
  PieChart,
  BarChart,
  LineChart,
  CanvasRenderer
]);

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
  centerLabel,
  additionalProps = {}
}) {
  const isPie = type === 'pie';
  const total = isPie
    ? data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0)
    : 0;

  const getOption = () => {
    const base = {
      title: {
        text: title,
        left: 'center',
        top: 6,
        textStyle: {
          color: '#d4af37',
          fontFamily: 'Georgia, serif',
          fontSize: compactMode ? 13 : 15,
          fontWeight: 600,
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowBlur: 4
        }
      },
      tooltip: {
        trigger: isPie ? 'item' : 'axis',
        backgroundColor: 'rgba(20,20,20,0.95)',
        borderColor: '#d4af37',
        borderWidth: 1,
        textStyle: { color: '#f5f5f5', fontSize: 13 },
        padding: [10, 14],
        extraCssText: 'box-shadow: 0 4px 20px rgba(0,0,0,0.4); border-radius: 8px;',
        formatter: isPie ? '{b}: <b>{c}</b>' : undefined
      },
      legend: { show: false },
      grid: !isPie ? {
        left: '8%',
        right: '5%',
        bottom: '12%',
        top: compactMode ? 45 : 55,
        containLabel: true,
        ...additionalProps.grid
      } : undefined,
      xAxis: !isPie ? {
        type: 'category',
        data: data.map(item => item.name || item.day || item.month),
        axisLine: { lineStyle: { color: '#4a4a4a' } },
        axisLabel: { color: '#909090', fontSize: 10 },
        axisTick: { show: false }
      } : undefined,
      yAxis: !isPie ? {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: { color: '#909090', fontSize: 10 }
      } : undefined,
      graphic: [],
      series: []
    };

    switch (type) {
      case 'pie': {
        if (centerLabel) {
          base.graphic = [
            {
              type: 'text',
              left: 'center',
              top: '37%',
              style: {
                text: centerLabel.toUpperCase(),
                textAlign: 'center',
                fill: '#8a8a8a',
                fontSize: 10,
                letterSpacing: 3
              }
            },
            {
              type: 'text',
              left: 'center',
              top: '45%',
              style: {
                text: String(total),
                textAlign: 'center',
                fill: '#f5f5f5',
                fontSize: 24,
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif'
              }
            }
          ];
        }

        base.series = [{
          name: title,
          type: 'pie',
          radius: ['42%', '64%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#111',
            borderWidth: 3
          },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 5,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          },
          data: data.map((item, i) => ({
            name: item.name,
            value: item[dataKey],
            itemStyle: { color: colors[i % colors.length] }
          }))
        }];
        break;
      }

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

  const chartHeight = isPie ? 190 : (compactMode ? 220 : 300);

  return (
    <div className={`${styles.card} ${compactMode ? styles.compact : ''}`}>
      <ReactECharts
        option={getOption()}
        style={{ width: '100%', height: `${chartHeight}px` }}
        notMerge
        lazyUpdate
      />
      {isPie && (
        <ul className={styles.customLegend}>
          {data.map((item, i) => (
            <li
              key={item.name}
              className={`${styles.customLegendItem} ${!item[dataKey] ? styles.dimmed : ''}`}
            >
              <span
                className={styles.legendDot}
                style={{ background: colors[i % colors.length] }}
              />
              <span className={styles.legendName}>{item.name}</span>
              <span className={styles.legendValue}>{item[dataKey]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
