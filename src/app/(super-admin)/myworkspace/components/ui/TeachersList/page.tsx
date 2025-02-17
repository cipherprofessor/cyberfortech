'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';
import TeachersListSkeleton from './TableSkeleton';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
import TeachersList from './TeachersList';
import { TeacherDisplay, Teacher, TeacherAPI } from './types';
import { Plus } from 'lucide-react';
import CreateTeacherModal from './CreateTeacherModal';


// Map subject names to colors
export const subjectColors: Record<string, string> = {
    'Full Stack Development': '#818cf8',
    'English': '#a78bfa',
    'Physics': '#ef4444',
    'Mathematics': '#10b981',
    'Chemistry': '#f59e0b',
    'Biology': '#3b82f6'
  };

const TeachersPage = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [modalState, setModalState] = useState({
        view: false,
        edit: false,
        delete: false
    });

    const transformTeacher = (apiTeacher: TeacherAPI): Teacher => ({
        id: apiTeacher.id,
        name: apiTeacher.name,
        email: apiTeacher.email,
        avatar: apiTeacher.profile_image_url || '/placeholders/teacher-avatar.png',
        qualification: apiTeacher.qualification,
        subject: {
            name: apiTeacher.specialization,
            color: subjectColors[apiTeacher.specialization] || '#6b7280'
        }
    });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/instructors?page=${currentPage}&search=${searchTerm}&limit=5`
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

  const handleEditTeacher = async (teacher: Teacher) => {
    try {
      const response = await fetch(`/api/users/instructors/${teacher.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teacher.name,
          email: teacher.email,
          qualification: teacher.qualification,
          specialization: teacher.subject.name
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
      const response = await fetch(`/api/users/instructors/${teacherId}`, {
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


  const handleCreateTeacher = async (data: any) => {
    try {
      const response = await fetch('/api/users/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to create teacher');

      toast.success('Teacher created successfully');
      fetchTeachers();
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create teacher');
      console.error('Error creating teacher:', error);
    }
  };

  if (loading) {
    return <TeachersListSkeleton />;
  }

  return (
     <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>
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
      
        <CreateTeacherModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTeacher}
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
  </div>
  );
};

export default TeachersPage;