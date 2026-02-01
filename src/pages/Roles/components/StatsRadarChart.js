import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * Gráfico Radar para visualizar distribuição de stats
 * Estilo inspirado em Pokémon stats
 */
export default function StatsRadarChart({ statsDistribution = {}, baseStatus = [] }) {
  // Calcular o maior valor entre os stats para ajustar a escala
  const values = baseStatus.map(stat => statsDistribution[stat.nome] || 0);
  const maxValue = Math.max(...values, 20); // Mínimo de 20 para evitar escala muito pequena
  
  // Arredondar para cima para múltiplos de 20 (ex: 47 -> 60, 83 -> 100)
  const maxScale = Math.ceil(maxValue / 20) * 20;
  
  // Preparar dados para o gráfico radar
  const indicator = baseStatus.map(stat => ({
    name: stat.label || stat.nome,
    max: maxScale,
    icon: stat.icone
  }));

  const seriesData = values;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const items = params.value.map((val, idx) => {
          const stat = baseStatus[idx];
          return `${stat.icone || '•'} ${stat.label || stat.nome}: <strong>${val}%</strong>`;
        }).join('<br/>');
        return `<div style="padding: 8px;">${items}</div>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: '#d4af37',
      borderWidth: 1,
      textStyle: {
        color: '#e8e8e8',
        fontSize: 13
      }
    },
    radar: {
      indicator: indicator,
      shape: 'polygon',
      radius: '65%',
      splitNumber: 5,
      center: ['50%', '50%'],
      name: {
        textStyle: {
          color: '#d4af37',
          fontSize: 13,
          fontWeight: 600
        },
        formatter: (value, indicator) => {
          const stat = baseStatus.find(s => (s.label || s.nome) === value);
          return `${stat?.icone || ''} ${value}`;
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.15)'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            'rgba(255, 255, 255, 0.02)',
            'rgba(255, 255, 255, 0.01)'
          ]
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    },
    series: [
      {
        name: 'Distribuição de Stats',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#d4af37',
          borderColor: '#fff',
          borderWidth: 2
        },
        lineStyle: {
          color: '#d4af37',
          width: 3
        },
        areaStyle: {
          color: 'rgba(212, 175, 55, 0.25)'
        },
        data: [
          {
            value: seriesData,
            name: 'Stats %'
          }
        ],
        emphasis: {
          lineStyle: {
            width: 4
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: '#d4af37'
          }
        }
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '320px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
