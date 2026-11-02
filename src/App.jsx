
import { useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarDays, BookOpen, Target,
  Plus, Search, Bell, LogOut, CheckCircle2, Circle,
  Trash2, Pencil, Clock3, Flame, TrendingUp,
  ChevronRight, X, Sparkles, Menu, UserRound,
  ListTodo, CalendarCheck, Rocket
} from "lucide-react";
import "./App.css";

// ========================================
// 1. PREDEFINED USERS
// ========================================

const USERS = [
  { username: "arun", password: "arun123", name: "Arun Kumar" },
  { username: "hari", password: "hari123", name: "Hari Prasad" },
  { username: "maga", password: "maga123", name: "MagaLakshmi" },
];

// ========================================
// 2. STARTER TASKS
// ========================================

const starterTasks = [
  {
    id: 1,
    title: "Practice JavaScript ES6 concepts",
    category: "Learning",
    priority: "High",
    date: new Date().toLocaleDateString("en-CA"),
    completed: false,
    description: "Practice map, filter, reduce and promises."
  },
  {
    id: 2,
    title: "Complete React Hooks",
    category: "Learning",
    priority: "High",
    date: new Date().toLocaleDateString("en-CA"),
    completed: false,
    description: "Understand useState and useEffect."
  },
  {
    id: 3,
    title: "Build personal portfolio",
    category: "Project",
    priority: "Medium",
    date: new Date().toLocaleDateString("en-CA"),
    completed: false,
    description: "Create a responsive portfolio website."
  },
  {
    id: 4,
    title: "Learn Next.js fundamentals",
    category: "Learning",
    priority: "Medium",
    date: "2026-11-05",
    completed: false,
    description: "Learn routing, layouts and server components."
  },
  {
    id: 5,
    title: "Read technical documentation",
    category: "Personal",
    priority: "Low",
    date: "2026-11-06",
    completed: false,
    description: "Spend 30 minutes reading documentation."
  }
];

const today = () => new Date().toLocaleDateString("en-CA");

function getTasks(username) {
  const saved = localStorage.getItem(`tasks_${username}`);

  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  return starterTasks.map((task, index) => ({
    ...task,
    id: Date.now() + index + Math.random()
  }));
}

// ========================================
// 3. MAIN APP
// ========================================

export default function App() {
  const [user, setUser] = useState(
    localStorage.getItem("currentUser") || ""
  );

  const [tasks, setTasks] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? getTasks(savedUser) : [];
  });

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Learning",
    priority: "Medium",
    date: today()
  });

  // Save each user's tasks independently
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // ========================================
  // AUTHENTICATION
  // ========================================

  function handleLogin(e) {
    e.preventDefault();

    const found = USERS.find(
      (item) =>
        item.username.toLowerCase() === loginName.trim().toLowerCase() &&
        item.password === loginPassword
    );

    if (!found) {
      setLoginError("Incorrect username or password.");
      return;
    }

    const username = found.username;

    localStorage.setItem("currentUser", username);
    setTasks(getTasks(username));
    setUser(username);
    setLoginError("");
    setLoginPassword("");
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser("");
    setTasks([]);
    setActivePage("Dashboard");
    setMobileMenu(false);
  }

  const currentUser = USERS.find(
    (item) => item.username === user
  );

  // ========================================
  // TASK OPERATIONS
  // ========================================

  function openAddModal() {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      category: activePage === "Learning Roadmap"
        ? "Learning" : "Work",
      priority: "Medium",
      date: today()
    });
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      category: task.category,
      priority: task.priority,
      date: task.date
    });
    setShowModal(true);
  }

  function saveTask(e) {
    e.preventDefault();

    if (!form.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...form, title: form.title.trim() }
            : task
        )
      );
    } else {
      const newTask = {
        ...form,
        id: Date.now(),
        title: form.title.trim(),
        completed: false
      };

      setTasks((prev) => [newTask, ...prev]);
    }

    setShowModal(false);
    setEditingTask(null);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  }

  // ========================================
  // TASK STATISTICS
  // ========================================

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayTasks = tasks.filter((t) => t.date === today());
  const upcomingTasks = tasks.filter((t) => t.date > today());
  const learningTasks = tasks.filter((t) => t.category === "Learning");

  const completion = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  // ========================================
  // PAGE FILTERING
  // ========================================

  let visibleTasks = tasks;

  if (activePage === "Today") {
    visibleTasks = tasks.filter((t) => t.date === today());
  }

  if (activePage === "Upcoming") {
    visibleTasks = tasks.filter((t) => t.date > today());
  }

  if (activePage === "Learning Roadmap") {
    visibleTasks = learningTasks;
  }

  if (filter === "Completed") {
    visibleTasks = visibleTasks.filter((t) => t.completed);
  }

  if (filter === "Pending") {
    visibleTasks = visibleTasks.filter((t) => !t.completed);
  }

  if (search.trim()) {
    visibleTasks = visibleTasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  const pageDescription = {
    Dashboard: "Your productivity at a glance.",
    Today: "Focus on what matters today.",
    Upcoming: "Plan ahead and stay prepared.",
    "Learning Roadmap": "Build skills and grow every day.",
    "All Tasks": "Manage everything in one place."
  };

  // ========================================
  // LOGIN SCREEN
  // ========================================

  if (!user || !currentUser) {
    return (
      <div className="login-screen">
        <div className="login-decoration decoration-one" />
        <div className="login-decoration decoration-two" />

        <div className="login-card">
          <div className="brand-logo">
            <div className="brand-icon"><Sparkles size={23} /></div>
            <span>TaskFlow<span className="brand-dot">.</span></span>
          </div>

          <div className="login-heading">
            <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
            <h1>Welcome back<span className="brand-dot">.</span></h1>
            <p>Sign in and make today productive.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label>Username</label>
            <input
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {loginError && <p className="login-error">{loginError}</p>}

            <button className="login-button" type="submit">
              Sign in to workspace <ChevronRight size={18} />
            </button>
          </form>

          <div className="demo-accounts">
            <div className="demo-title">
              <span>DEMO ACCOUNTS</span>
              <span>For testing</span>
            </div>

            {USERS.map((item) => (
              <button
                key={item.username}
                className="demo-user"
                onClick={() => {
                  setLoginName(item.username);
                  setLoginPassword(item.password);
                  setLoginError("");
                }}
              >
                <span className="demo-avatar">
                  {item.name.charAt(0)}
                </span>
                <span className="demo-name">{item.name}</span>
                <span className="demo-fill">Use account <ChevronRight size={14}/></span>
              </button>
            ))}
          </div>

          <p className="login-footer">
            TaskFlow · Plan better. Learn faster. Achieve more.
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // DASHBOARD
  // ========================================

  return (
    <div className="app-shell">

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon"><Sparkles size={21}/></div>
          <span>TaskFlow<span className="brand-dot">.</span></span>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}>
            <X size={20}/>
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav">
          {[
            { name: "Dashboard", icon: LayoutDashboard },
            { name: "Today", icon: CalendarCheck, count: todayTasks.length },
            { name: "Upcoming", icon: Clock3, count: upcomingTasks.length },
            { name: "All Tasks", icon: ListTodo },
            { name: "Learning Roadmap", icon: BookOpen }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);
                  setFilter("All");
                  setMobileMenu(false);
                }}
                className={`nav-item ${activePage === item.name ? "nav-active" : ""}`}
              >
                <Icon size={19}/>
                <span>{item.name}</span>
                {item.count > 0 && <small>{item.count}</small>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-tip">
          <div className="tip-icon"><Rocket size={20}/></div>
          <h4>Keep growing!</h4>
          <p>Small daily improvements lead to remarkable results.</p>
        </div>

        <div className="sidebar-user">
          <div className="profile-avatar">
            {currentUser.name.charAt(0)}
          </div>
          <div className="profile-details">
            <strong>{currentUser.name}</strong>
            <span>@{currentUser.username}</span>
          </div>
          <button onClick={logout} title="Logout" className="logout-button">
            <LogOut size={18}/>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={22}/>
          </button>

          <div className="topbar-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={15}/>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <div className="top-date">
              <CalendarDays size={16}/>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
            </div>
            <div className="top-avatar">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="page-container">

          {/* Page heading */}
          <section className="welcome-section">
            <div>
              <span className="eyebrow">
                {activePage === "Dashboard" ? "YOUR PERSONAL OVERVIEW" : "YOUR WORKSPACE"}
              </span>
              <h1>
                {activePage === "Dashboard"
                  ? `Hello, ${currentUser.name.split(" ")[0]} 👋`
                  : activePage}
              </h1>
              <p>{pageDescription[activePage]}</p>
            </div>

            <button className="add-main-button" onClick={openAddModal}>
              <Plus size={19}/> Add new task
            </button>
          </section>

          {/* Dashboard stats */}
          <section className="stats-row">
            <div className="stat-box">
              <div className="stat-top">
                <span>Total tasks</span>
                <div className="stat-icon purple"><ListTodo size={19}/></div>
              </div>
              <h2>{tasks.length}</h2>
              <p>Across all categories</p>
            </div>

            <div className="stat-box">
              <div className="stat-top">
                <span>Completed</span>
                <div className="stat-icon green"><CheckCircle2 size={19}/></div>
              </div>
              <h2>{completedTasks.length}</h2>
              <p>Tasks successfully done</p>
            </div>

            <div className="stat-box">
              <div className="stat-top">
                <span>Pending tasks</span>
                <div className="stat-icon orange"><Clock3 size={19}/></div>
              </div>
              <h2>{pendingTasks.length}</h2>
              <p>Still on your list</p>
            </div>

            <div className="stat-box">
              <div className="stat-top">
                <span>Learning goals</span>
                <div className="stat-icon blue"><BookOpen size={19}/></div>
              </div>
              <h2>{learningTasks.length}</h2>
              <p>Skills to work on</p>
            </div>
          </section>

          {/* Main dashboard columns */}
          <section className="dashboard-grid">

            <div className="left-column">

              {/* Progress card */}
              <div className="panel progress-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">YOUR PERFORMANCE</span>
                    <h3>Productivity overview</h3>
                  </div>
                  <div className="progress-badge">
                    <TrendingUp size={15}/> {completion}% done
                  </div>
                </div>

                <div className="progress-content">
                  <div className="progress-circle" style={{
                    "--progress": `${completion * 3.6}deg`
                  }}>
                    <div className="circle-inner">
                      <strong>{completion}%</strong>
                      <span>Completed</span>
                    </div>
                  </div>

                  <div className="progress-details">
                    <div>
                      <span className="legend-dot green-dot"/>
                      <span>Completed</span>
                      <strong>{completedTasks.length}</strong>
                    </div>
                    <div>
                      <span className="legend-dot orange-dot"/>
                      <span>Remaining</span>
                      <strong>{pendingTasks.length}</strong>
                    </div>
                    <p>Keep going! Every completed task takes you one step closer to your goals.</p>
                  </div>
                </div>
              </div>

              {/* Daily focus */}
              <div className="panel daily-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">TODAY'S FOCUS</span>
                    <h3>Daily tasks</h3>
                  </div>
                  <button className="text-link" onClick={() => setActivePage("Today")}>
                    View all <ChevronRight size={15}/>
                  </button>
                </div>

                <div className="daily-summary">
                  <Flame size={17}/>
                  <span>{todayCompleted} of {todayTasks.length} tasks completed today</span>
                </div>

                {todayTasks.slice(0, 4).map((task) => (
                  <div className="daily-task" key={task.id}>
                    <button onClick={() => toggleTask(task.id)}>
                      {task.completed
                        ? <CheckCircle2 className="checked-icon" size={21}/>
                        : <Circle size={21}/>}
                    </button>
                    <div className="daily-task-text">
                      <strong className={task.completed ? "task-done" : ""}>
                        {task.title}
                      </strong>
                      <span>{task.category} · {task.priority} priority</span>
                    </div>
                    <span className={`priority-dot ${task.priority.toLowerCase()}`}/>
                  </div>
                ))}

                {todayTasks.length === 0 && (
                  <div className="empty-message">
                    No tasks planned for today. Add your first task!
                  </div>
                )}
              </div>

              {/* Learning roadmap */}
              <div className="panel learning-panel">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">UPGRADE YOUR SKILLS</span>
                    <h3>Learning roadmap</h3>
                  </div>
                  <button className="text-link" onClick={() => setActivePage("Learning Roadmap")}>
                    View all <ChevronRight size={15}/>
                  </button>
                </div>

                <div className="learning-items">
                  {learningTasks.slice(0, 4).map((task, index) => (
                    <div className="learning-item" key={task.id}>
                      <div className={`learning-number ${task.completed ? "learning-done" : ""}`}>
                        {task.completed ? <CheckCircle2 size={17}/> : index + 1}
                      </div>
                      <div className="learning-text">
                        <strong className={task.completed ? "task-done" : ""}>
                          {task.title}
                        </strong>
                        <span>{task.date}</span>
                      </div>
                      <button onClick={() => toggleTask(task.id)}>
                        {task.completed ? "Completed" : "Mark done"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="right-column">

              <div className="panel quick-panel">
                <span className="eyebrow">QUICK OVERVIEW</span>
                <h3>Your daily goal</h3>
                <p>Complete your planned tasks and make progress every day.</p>

                <div className="quick-progress">
                  <div>
                    <span>Today's completion</span>
                    <strong>
                      {todayTasks.length
                        ? Math.round(todayCompleted / todayTasks.length * 100)
                        : 0}%
                    </strong>
                  </div>
                  <div className="mini-progress">
                    <span style={{
                      width: `${todayTasks.length
                        ? todayCompleted / todayTasks.length * 100
                        : 0}%`
                    }}/>
                  </div>
                </div>

                <button onClick={() => setActivePage("Today")}>
                  Focus on today <ChevronRight size={16}/>
                </button>
              </div>

              <div className="panel category-panel">
                <span className="eyebrow">TASK BREAKDOWN</span>
                <h3>By category</h3>

                {["Learning", "Work", "Project", "Personal"].map((category) => {
                  const count = tasks.filter((t) => t.category === category).length;
                  const percent = tasks.length
                    ? Math.round(count / tasks.length * 100)
                    : 0;

                  return (
                    <div className="category-row" key={category}>
                      <div>
                        <span>{category}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="category-track">
                        <span style={{ width: `${percent}%` }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="quote-card">
                <Sparkles size={21}/>
                <h3>One step at a time.</h3>
                <p>You don't need to be perfect. You just need to keep moving forward.</p>
                <span>YOUR DAILY REMINDER</span>
              </div>

            </div>
          </section>

          {/* All tasks page */}
          {activePage !== "Dashboard" && (
            <section className="panel full-task-panel">
              <div className="panel-heading task-page-heading">
                <div>
                  <span className="eyebrow">TASK MANAGEMENT</span>
                  <h3>{activePage}</h3>
                  <p>{visibleTasks.length} tasks found</p>
                </div>
                <button className="add-main-button" onClick={openAddModal}>
                  <Plus size={18}/> New task
                </button>
              </div>

              <div className="task-toolbar">
                <div className="task-search">
                  <Search size={18}/>
                  <input
                    placeholder="Search your tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="full-task-list">
                {visibleTasks.map((task) => (
                  <div className="full-task-item" key={task.id}>
                    <button onClick={() => toggleTask(task.id)}>
                      {task.completed
                        ? <CheckCircle2 className="checked-icon"/>
                        : <Circle/>}
                    </button>

                    <div className="full-task-info">
                      <strong className={task.completed ? "task-done" : ""}>
                        {task.title}
                      </strong>
                      <p>{task.description || "No description added."}</p>
                      <div className="full-task-meta">
                        <span>{task.category}</span>
                        <span className={`priority-label ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span>{task.date}</span>
                      </div>
                    </div>

                    <button className="action-icon" onClick={() => openEditModal(task)}>
                      <Pencil size={17}/>
                    </button>
                    <button className="action-icon delete-action" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={17}/>
                    </button>
                  </div>
                ))}

                {visibleTasks.length === 0 && (
                  <div className="empty-message">
                    No tasks found. Add a new task to get started.
                  </div>
                )}
              </div>
            </section>
          )}

          <footer className="app-footer">
              <span>© 2026 TaskFlow. All rights reserved.</span>
              <span>
                Designed & Developed by
                <strong className="designer-name"> Arun Kumar J S</strong> ✦
              </span>
          </footer>
        </div>
      </main>

      {/* ADD / EDIT TASK MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="eyebrow">TASK MANAGEMENT</span>
                <h2>{editingTask ? "Edit task" : "Create a new task"}</h2>
                <p>Plan your work and keep moving forward.</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={21}/>
              </button>
            </div>

            <form onSubmit={saveTask}>
              <label>Task title</label>
              <input
                placeholder="What do you want to accomplish?"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Add a few details about this task..."
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={3}
              />

              <div className="modal-form-grid">
                <div>
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                  >
                    <option>Learning</option>
                    <option>Work</option>
                    <option>Project</option>
                    <option>Personal</option>
                  </select>
                </div>

                <div>
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({...form, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <label>Due date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                required
              />

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-main-button">
                  <Plus size={17}/>
                  {editingTask ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
