import { chartAnimations } from '../utils/animations';
import { formatters } from '../utils/formatters';

// Using animations
<motion.div {...chartAnimations.container}>
  <motion.span {...chartAnimations.fade}>
    {/* Your content */}
  </motion.span>
</motion.div>

// Using formatters
const value = 1234567.89;
console.log(formatters.currency(value)); // "$1,234,567.89"
console.log(formatters.compact(value));  // "1.2M"
console.log(formatters.growth(12.34));   // "+12.34%"



import { LineChart, themes, ChartSeries } from '@/components/charts';

// Using with TypeScript
const series: ChartSeries[] = [
  {
    type: 'line',
    dataKey: 'value',
    name: 'Sales',
    color: themes.light.colors[0]
  }
];

// Using in component
<LineChart
  data={data}
  series={series}
  theme="dark"
  dimensions={{ height: 400 }}
  legend={{ show: true, position: 'bottom' }}
/>