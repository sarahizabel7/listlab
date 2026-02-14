import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAppStore } from '@/store/app-store';

const COLORS: Record<string, { active: string; inactive: string }> = {
  Pagination: { active: '#6366f1', inactive: '#e2e8f0' },
  'Infinite Scroll': { active: '#8b5cf6', inactive: '#e2e8f0' },
  Virtualization: { active: '#06b6d4', inactive: '#e2e8f0' },
  'Inf. + Virtual': { active: '#f59e0b', inactive: '#e2e8f0' },
};

export function ComparisonChart() {
  const metrics = useAppStore((s) => s.metrics);

  const data = [
    {
      name: 'Pagination',
      domNodes: metrics.pagination.domNodeCount,
      measured: metrics.pagination.domNodeCount > 0 || metrics.pagination.itemsLoaded > 0,
    },
    {
      name: 'Infinite Scroll',
      domNodes: metrics.infinite.domNodeCount,
      measured: metrics.infinite.domNodeCount > 0 || metrics.infinite.itemsLoaded > 0,
    },
    {
      name: 'Virtualization',
      domNodes: metrics.virtual.domNodeCount,
      measured: metrics.virtual.domNodeCount > 0 || metrics.virtual.itemsLoaded > 0,
    },
    {
      name: 'Inf. + Virtual',
      domNodes: metrics.hybrid.domNodeCount,
      measured: metrics.hybrid.domNodeCount > 0 || metrics.hybrid.itemsLoaded > 0,
    },
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(_value, _name, props) => {
              const entry = props?.payload as { measured?: boolean; domNodes?: number } | undefined;
              return entry?.measured ? [entry.domNodes ?? 0, 'DOM Nodes'] : ['Not measured', 'DOM Nodes'];
            }}
          />
          <Bar dataKey="domNodes" name="DOM Nodes" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={
                  entry.measured
                    ? COLORS[entry.name].active
                    : COLORS[entry.name].inactive
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
