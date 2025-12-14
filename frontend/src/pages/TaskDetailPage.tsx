import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTaskQuery, useDeleteTaskMutation } from '../store/slices/tasksApi';
import type { Task } from '../store/slices/tasksApi';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: taskResponse, isLoading, error } = useGetTaskQuery(Number(id), {
    skip: !id,
  });
  
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const task = taskResponse?.data;

  const handleDelete = async () => {
    try {
      await deleteTask(Number(id)).unwrap();
      navigate('/tasks');
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete task');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';
  };

  const statusConfig = {
    TODO: { label: 'To Do', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    REVIEW: { label: 'Review', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300' },
  };

  const priorityConfig = {
    LOW: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-300' },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Error loading task</h3>
          <p className="text-sm">{(error as any)?.data?.message || 'Task not found'}</p>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/tasks')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig[task.status].color}`}>
                  {statusConfig[task.status].label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig[task.priority].color}`}>
                  {priorityConfig[task.priority].label}
                </span>
                {isOverdue(task) && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate(`/tasks/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {task.description || 'No description provided'}
          </p>
        </div>

        {/* Task Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Due Date</div>
              <div className="text-gray-900 font-medium">
                <svg className="w-4 h-4 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(task.dueDate)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Created By</div>
              <div className="text-gray-900 font-medium">
                <svg className="w-4 h-4 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {task.creator.name}
                <span className="text-gray-500 text-sm ml-1">({task.creator.email})</span>
              </div>
            </div>

            {task.assignee && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Assigned To</div>
                <div className="text-gray-900 font-medium">
                  <svg className="w-4 h-4 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {task.assignee.name}
                  <span className="text-gray-500 text-sm ml-1">({task.assignee.email})</span>
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-600 mb-1">Created</div>
              <div className="text-gray-900 font-medium">
                <svg className="w-4 h-4 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatShortDate(task.createdAt)}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Last Updated</div>
              <div className="text-gray-900 font-medium">
                <svg className="w-4 h-4 inline mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatShortDate(task.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
