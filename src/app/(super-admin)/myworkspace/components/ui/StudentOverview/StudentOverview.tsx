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
        <div className={styles.tooltipHeader}>
          <div 
            className={styles.tooltipColor} 
            style={{ backgroundColor: data.color }} 
          />
          <span>{data.name}</span>
        </div>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipRow}>
            <span>Students:</span>
            <span>{data.value.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>Percentage:</span>
            <span>{((data.value / data.total) * 100).toFixed(1)}%</span>
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
    week: 'This Week',
    month: 'This Month',
    year: 'This Year'
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

  const formatChange = (change: number) => (
    <span className={`${styles.change} ${change >= 0 ? styles.positive : styles.negative}`}>
      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
    </span>
  );

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
        {/* <div className={styles.chartSection}> */}
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
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
                position={{ y: 0 }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.totalCount}>
            <div className={styles.totalLabel}>Total</div>
            <motion.div 
              key={total}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.totalValue}
            >
              {total.toLocaleString()}
            </motion.div>
          </div>
        {/* </div> */}

        <div className={styles.statsSection}>
          {[
            { key: 'male', label: 'Male', icon: '♂', color: '#818CF8' },
            { key: 'female', label: 'Female', icon: '♀', color: '#F472B6' },
            { key: 'others', label: 'Others', icon: '⚪', color: '#A78BFA' }
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.value}
                >
                  {currentData[key as keyof GenderStats].count.toLocaleString()}
                </motion.div>
                {formatChange(currentData[key as keyof GenderStats].change)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;