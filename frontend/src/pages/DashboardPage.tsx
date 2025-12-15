import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetTasksQuery } from '../store/slices/tasksApi';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { tasksApi } from '../store/slices/tasksApi';
import { getSocket } from '../lib/socket';
import type { Task } from '../store/slices/tasksApi';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const statusConfig = {
    TODO: { label: 'To Do', color: 'bg-gray-100 text-gray-700' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    REVIEW: { label: 'Review', color: 'bg-purple-100 text-purple-700' },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  };

  const priorityConfig = {
    LOW: { label: 'Low', color: 'bg-green-100 text-green-700' },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700' },
    URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block bg-white rounded-xl p-5 hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description || 'No description'}</p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            statusConfig[task.status].color
          }`}
        >
          {statusConfig[task.status].label}
        </span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            priorityConfig[task.priority].color
          }`}
        >
          {priorityConfig[task.priority].label}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center text-gray-600">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
            {task.assignee?.name?.charAt(0) || task.creator.name.charAt(0)}
          </div>
          {task.assignee?.name || task.creator.name}
        </span>
        <span className={`flex items-center font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(task.dueDate)}
        </span>
      </div>
    </Link>
  );
};

const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
      <svg
        className="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: tasksResponse, isLoading, refetch } = useGetTasksQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const socket = getSocket();
    
    if (!socket) return;

    const handleTaskUpdate = () => {
      dispatch(tasksApi.util.invalidateTags(['Task']));
      refetch();
    };

    socket.on('task:created', handleTaskUpdate);
    socket.on('task:updated', handleTaskUpdate);
    socket.on('task:deleted', handleTaskUpdate);
    socket.on('task:assigned', handleTaskUpdate);
    socket.on('task:reassigned', handleTaskUpdate);
    socket.on('task:unassigned', handleTaskUpdate);

    return () => {
      socket.off('task:created', handleTaskUpdate);
      socket.off('task:updated', handleTaskUpdate);
      socket.off('task:deleted', handleTaskUpdate);
      socket.off('task:assigned', handleTaskUpdate);
      socket.off('task:reassigned', handleTaskUpdate);
      socket.off('task:unassigned', handleTaskUpdate);
    };
  }, [dispatch, refetch]);

  const tasks = tasksResponse?.data || [];

  const [isRealTimeUpdate, setIsRealTimeUpdate] = React.useState(false);

  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      setIsRealTimeUpdate(true);
      const timer = setTimeout(() => setIsRealTimeUpdate(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [tasks, isLoading]);

  const tasksAssignedToMe = React.useMemo(
    () => tasks.filter((task) => task.assigneeId === currentUser?.id),
    [tasks, currentUser?.id]
  );
  
  const tasksCreatedByMe = React.useMemo(
    () => tasks.filter((task) => task.creatorId === currentUser?.id),
    [tasks, currentUser?.id]
  );
  
  const overdueTasks = React.useMemo(
    () => tasks.filter(
      (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
    ),
    [tasks]
  );

  const completedTasksCount = React.useMemo(
    () => tasks.filter((task) => task.status === 'COMPLETED').length,
    [tasks]
  );
  
  const inProgressTasksCount = React.useMemo(
    () => tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    [tasks]
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}, {currentUser?.name}! 👋</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <span className={`w-2 h-2 rounded-full ${isRealTimeUpdate ? 'bg-green-500 animate-ping' : 'bg-green-500'}`}></span>
                  <span className="text-xs font-medium text-green-700">Live</span>
                </div>
              </div>
              <p className="text-gray-600">Here's an overview of your tasks and productivity</p>
            </div>
            <Link
              to="/tasks/new"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-md hover:shadow-xl border border-blue-100 group transition-all ${isRealTimeUpdate ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold text-gray-900 mb-2 transition-all ${isRealTimeUpdate ? 'scale-110' : 'scale-100'}`}>{tasksAssignedToMe.length}</p>
            <p className="text-sm font-medium text-gray-600">Assigned to me</p>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <Link to="/tasks" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                View all
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-md hover:shadow-xl border border-amber-100 group transition-all ${isRealTimeUpdate ? 'ring-2 ring-amber-300 ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold text-gray-900 mb-2 transition-all ${isRealTimeUpdate ? 'scale-110' : 'scale-100'}`}>{inProgressTasksCount}</p>
            <p className="text-sm font-medium text-gray-600">In progress</p>
            <div className="mt-4 pt-4 border-t border-amber-100">
              <span className="text-xs font-semibold text-amber-600">Keep going! 💪</span>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-md hover:shadow-xl border border-green-100 group transition-all ${isRealTimeUpdate ? 'ring-2 ring-green-300 ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold text-gray-900 mb-2 transition-all ${isRealTimeUpdate ? 'scale-110' : 'scale-100'}`}>{completedTasksCount}</p>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <div className="mt-4 pt-4 border-t border-green-100">
              <span className="text-xs font-semibold text-green-600">Great job! 🎉</span>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-md hover:shadow-xl border border-red-100 group transition-all ${isRealTimeUpdate ? 'ring-2 ring-red-300 ring-opacity-50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold text-gray-900 mb-2 transition-all ${isRealTimeUpdate ? 'scale-110' : 'scale-100'}`}>{overdueTasks.length}</p>
            <p className="text-sm font-medium text-gray-600">Overdue</p>
            <div className="mt-4 pt-4 border-t border-red-100">
              {overdueTasks.length > 0 ? (
                <span className="text-xs font-semibold text-red-600">Needs attention! ⚠️</span>
              ) : (
                <span className="text-xs font-semibold text-gray-500">All caught up! ✨</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10 md:hidden">
          <Link
            to="/tasks/new"
            className="w-full flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Task
          </Link>
        </div>

        {/* Task Sections */}
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <section className="bg-white rounded-2xl p-6 shadow-md border border-red-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Overdue Tasks</h2>
                    <p className="text-sm text-gray-500">{overdueTasks.length} {overdueTasks.length === 1 ? 'task needs' : 'tasks need'} immediate attention</p>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <TaskCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overdueTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Tasks Assigned to Me */}
          <section className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
                  <p className="text-sm text-gray-500">{tasksAssignedToMe.length} {tasksAssignedToMe.length === 1 ? 'task' : 'tasks'} assigned to you</p>
                </div>
              </div>
              <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                View all
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            ) : tasksAssignedToMe.length === 0 ? (
              <EmptyState
                title="No tasks assigned"
                description="You don't have any tasks assigned to you yet"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksAssignedToMe.slice(0, 6).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>

          {/* Tasks Created by Me */}
          <section className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Created by Me</h2>
                  <p className="text-sm text-gray-500">{tasksCreatedByMe.length} {tasksCreatedByMe.length === 1 ? 'task' : 'tasks'} you've created</p>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            ) : tasksCreatedByMe.length === 0 ? (
              <EmptyState
                title="No tasks created"
                description="You haven't created any tasks yet"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksCreatedByMe.slice(0, 6).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
