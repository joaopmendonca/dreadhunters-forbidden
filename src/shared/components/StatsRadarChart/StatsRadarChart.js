import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * Gráfico Radar para visualizar distribuição de stats
 * Estilo inspirado em Pokémon stats
 * 
 * @param {Object} statsDistribution - Objeto com os valores dos stats { nome: valor }
 * @param {Array} baseStatus - Array de status base com { nome, label, icone }
 * @param {boolean} isPercentage - Se true, usa 100 como max. Se false, calcula max baseado nos valores
 * @param {number} height - Altura do gráfico em pixels
 * @param {string} color - Cor principal do gráfico (default: gold)
 */
export default function StatsRadarChart({ 
  statsDistribution = {}, 
  baseStatus = [],
  isPercentage = true,
  height = 280,
  color = '#d4af37'
}) {
  // Validação: se não há stats, não renderiza o gráfico
  if (!baseStatus || baseStatus.length === 0) {
    return null;
  }

  // Preparar valores dos stats
  const values = baseStatus.map(stat => statsDistribution[stat.nome] || 0);
  
  // Calcular escala máxima
  let maxScale;
  if (isPercentage) {
    maxScale = 100;
  } else {
    const maxValue = Math.max(...values, 10);
    maxScale = Math.ceil(maxValue / 10) * 10; // Arredonda para múltiplos de 10
  }
  
  // Preparar dados para o gráfico radar
  const indicator = baseStatus.map(stat => ({
    name: stat.label || stat.nome,
    max: maxScale,
    icon: stat.icone
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const items = params.value.map((val, idx) => {
          const stat = baseStatus[idx];
          const suffix = isPercentage ? '%' : '';
          return `${stat.icone || '•'} ${stat.label || stat.nome}: <strong>${val}${suffix}</strong>`;
        }).join('<br/>');
        return `<div style="padding: 8px;">${items}</div>`;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: color,
      borderWidth: 1,
      textStyle: {
        color: '#e8e8e8',
        fontSize: 12
      }
    },
    radar: {
      indicator: indicator,
      shape: 'polygon',
      radius: '60%',
      splitNumber: 5,
      center: ['50%', '50%'],
      name: {
        textStyle: {
          color: color,
          fontSize: 11,
          fontWeight: 600
        },
        formatter: (value) => {
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
        name: 'Stats',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: {
          color: color,
          borderColor: '#fff',
          borderWidth: 1
        },
        lineStyle: {
          color: color,
          width: 2
        },
        areaStyle: {
          color: color.replace(')', ', 0.25)').replace('rgb', 'rgba').replace('#', 'rgba(') || 'rgba(212, 175, 55, 0.25)'
        },
        data: [
          {
            value: values,
            name: 'Stats'
          }
        ],
        emphasis: {
          lineStyle: {
            width: 3
          },
          itemStyle: {
            shadowBlur: 8,
            shadowColor: color
          }
        }
      }
    ]
  };

  // Calcular areaStyle color corretamente
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    option.series[0].areaStyle.color = `rgba(${r}, ${g}, ${b}, 0.25)`;
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
