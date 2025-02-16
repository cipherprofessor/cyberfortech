import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';
import styles from './StudentOverview.module.scss';

export type TimeRange = 'week' | 'month' | 'year';

export interface GenderStats {
  male: {
    count: number;
    change: number;
  };
  female: {
    count: number;
    change: number;
  };
  others: {
    count: number;
    change: number;
  };
}

interface StudentOverviewProps {
  data: {
    [key in TimeRange]: GenderStats;
  };
  title?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipRow}>
            <div 
              className={styles.tooltipColor} 
              style={{ backgroundColor: data.color }} 
            />
            <span className={styles.tooltipLabel}>{data.name}</span>
            <span>{data.value.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipPercentage}>
            {((data.value / data.total) * 100).toFixed(1)}% of total
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StudentOverview: React.FC<StudentOverviewProps> = ({
  data,
  title = "Students Overview",
  className = ""
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const timeRangeLabels: Record<TimeRange, string> = {
    week: 'Week',
    month: 'Month',
    year: 'Year'
  };

  const currentData = data[selectedRange];
  const total = currentData.male.count + currentData.female.count + currentData.others.count;

  const chartData = [
    { 
      name: 'Male', 
      value: currentData.male.count, 
      color: '#818CF8',
      total
    },
    { 
      name: 'Female', 
      value: currentData.female.count, 
      color: '#F472B6',
      total
    },
    { 
      name: 'Others', 
      value: currentData.others.count, 
      color: '#A78BFA',
      total
    }
  ];

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.dropdown}>
          <button 
            className={styles.dropdownTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {timeRangeLabels[selectedRange]}
            <ChevronDown 
              className={`${styles.chevron} ${isDropdownOpen ? styles.open : ''}`} 
              size={16}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className={styles.dropdownMenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`${styles.dropdownItem} ${
                      selectedRange === key ? styles.active : ''
                    }`}
                    onClick={() => {
                      setSelectedRange(key as TimeRange);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.content}>
      <div className={styles.chartSection}>
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={chartData}
        innerRadius={50}
        outerRadius={70}
        paddingAngle={2}
        dataKey="value"
        startAngle={90}
        endAngle={450}
        animationBegin={0}
        animationDuration={1000}
      >
        {chartData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.color}
            stroke="transparent"
          />
        ))}
      </Pie>
      <Tooltip 
        content={<CustomTooltip />}
        position={{ y: 10 }}
        cursor={false}
      />
    </PieChart>
  </ResponsiveContainer>
  
  <div className={styles.totalCount}>
    <motion.div 
      key={total}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.totalValue}
    >
      {total.toLocaleString()}
    </motion.div>
    <div className={styles.totalLabel}>Total</div>
  </div>
</div>
 

        <div className={styles.statsSection}>
          {[
            { key: 'male', label: 'Male', icon: '♂', color: '#818CF8' },
            { key: 'female', label: 'Female', icon: '♀', color: '#F472B6' },
            { key: 'others', label: 'Others', icon: '⚦', color: '#A78BFA' }
          ].map(({ key, label, icon, color }) => (
            <div key={key} className={styles.statCard}>
              <div 
                className={styles.genderIcon} 
                style={{ 
                  color, 
                  background: `${color}15` 
                }}
              >
                {icon}
              </div>
              <div className={styles.statInfo}>
                <div className={styles.label}>{label}</div>
                <motion.div 
                  key={`${key}-${currentData[key as keyof GenderStats].count}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.value}
                >
                  {currentData[key as keyof GenderStats].count.toLocaleString()}
                </motion.div>
                <motion.div 
                  className={`${styles.change} ${currentData[key as keyof GenderStats].change >= 0 ? styles.positive : styles.negative}`}
                >
                  {currentData[key as keyof GenderStats].change >= 0 ? '+' : ''}
                  {currentData[key as keyof GenderStats].change.toFixed(2)}%
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;