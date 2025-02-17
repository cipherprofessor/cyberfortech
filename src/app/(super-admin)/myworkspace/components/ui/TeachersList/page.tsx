'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';
import TeachersListSkeleton from './TableSkeleton';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
import TeachersList from './TeachersList';
import { TeacherDisplay, Teacher } from './types';


// Map subject names to colors
const subjectColors: Record<string, string> = {
  'Full Stack Development': '#818cf8',
  'English': '#a78bfa',
  'Physics': '#ef4444',
  'Mathematics': '#10b981',
  'Chemistry': '#f59e0b',
  'Biology': '#3b82f6'
};

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<TeacherDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDisplay | null>(null);
  const [modalState, setModalState] = useState({
    view: false,
    edit: false,
    delete: false
  });

  const transformTeacher = (teacher: Teacher): TeacherDisplay => ({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    avatar: teacher.profile_image_url || '/placeholders/teacher-avatar.png',
    qualification: teacher.qualification,
    subject: {
      name: teacher.specialization,
      color: subjectColors[teacher.specialization] || '#6b7280'
    }
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/instructors?page=${currentPage}&search=${searchTerm}&limit=5`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setTeachers(data.instructors.map(transformTeacher));
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch teachers');
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, searchTerm]);

  const handleEditTeacher = async (teacherDisplay: TeacherDisplay) => {
    try {
      const response = await fetch(`/api/instructors/${teacherDisplay.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teacherDisplay.name,
          email: teacherDisplay.email,
          qualification: teacherDisplay.qualification,
          specialization: teacherDisplay.subject.name
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('Teacher updated successfully');
      fetchTeachers();
      setModalState(prev => ({ ...prev, edit: false }));
    } catch (error) {
      toast.error('Failed to update teacher');
      console.error('Error updating teacher:', error);
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/instructors/${teacherId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('Teacher deleted successfully');
      fetchTeachers();
      setModalState(prev => ({ ...prev, delete: false }));
    } catch (error) {
      toast.error('Failed to delete teacher');
      console.error('Error deleting teacher:', error);
    }
  };

  if (loading) {
    return <TeachersListSkeleton />;
  }

  return (
    <>
      <TeachersList
        data={teachers}
        title="Teachers List"
        onViewAll={() => setCurrentPage(1)}
        itemsPerPage={5}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        onTeacherClick={(teacher) => {
          setSelectedTeacher(teacher);
          setModalState(prev => ({ ...prev, view: true }));
        }}
        onEdit={(teacher) => {
          setSelectedTeacher(teacher);
          setModalState(prev => ({ ...prev, edit: true }));
        }}
        onDelete={(teacher) => {
          setSelectedTeacher(teacher);
          setModalState(prev => ({ ...prev, delete: true }));
        }}
      />

      {selectedTeacher && (
        <>
          <ViewTeacherModal
            isOpen={modalState.view}
            onClose={() => setModalState(prev => ({ ...prev, view: false }))}
            teacher={selectedTeacher}
          />

          <EditTeacherModal
            isOpen={modalState.edit}
            onClose={() => setModalState(prev => ({ ...prev, edit: false }))}
            teacher={selectedTeacher}
            onSave={handleEditTeacher}
          />

          <DeleteTeacherModal
            isOpen={modalState.delete}
            onClose={() => setModalState(prev => ({ ...prev, delete: false }))}
            teacher={selectedTeacher}
            onConfirm={() => handleDeleteTeacher(selectedTeacher.id)}
          />
        </>
      )}
    </>
  );
};

export default TeachersPage;