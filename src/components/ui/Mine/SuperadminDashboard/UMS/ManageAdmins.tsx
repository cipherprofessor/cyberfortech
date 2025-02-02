'use client';


import React, { useState } from 'react';
import { DonutChart } from '@/components/charts/base/DonutChart';
import {
  IconUserCog,
  IconShieldCheck,
  IconHistory,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconLock,
  IconMail,
  IconRefresh,
  IconCheckbox,
  IconFilter,
  IconDownload,
  IconX
} from '@tabler/icons-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'courses' | 'content' | 'settings';
}

interface AdminActivity {
  id: string;
  adminId: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastActive: string;
  status: 'active' | 'inactive';
  activityCount: number;
  createdAt: string;
}

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Admin>) => void;
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin;
  permissions: Permission[];
  onSave: (adminId: string, permissions: string[]) => void;
}

// CreateAdminModal Component
const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<Admin>>({
    name: '',
    email: '',
    role: 'admin',
    permissions: []
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Admin['role'] })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 rounded-lg"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PermissionsModal Component
const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  admin,
  permissions,
  onSave
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(admin.permissions);

  if (!isOpen) return null;

  const permissionCategories = {
    users: permissions.filter(p => p.category === 'users'),
    courses: permissions.filter(p => p.category === 'courses'),
    content: permissions.filter(p => p.category === 'content'),
    settings: permissions.filter(p => p.category === 'settings')
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Permissions - {admin.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(permissionCategories).map(([category, perms]) => (
            <div key={category}>
              <h4 className="text-md font-medium mb-2 capitalize">{category}</h4>
              <div className="space-y-2">
                {perms.map((permission) => (
                  <label key={permission.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission.id]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter(id => id !== permission.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium">{permission.name}</p>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(admin.id, selectedPermissions);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
              hover:bg-blue-700 rounded-lg"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageAdmins: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Sample data
  const permissions: Permission[] = [
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Create, edit, and delete user accounts',
      category: 'users'
    },
    {
      id: 'manage_courses',
      name: 'Manage Courses',
      description: 'Create, edit, and delete courses',
      category: 'courses'
    },
    // Add more permissions...
  ];

  const admins: Admin[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'super_admin',
      permissions: ['manage_users', 'manage_courses'],
      lastActive: '2024-01-25T10:30:00',
      status: 'active',
      activityCount: 156,
      createdAt: '2023-12-01'
    },
    // Add more admins...
  ];

  const recentActivity: AdminActivity[] = [
    {
      id: '1',
      adminId: '1',
      action: 'updated',
      target: 'course',
      timestamp: '2024-01-25T10:30:00',
      details: 'Updated Python Course content'
    },
    // Add more activities...
  ];

  // Filter admins based on search and role
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = (
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesRole = selectedRole === 'all' || admin.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Activity metrics
  const activityMetrics = [
    {
      title: 'Total Admins',
      value: admins.length,
      change: +15.5,
      icon: <IconUserCog className="h-6 w-6" />,
      color: '#3B82F6'
    },
    {
      title: 'Active Today',
      value: admins.filter(a => new Date(a.lastActive).toDateString() === new Date().toDateString()).length,
      change: +8.2,
      icon: <IconHistory className="h-6 w-6" />,
      color: '#10B981'
    },
    {
      title: 'Permission Changes',
      value: recentActivity.filter(a => a.action === 'permission_change').length,
      change: -2.4,
      icon: <IconShieldCheck className="h-6 w-6" />,
      color: '#F59E0B'
    }
  ];

  // Role distribution data
  const roleDistribution = [
    {
      name: 'Super Admins',
      value: admins.filter(a => a.role === 'super_admin').length,
      color: '#3B82F6'
    },
    {
      name: 'Admins',
      value: admins.filter(a => a.role === 'admin').length,
      color: '#10B981'
    },
    {
      name: 'Moderators',
      value: admins.filter(a => a.role === 'moderator').length,
      color: '#F59E0B'
    }
  ];

  // Handlers
  const handleCreateAdmin = (data: Partial<Admin>) => {
    // Implement create admin logic
    // console.log('Creating admin:', data);
  };

  const handleUpdatePermissions = (adminId: string, permissions: string[]) => {
    // Implement permission update logic
    // console.log('Updating permissions:', { adminId, permissions });
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activityMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                <div className={`flex items-center mt-2 ${
                  metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="text-sm font-medium">
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${metric.color}20` }}
              >
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Admin Role Distribution</h3>
          <div className="h-[300px]">
            <DonutChart
              data={roleDistribution}
              height={300}
              centerText={{
                primary: admins.length.toString(),
                secondary: 'Total Admins'
              }}
            />
         

</div>
</div>

{/* Recent Activity */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
  <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
  <div className="space-y-4 max-h-[300px] overflow-y-auto">
    {recentActivity.map((activity) => {
      const admin = admins.find(a => a.id === activity.adminId);
      return (
        <div 
          key={activity.id}
          className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              {admin?.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {admin?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activity.details}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>
</div>

{/* Admin Management Section */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
<div className="p-6 border-b border-gray-200 dark:border-gray-700">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Search and Filters */}
    <div className="flex flex-1 items-center gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search admins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Roles</option>
        <option value="super_admin">Super Admin</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
      </select>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowCreateModal(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <IconPlus className="h-4 w-4 mr-2" />
        Add Admin
      </button>
      <button
        onClick={() => {/* Implement export */}}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
          dark:hover:bg-gray-700 rounded-lg"
      >
        <IconDownload className="h-5 w-5" />
      </button>
      <button
        onClick={() => {/* Implement refresh */}}
        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 
          dark:hover:bg-gray-700 rounded-lg"
      >
        <IconRefresh className="h-5 w-5" />
      </button>
    </div>
  </div>
</div>

{/* Admin Table */}
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 dark:bg-gray-900">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Admin
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Role
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Last Active
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Activity
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Permissions
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {filteredAdmins.map((admin) => (
        <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 
                  flex items-center justify-center text-blue-600 dark:text-blue-200 font-medium">
                  {admin.name.charAt(0)}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {admin.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {admin.email}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${admin.role === 'super_admin' 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : admin.role === 'admin'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}
            >
              {admin.role.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${admin.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {new Date(admin.lastActive).toLocaleString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {admin.activityCount} actions
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => {
                setSelectedAdmin(admin);
                setShowPermissionsModal(true);
              }}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 
                dark:text-blue-400 dark:hover:text-blue-300"
            >
              <IconLock className="h-4 w-4 mr-1" />
              Manage Permissions
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {/* Implement edit */}}
                className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                  dark:hover:text-gray-300"
              >
                <IconEdit className="h-4 w-4" />
              </button>
              <button
                onClick={() => {/* Implement email */}}
                className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 
                  dark:hover:text-gray-300"
              >
                <IconMail className="h-4 w-4" />
              </button>
              <button
                onClick={() => {/* Implement delete */}}
                className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 
                  dark:hover:text-red-300"
              >
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Empty State */}
  {filteredAdmins.length === 0 && (
    <div className="text-center py-12">
      <IconUserCog className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        No admins found
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        No admins match your search criteria.
      </p>
    </div>
  )}
</div>

{/* Pagination */}
<div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
  <div className="flex items-center justify-between">
    <div className="text-sm text-gray-500 dark:text-gray-400">
      Showing {filteredAdmins.length} of {admins.length} admins
    </div>
    <div className="flex items-center space-x-2">
      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
        font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
        Previous
      </button>
      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
        font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
        Next
      </button>
    </div>
  </div>
</div>
</div>

{/* Modals */}
<CreateAdminModal 
isOpen={showCreateModal}
onClose={() => setShowCreateModal(false)}
onSubmit={handleCreateAdmin}
/>

{selectedAdmin && (
<PermissionsModal
  isOpen={showPermissionsModal}
  onClose={() => {
    setShowPermissionsModal(false);
    setSelectedAdmin(null);
  }}
  admin={selectedAdmin}
  permissions={permissions}
  onSave={handleUpdatePermissions}
/>
)}
</div>
);
};

export default ManageAdmins;