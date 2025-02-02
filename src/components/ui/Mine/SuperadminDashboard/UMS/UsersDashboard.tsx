"use client";
// src/components/ui/Mine/UsersDashboard/UsersDashboard.tsx

import React, { useState, useCallback } from "react";
import {
  IconUsers,
  IconUserPlus,
  IconUserCheck,
  IconUserX,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconTrash,
  IconBan,
  IconMail,
  IconEdit,
  IconDownload,
} from "@tabler/icons-react";
import { DonutChart } from "@/components/charts/base/DonutChart";

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "banned";
  role: "student" | "admin";
  coursesEnrolled: number;
  completionRate: number;
}

const UsersDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Sample user data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2024-01-15",
      lastActive: "2024-01-25",
      status: "active",
      role: "student",
      coursesEnrolled: 5,
      completionRate: 85,
    },
    // Add more sample users...
  ];

  // Key metrics
  const metrics = [
    {
      title: "Total Users",
      value: users.length,
      change: +12.5,
      icon: <IconUsers className="h-6 w-6" />,
      color: "#3B82F6",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      change: +8.2,
      icon: <IconUserCheck className="h-6 w-6" />,
      color: "#10B981",
    },
    {
      title: "Banned Users",
      value: users.filter((u) => u.status === "banned").length,
      change: -2.4,
      icon: <IconUserX className="h-6 w-6" />,
      color: "#EF4444",
    },
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // User distribution data for charts
  const statusDistribution = [
    {
      name: "Active",
      value: users.filter((u) => u.status === "active").length,
      color: "#10B981",
    },
    {
      name: "Inactive",
      value: users.filter((u) => u.status === "inactive").length,
      color: "#F59E0B",
    },
    {
      name: "Banned",
      value: users.filter((u) => u.status === "banned").length,
      color: "#EF4444",
    },
  ];

  const roleDistribution = [
    {
      name: "Students",
      value: users.filter((u) => u.role === "student").length,
      color: "#3B82F6",
    },
    {
      name: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      color: "#8B5CF6",
    },
  ];

  // Action handlers
  const handleDeleteUsers = useCallback(() => {
    // Implement delete logic
    // console.log("Deleting users:", selectedUsers);
  }, [selectedUsers]);

  const handleBanUsers = useCallback(() => {
    // Implement ban logic
    // console.log("Banning users:", selectedUsers);
  }, [selectedUsers]);

  const handleEmailUsers = useCallback(() => {
    // Implement email logic
    // console.log("Emailing users:", selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {metric.value.toLocaleString()}
                </h3>
                <div
                  className={`flex items-center mt-2 ${
                    metric.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change}%
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

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">
            User Status Distribution
          </h3>
          <div className="h-[300px]">
            <DonutChart
              data={statusDistribution}
              height={300}
              centerText={{
                primary: users.length.toString(),
                secondary: "Total Users",
              }}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-6">User Role Distribution</h3>
          <div className="h-[300px]">
            <DonutChart
              data={roleDistribution}
              height={300}
              centerText={{
                primary: users.length.toString(),
                secondary: "Total Users",
              }}
            />
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <IconSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEmailUsers}
                disabled={selectedUsers.length === 0}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconMail className="h-5 w-5" />
              </button>
              <button
                onClick={handleBanUsers}
                disabled={selectedUsers.length === 0}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconBan className="h-5 w-5" />
              </button>
              <button
                onClick={handleDeleteUsers}
                disabled={selectedUsers.length === 0}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconTrash className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  /* Implement export */
                }}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 
                  dark:hover:bg-gray-700"
              >
                <IconDownload className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map((u) => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 
                      text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 
                        text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          // Continuation of
                          src/components/ui/Mine/UsersDashboard/UsersDashboard.tsx
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
${
  user.status === "active"
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : user.status === "banned"
    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
${
  user.role === "admin"
    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {user.coursesEnrolled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${user.completionRate}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {user.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative group">
                      <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                        <IconDotsVertical className="h-5 w-5" />
                      </button>
                      <div
                        className="hidden group-hover:block absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right 
bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <button
                          onClick={() => {
                            /* Implement edit */
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
  hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <IconEdit className="h-4 w-4 mr-2" />
                          Edit User
                        </button>
                        <button
                          onClick={() => {
                            /* Implement email */
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 
  hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <IconMail className="h-4 w-4 mr-2" />
                          Send Email
                        </button>
                        <button
                          onClick={() => {
                            /* Implement ban */
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 
  hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <IconBan className="h-4 w-4 mr-2" />
                          {user.status === "banned" ? "Unban User" : "Ban User"}
                        </button>
                        <button
                          onClick={() => {
                            /* Implement delete */
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 
  hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <IconTrash className="h-4 w-4 mr-2" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <IconUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No users match your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;
