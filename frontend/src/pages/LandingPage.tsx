import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">TaskFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              Used by 2,400+ teams worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Task management
              <br />
              that works for you
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
              Keep your team organized and focused on what matters. 
              Simple, powerful, and built for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get started free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-200"
              >
                Sign in
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">Free 14-day trial · No credit card required · Cancel anytime</p>
          </div>

          {/* Hero Visual */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Main Dashboard Preview */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Mock Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="font-semibold text-gray-900">My Tasks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium">
                      New Task
                    </button>
                  </div>
                </div>

                {/* Tasks Grid */}
                <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1 - To Do */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">To Do</h3>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">3</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="font-medium text-gray-900 text-sm mb-2">Update pricing page</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Medium</span>
                            <span className="text-xs text-gray-500">Due tomorrow</span>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="font-medium text-gray-900 text-sm mb-2">Client presentation</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High</span>
                            <span className="text-xs text-gray-500">Due today</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - In Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">In Progress</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">2</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="font-medium text-gray-900 text-sm mb-2">Mobile app updates</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">High</span>
                            <span className="text-xs text-gray-500">Due Friday</span>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="font-medium text-gray-900 text-sm mb-2">Design review</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 - Done */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Done</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">4</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm opacity-75">
                          <div className="font-medium text-gray-500 text-sm mb-2 line-through">Review Q4 budget</div>
                          <div className="text-xs text-gray-400">Completed 2h ago</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm opacity-75">
                          <div className="font-medium text-gray-500 text-sm mb-2 line-through">Team standup</div>
                          <div className="text-xs text-gray-400">Completed today</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="hidden lg:block absolute -right-8 top-20 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Task completed</div>
                    <div className="text-xs text-gray-500">John marked "Budget Review" as done</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -left-8 bottom-20 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    @
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">New assignment</div>
                    <div className="text-xs text-gray-500">You were assigned to "Client presentation"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Powerful features designed to help your team work smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Task Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create, organize, and prioritize tasks with ease. Drag-and-drop interface, custom statuses, and smart filters keep you focused.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Notifications</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay updated with instant alerts for task assignments, updates, and deadlines. Never miss a beat with smart notifications.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Assign tasks, share progress, and collaborate seamlessly. Keep everyone aligned and working towards the same goals.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-orange-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Filtering</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find exactly what you need with powerful search and filter options. Sort by priority, status, assignee, or due date.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-pink-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor project progress with visual dashboards. Track completed tasks, overdue items, and team performance at a glance.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Ready</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your tasks anywhere, anytime. Fully responsive design works beautifully on desktop, tablet, and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-8 font-semibold">Trusted by leading teams worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              <div className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors">Acme Corp</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors">TechStart</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors">DesignCo</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors">BuildIt</div>
              <div className="text-2xl md:text-3xl font-bold text-gray-300 hover:text-gray-500 transition-colors">DevLabs</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20">
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">2.4k+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Active Teams</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">87k+</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Tasks Completed</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">4.8★</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">User Rating</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams using TaskFlow to stay organized and productive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start free trial
            </Link>
            <Link
              to="/login"
              className="text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              Sign in
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            Free 14-day trial • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand */}
            <div className="flex items-center">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">TaskFlow</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Blog</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
              © 2025 TaskFlow
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
