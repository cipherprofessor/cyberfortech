'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TeachersListSkeleton from './TableSkeleton';
import { ViewTeacherModal, EditTeacherModal, DeleteTeacherModal } from './TeacherModals';
import TeachersList from './TeachersList';
import { Teacher, TeacherAPI, TeacherFormData } from './types';
import TeacherForm from './TeacherForm';

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
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modalState, setModalState] = useState({
    view: false,
    edit: false,
    delete: false
  });

  // Transform API response to our Teacher type
  const transformApiResponse = (apiTeacher: TeacherAPI): Teacher => ({
    id: apiTeacher.id,
    name: apiTeacher.name,
    email: apiTeacher.email,
    avatar: apiTeacher.profile_image_url || '/placeholders/teacher-avatar.png',
    bio: apiTeacher.bio || '',
    contact_number: apiTeacher.contact_number || '',
    address: apiTeacher.address || '',
    qualification: apiTeacher.qualification || '',
    subject: {
      name: apiTeacher.specialization || '',
      color: apiTeacher.specialization ? subjectColors[apiTeacher.specialization] : '#1b64f5'
    },
    specialization: apiTeacher.specialization || '',
    rating: apiTeacher.rating || 0,
    total_courses: apiTeacher.total_courses || 0,
    total_students: apiTeacher.total_students || 0,
    years_of_experience: apiTeacher.years_of_experience || 0,
    social_links: apiTeacher.social_links || '{}',
    status: apiTeacher.status || 'active',
    created_at: apiTeacher.created_at,
    updated_at: apiTeacher.updated_at
  });

  const transformTeacherToFormData = (teacher: Teacher | null): TeacherFormData => {
    if (!teacher) {
      return {
        name: '',
        email: '',
        bio: '',
        contact_number: '',
        address: '',
        profile_image_url: '',
        specialization: '',
        qualification: '',
        years_of_experience: 0,
        social_links: {},
        status: 'active'
      };
    }

    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      bio: teacher.bio,
      contact_number: teacher.contact_number,
      address: teacher.address,
      profile_image_url: teacher.avatar,
      specialization: teacher.subject.name,
      qualification: teacher.qualification,
      years_of_experience: teacher.years_of_experience,
      social_links: typeof teacher.social_links === 'string' 
        ? JSON.parse(teacher.social_links) 
        : teacher.social_links,
      status: teacher.status
    };
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/instructors?page=${currentPage}&search=${searchTerm}&limit=5`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setTeachers(data.instructors.map(transformApiResponse));
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

  const handleEditTeacher = async (data: TeacherFormData) => {
    try {
      const response = await fetch(`/api/users/instructors/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          bio: data.bio || null,
          contact_number: data.contact_number || null,
          address: data.address || null,
          profile_image_url: data.profile_image_url || null,
          specialization: data.specialization || null,
          qualification: data.qualification || null,
          years_of_experience: data.years_of_experience || null,
          social_links: data.social_links || null,
          status: data.status
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update teacher');
      }

      await fetchTeachers();
      setShowForm(false);
      toast.success('Teacher updated successfully');
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update teacher');
      throw error;
    }
  };

  const handleCreateTeacher = async (data: TeacherFormData) => {
    try {
      const response = await fetch('/api/users/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          bio: data.bio || null,
          contact_number: data.contact_number || null,
          address: data.address || null,
          profile_image_url: data.profile_image_url || null,
          specialization: data.specialization || null,
          qualification: data.qualification || null,
          years_of_experience: data.years_of_experience || null,
          social_links: data.social_links || null,
          status: data.status
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create teacher');
      }

      await fetchTeachers();
      setShowForm(false);
      toast.success('Teacher created successfully');
    } catch (error) {
      console.error('Error creating teacher:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create teacher');
      throw error;
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

  if (loading) {
    return <TeachersListSkeleton />;
  }

  return (
    <div className="p-4">
      <TeachersList
        data={teachers}
        title="Instructors List"
        itemsPerPage={5}
        onViewAll={() => {
          setCurrentPage(1);
          setSearchTerm('');
        }}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(term) => setSearchTerm(term)}
        onCreateClick={() => {
          setFormMode('create');
          setSelectedTeacher(null);
          setShowForm(true);
        }}
        onEdit={(teacher: Teacher) => {
          setFormMode('edit');
          setSelectedTeacher(teacher);
          setShowForm(true);
        }}
        onDelete={(teacher: Teacher) => {
          setSelectedTeacher(teacher);
          setModalState(prev => ({ ...prev, delete: true }));
        }}
      />

      {showForm && (
        <TeacherForm
          mode={formMode}
          initialData={transformTeacherToFormData(selectedTeacher)}
          onSubmit={formMode === 'create' ? handleCreateTeacher : handleEditTeacher}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedTeacher && (
        <>
          <ViewTeacherModal
            isOpen={modalState.view}
            onClose={() => setModalState(prev => ({ ...prev, view: false }))}
            teacher={selectedTeacher}
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