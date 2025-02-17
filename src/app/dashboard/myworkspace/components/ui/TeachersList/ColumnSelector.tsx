//src/app/dashboard/myworkspace/components/ui/TeachersList/components/ColumnSelector.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import styles from './TeachersList.module.scss';
import { getColumnIcon } from './TableComponents';
import { AVAILABLE_COLUMNS } from './constants';


interface ColumnSelectorProps {
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
  showSelector: boolean;
  onToggleSelector: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  selectedColumns,
  onColumnToggle,
  showSelector,
  onToggleSelector
}) => {
  return (
    <div className={styles.columnSelector}>
      <button 
        onClick={onToggleSelector}
        className={styles.columnSelectorButton}
      >
        <Settings size={16} />
        Customize Columns
      </button>
      
      {showSelector && (
        <div className={styles.columnDropdown}>
          {Object.entries(AVAILABLE_COLUMNS).map(([key, config]) => {
            const Icon = getColumnIcon(key);
            return (
              <label key={key} className={styles.columnOption}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(key)}
                  onChange={() => onColumnToggle(key)}
                />
                <Icon size={16} />
                {config.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;