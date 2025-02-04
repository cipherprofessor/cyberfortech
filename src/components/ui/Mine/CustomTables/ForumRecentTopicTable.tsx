'use client';
// src/components/ui/Mine/CustomTables/ForumRecentTopicTable.tsx
import React from "react";
import { Key } from "@react-types/shared";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  SortDescriptor,
  Chip,
} from "@heroui/react";
import { useUser } from '@clerk/nextjs';
import { MessageSquare, ChevronDown } from 'lucide-react';
import { SearchIcon, VerticalDotsIcon } from "./TableIcons";
import { isAdmin } from '@/utils';
import { TopicData } from '@/types/forum';

// Column definitions
export const columns = [
  { name: "TOPIC", uid: "title", sortable: true },
  { name: "CATEGORY", uid: "category_name", sortable: true },
  { name: "AUTHOR", uid: "author", sortable: true },
  { name: "REPLIES", uid: "replies_count", sortable: true },
  { name: "CREATED", uid: "createdAt", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, "warning" | "danger" | "success"> = {
  pinned: "warning",
  locked: "danger",
  active: "success",
};

const INITIAL_VISIBLE_COLUMNS = ["title", "category_name", "author", "replies_count", "createdAt", "status", "actions"];

type DropdownItemColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface MenuItem {
  key: string;
  label: string;
  className?: string;
  color?: DropdownItemColor;
  onClick?: () => void;
}


interface ForumRecentTopicTableProps {
  topics: TopicData[];
  onDelete: (id: number) => void;
  loading?: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

export default function ForumRecentTopicTable({
  topics,
  onDelete,
  loading = false,
  pagination,
  onPageChange
}: ForumRecentTopicTableProps) {
  const { user } = useUser();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<"all" | Set<Key>>(new Set<Key>());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });

  // Helper function to get user's display name
  const getClerkAuthUserFullNameOrUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.id || 'Unknown User';
  };

  // Add role check
  const userIsAdmin = isAdmin(user?.publicMetadata?.role as string);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.size === columns.length) return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...topics];
    if (hasSearchFilter) {
      filtered = filtered.filter((topic) =>
        topic.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filtered;
  }, [topics, filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const columnKey = sortDescriptor.column as keyof TopicData;
      let first = a[columnKey];
      let second = b[columnKey];

      // Handle potentially undefined values
      if (first === undefined) first = '';
      if (second === undefined) second = '';

      // Convert to strings for comparison
      const firstStr = String(first);
      const secondStr = String(second);

      const cmp = firstStr < secondStr ? -1 : firstStr > secondStr ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = React.useCallback((topic: TopicData, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-default-400" />
            <span>{topic.title}</span>
          </div>
        );
      case "category_name":
        return <span>{topic.category_name}</span>;
      case "author":
        return topic.authorId === user?.id ?
          getClerkAuthUserFullNameOrUserName() :
          (topic.authorName || 'Unknown User');
      case "replies_count":
        return <span>{topic.replies_count || 0}</span>;
      case "createdAt":
        return new Date(topic.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      case "status":
        const status = topic.is_pinned ? 'pinned' : topic.is_locked ? 'locked' : 'active';
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[status] || "default"}
            size="sm"
            variant="flat"
          >
            {status}
          </Chip>
        );
        case "actions": {
            const menuItems: MenuItem[] = [
              { 
                key: 'view', 
                label: 'View' 
              } as MenuItem,
              ...(userIsAdmin || topic.authorId === user?.id
                ? [
                    { 
                      key: 'edit', 
                      label: 'Edit' 
                    } as MenuItem,
                    {
                      key: 'delete',
                      label: 'Delete',
                      className: 'text-danger',
                      color: 'danger' as DropdownItemColor,
                      onClick: () => onDelete(topic.id)
                    } as MenuItem
                  ]
                : [])
            ];

        return (
            <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {menuItems.map(item => (
                  <DropdownItem
                    key={item.key}
                    className={item.className}
                    color={item.color}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      }
      default:
        return null;
    }
  }, [user, userIsAdmin, getClerkAuthUserFullNameOrUserName, onDelete]);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      onPageChange(1);
    } else {
      setFilterValue("");
    }
  }, [onPageChange]);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    onPageChange(1);
  }, [onPageChange]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search By Topic..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {pagination.total} Topics
          </span>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, pagination.total, onSearchChange, onClear]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page}
          total={pagination.pages}
          onChange={onPageChange}
        />
      </div>
    );
  }, [pagination, onPageChange]);

  return (
    <Table
      isHeaderSticky
      aria-label="Forum topics table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[582px]",
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys) => setSelectedKeys(keys as "all" | Set<Key>)}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No topics found"}
        items={sortedItems}
        isLoading={loading}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey.toString())}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}