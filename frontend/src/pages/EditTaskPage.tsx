import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetTaskQuery, useUpdateTaskMutation, useGetUsersQuery } from '../store/slices/tasksApi';
import type { UpdateTaskInput } from '../store/slices/tasksApi';

export const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: taskResponse, isLoading: isLoadingTask, error: fetchError } = useGetTaskQuery(Number(id), {
    skip: !id,
  });
  
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery();

  const task = taskResponse?.data;
  const users = usersResponse?.data || [];

  const [formData, setFormData] = useState<UpdateTaskInput>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assigneeId: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when task loads
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assigneeId: task.assigneeId || undefined,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (formData.title && !formData.title.trim()) {
      setErrors({ title: 'Title cannot be empty' });
      return;
    }

    if (formData.title && formData.title.length > 100) {
      setErrors({ title: 'Title must be less than 100 characters' });
      return;
    }

    try {
      await updateTask({ id: Number(id), updates: formData }).unwrap();
      navigate('/tasks');
    } catch (err: any) {
      if (err?.data?.errors) {
        // Zod validation errors from backend
        const backendErrors: Record<string, string> = {};
        err.data.errors.forEach((error: any) => {
          backendErrors[error.path[0]] = error.message;
        });
        setErrors(backendErrors);
      } else {
        alert(err?.data?.message || 'Failed to update task');
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Error loading task</h3>
          <p className="text-sm">{(fetchError as any)?.data?.message || 'Task not found'}</p>
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

  if (isLoadingTask) {
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
          <p className="text-gray-600 mb-4">Task not found</p>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
          <p className="text-sm text-gray-600 mt-1">Update the task details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-4 py-2.5 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter task title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              <p className="mt-1 text-xs text-gray-500">{formData.title?.length || 0}/100 characters</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter task description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            {/* Assign To */}
            <div>
              <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <select
                id="assigneeId"
                name="assigneeId"
                value={formData.assigneeId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    assigneeId: value ? parseInt(value) : null,
                  }));
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoadingUsers}
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {isLoadingUsers && (
                <p className="mt-1 text-xs text-gray-500">Loading users...</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Task Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created by:</span>
                  <p className="font-medium text-gray-900">{task.creator.name}</p>
                </div>
                {task.assignee && (
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <p className="font-medium text-gray-900">{task.assignee.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isUpdating ? (
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
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
