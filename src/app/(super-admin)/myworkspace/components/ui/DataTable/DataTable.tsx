import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, Pencil, Trash2, ChevronDown } from 'lucide-react';
import styles from './DataTable.module.scss';

export type SortDirection = 'asc' | 'desc' | null;
export type DataType = 'text' | 'number' | 'date' | 'status' | 'actions';

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  type?: DataType;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  showSearch?: boolean;
  showColumnToggle?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  onEdit?: (item: T) => void;
  onDelete?: (items: T[]) => void;
  className?: string;
  searchPlaceholder?: string;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns: defaultColumns,
  title = "Recent Orders",
  showSearch = true,
  showColumnToggle = true,
  selectable = true,
  onSelectionChange,
  onEdit,
  onDelete,
  className = "",
  searchPlaceholder = "Search orders..."
}: TableProps<T>) {
  const [columns, setColumns] = useState(defaultColumns);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | 'actions';
    direction: SortDirection;
  }>({ key: 'id', direction: null });

  const visibleColumns = columns.filter(col => col.visible !== false);

  const handleSort = (key: keyof T | 'actions') => {
    if (!columns.find(col => col.key === key)?.sortable) return;

    setSortConfig(current => ({
      key,
      direction: 
        current.key === key 
          ? current.direction === 'asc' 
            ? 'desc' 
            : current.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? filteredData : [];
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedItems, item]
      : selectedItems.filter(i => i.id !== item.id);
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item =>
      Object.entries(item).some(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(v => 
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = sortConfig.key === 'actions' ? '' : a[sortConfig.key];
      const bValue = sortConfig.key === 'actions' ? '' : b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      return ((aValue < bValue ? -1 : 1) * modifier);
    });
  }, [filteredData, sortConfig]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.controls}>
          {showSearch && (
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}

          {showColumnToggle && (
            <button className={styles.columnToggleButton}>
              Columns
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {selectable && (
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedItems.length === filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {visibleColumns.map(column => (
                <th
                  key={String(column.key)}
                  onClick={() => handleSort(column.key)}
                  className={styles.headerCell}
                  style={{ width: column.width }}
                >
                  {column.label}
                  {column.sortable && (
                    <ArrowUpDown
                      size={14}
                      className={`${styles.sortIcon} ${
                        sortConfig.key === column.key ? 
                          sortConfig.direction === 'asc' ? styles.ascending :
                          sortConfig.direction === 'desc' ? styles.descending : ''
                        : ''
                      }`}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map(item => (
              <tr key={item.id} className={styles.tableRow}>
                {selectable && (
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedItems.some(i => i.id === item.id)}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                    />
                  </td>
                )}
                {visibleColumns.map(column => (
                  <td key={String(column.key)} className={styles.tableCell}>
                    {column.key === 'actions' ? (
                      <div className={styles.actions}>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete([item])}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ) : column.render ? (
                      column.render(item[column.key], item)
                    ) : (
                      String(item[column.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;