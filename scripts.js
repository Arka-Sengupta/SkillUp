// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const userCardsContainer = document.getElementById('user-cards-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const applyFiltersButton = document.getElementById('apply-filters');
const filterStatus = document.getElementById('filter-status');

// State Management
let currentUser = null;
let isLoggedIn = false;
let users = [];

// Initialize the application
function init() {
  loadUsers();
  loadCurrentUser();
  renderUserCards();
  setupEventListeners();
}

// Load users from localStorage or initialize with sample data
function loadUsers() {
  const storedUsers = localStorage.getItem('skillswap_users');
  
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    // Initialize with sample data
    users = [
      {
        name: "Alex Johnson",
        email: "alex@mit.edu",
        gradYear: "2025",
        branch: "Computer Science",
        skills: ["JavaScript", "React", "UI Design"],
        lookingFor: ["Python", "Data Science"]
      },
      {
        name: "Jamie Smith",
        email: "jamie@stanford.edu",
        gradYear: "2024",
        branch: "Business",
        skills: ["Marketing", "Public Speaking", "Excel"],
        lookingFor: ["Web Development", "Graphic Design"]
      },
      {
        name: "Taylor Wong",
        email: "taylor@harvard.edu",
        gradYear: "2026",
        branch: "Arts",
        skills: ["Photography", "Photoshop", "Illustration"],
        lookingFor: ["Video Editing", "3D Modeling"]
      },
      {
        name: "Jordan Patel",
        email: "jordan@berkeley.edu",
        gradYear: "2025",
        branch: "Engineering",
        skills: ["CAD Design", "3D Printing", "Arduino"],
        lookingFor: ["Web Development", "Mobile App Development"]
      },
      {
        name: "Casey Rivera",
        email: "casey@yale.edu",
        gradYear: "2024",
        branch: "Science",
        skills: ["Data Analysis", "R Programming", "Research Methods"],
        lookingFor: ["Machine Learning", "Visualization"]
      },
      {
        name: "Morgan Lee",
        email: "morgan@princeton.edu",
        gradYear: "2026",
        branch: "Computer Science",
        skills: ["Python", "Machine Learning", "Algorithm Design"],
        lookingFor: ["UI/UX Design", "Frontend Development"]
      }
    ];
    saveUsers();
  }
}

// Load current user from localStorage
function loadCurrentUser() {
  const storedUser = localStorage.getItem('skillswap_current_user');
  
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    isLoggedIn = true;
    updateUIForLoggedInUser();
  }
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem('skillswap_users', JSON.stringify(users));
}

// Save current user to localStorage
function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem('skillswap_current_user', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('skillswap_current_user');
  }
}

// Set up event listeners
function setupEventListeners() {
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
  
  // Login form submission
  loginForm.addEventListener('submit', handleLogin);
  
  // Register form submission
  registerForm.addEventListener('submit', handleRegister);
  
  // Apply filters
  applyFiltersButton.addEventListener('click', applyFilters);
}

// Switch between tabs
function switchTab(tabName) {
  tabButtons.forEach(button => {
    if (button.getAttribute('data-tab') === tabName) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  tabContents.forEach(content => {
    if (content.id === tabName) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Basic validation
  if (!email || !password) {
    loginError.textContent = 'Please enter both email and password';
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    loginError.textContent = 'Please enter a valid email address';
    return;
  }
  
  loginError.textContent = '';
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (user) {
    // In a real app, you would verify the password here
    // For this demo, we'll just log the user in
    currentUser = user;
    isLoggedIn = true;
    saveCurrentUser();
    updateUIForLoggedInUser();
    alert(`Welcome back, ${user.name}!`);
    switchTab('browse');
  } else {
    loginError.textContent = 'User not found. Please register first.';
  }
}

// Handle register form submission
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const gradYear = document.getElementById('register-grad-year').value;
  const branch = document.getElementById('register-branch').value;
  const skillsText = document.getElementById('register-skills').value;
  const lookingForText = document.getElementById('register-looking-for').value;
  
  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    registerError.textContent = 'Please fill in all required fields';
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    registerError.textContent = 'Please enter a valid email address';
    return;
  }
  
  if (password !== confirmPassword) {
    registerError.textContent = 'Passwords do not match';
    return;
  }
  
  if (password.length < 6) {
    registerError.textContent = 'Password must be at least 6 characters';
    return;
  }
  
  registerError.textContent = '';
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    registerError.textContent = 'A user with this email already exists';
    return;
  }
  
  // Process skills and looking for
  const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
  const lookingFor = lookingForText.split(',').map(s => s.trim()).filter(Boolean);
  
  // Create new user
  const newUser = {
    name,
    email,
    gradYear,
    branch,
    skills,
    lookingFor
  };
  
  // Add to users array
  users.push(newUser);
  saveUsers();
  
  // Log in the new user
  currentUser = newUser;
  isLoggedIn = true;
  saveCurrentUser();
  updateUIForLoggedInUser();
  
  alert(`Welcome to SkillUp ${name}!`);
  switchTab('browse');
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  // You could update the UI to show the user is logged in
  // For example, change the login tab button to show the user's name
  // or add a logout button
}

// Render user cards
function renderUserCards(filteredUsers = null) {
  // Clear existing cards
  userCardsContainer.innerHTML = '';
  
  // Use filtered users if provided, otherwise use all users
  const usersToRender = filteredUsers || users;
  
  if (usersToRender.length === 0) {
    userCardsContainer.innerHTML = '<p class="text-muted">No users found matching your filters.</p>';
    return;
  }
  
  // Get the template
  const template = document.getElementById('user-card-template');
  
  // Create and append user cards
  usersToRender.forEach(user => {
    const userCard = document.importNode(template.content, true);
    
    // Set user data
    userCard.querySelector('.user-name').textContent = user.name;
    
    const domain = user.email.split('@')[1];
    const details = `${domain} • ${user.gradYear || 'N/A'} • ${user.branch || 'N/A'}`;
    userCard.querySelector('.user-details').textContent = details;
    
    // Set avatar initials
    const initials = user.name.split(' ').map(n => n[0]).join('');
    userCard.querySelector('.avatar-initials').textContent = initials;
    
    // Add skills badges
    const skillsBadges = userCard.querySelector('.skills-badges');
    user.skills.forEach(skill => {
      const badge = document.createElement('span');
      badge.className = 'badge secondary';
      badge.textContent = skill;
      skillsBadges.appendChild(badge);
    });
    
    // Add looking for badges
    const lookingForBadges = userCard.querySelector('.looking-for-badges');
    user.lookingFor.forEach(skill => {
      const badge = document.createElement('span');
      badge.className = 'badge outline';
      badge.textContent = skill;
      lookingForBadges.appendChild(badge);
    });
    
    // Add connect button event
    const connectButton = userCard.querySelector('.connect-button');
    connectButton.addEventListener('click', () => {
      if (!isLoggedIn) {
        alert('Please log in to connect with peers');
        switchTab('login');
        return;
      }
      
      connectButton.textContent = 'Connecting...';
      connectButton.disabled = true;
      
      // Simulate connection request
      setTimeout(() => {
        alert(`Connection request sent to ${user.name}`);
        connectButton.textContent = 'Connect';
        connectButton.disabled = false;
      }, 1000);
    });
    
    // Append the card to the container
    userCardsContainer.appendChild(userCard);
  });
}

// Apply filters
function applyFilters() {
  const collegeDomain = document.getElementById('college-filter').value.trim().toLowerCase();
  const gradYear = document.getElementById('year-filter').value;
  const branch = document.getElementById('branch-filter').value;
  const skillSearch = document.getElementById('skill-filter').value.trim().toLowerCase();
  
  // Filter users
  const filteredUsers = users.filter(user => {
    // Filter by college domain
    if (collegeDomain && !user.email.toLowerCase().includes(collegeDomain)) {
      return false;
    }
    
    // Filter by graduation year
    if (gradYear && user.gradYear !== gradYear) {
      return false;
    }
    
    // Filter by branch/major
    if (branch && user.branch !== branch) {
      return false;
    }
    
    // Filter by skills
    if (skillSearch) {
      const hasSkill = user.skills.some(skill => 
        skill.toLowerCase().includes(skillSearch)
      );
      const isLookingFor = user.lookingFor.some(skill => 
        skill.toLowerCase().includes(skillSearch)
      );
      
      return hasSkill || isLookingFor;
    }
    
    // If all filters pass
    return true;
  });
  
  // Update filter status
  let statusText = 'Showing ';
  if (filteredUsers.length === 0) {
    statusText += 'no students';
  } else if (filteredUsers.length === 1) {
    statusText += '1 student';
  } else {
    statusText += `${filteredUsers.length} students`;
  }
  
  if (collegeDomain) {
    statusText += ` from ${collegeDomain}`;
  } else {
    statusText += ' from all colleges';
  }
  
  filterStatus.textContent = statusText;
  
  // Render filtered users
  renderUserCards(filteredUsers);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
// DOM Elements
const profileTab = document.getElementById('profile-tab');
const logoutButton = document.getElementById('logout-button');
const deleteProfileButton = document.getElementById('delete-profile-button');
const profileDetails = document.getElementById('profile-details');

// Update UI for logged-in user
function updateUIForLoggedInUser() {
  // Show Profile and Logout buttons
  profileTab.style.display = 'inline-block';
  logoutButton.style.display = 'inline-block';

  // Hide Login and Register buttons
  document.querySelector('[data-tab="login"]').style.display = 'none';
  document.querySelector('[data-tab="register"]').style.display = 'none';

  // Render profile details
  renderProfileDetails();
}

// Render profile details
function renderProfileDetails() {
  if (!currentUser) return;

  profileDetails.innerHTML = `
    <h3>${currentUser.name}</h3>
    <p><strong>Email:</strong> ${currentUser.email}</p>
    <p><strong>Graduation Year:</strong> ${currentUser.gradYear || 'N/A'}</p>
    <p><strong>Branch:</strong> ${currentUser.branch || 'N/A'}</p>
    <p><strong>Skills:</strong> ${currentUser.skills.join(', ') || 'N/A'}</p>
    <p><strong>Looking For:</strong> ${currentUser.lookingFor.join(', ') || 'N/A'}</p>
  `;
}

// Logout functionality
logoutButton.addEventListener('click', () => {
  currentUser = null;
  isLoggedIn = false;
  saveCurrentUser();

  // Hide Profile and Logout buttons
  profileTab.style.display = 'none';
  logoutButton.style.display = 'none';

  // Show Login and Register buttons
  document.querySelector('[data-tab="login"]').style.display = 'inline-block';
  document.querySelector('[data-tab="register"]').style.display = 'inline-block';

  // Switch to Browse tab
  switchTab('browse');
  alert('You have been logged out.');
});

// Delete profile functionality
deleteProfileButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete your SkillUp profile? This action cannot be undone.')) {
    // Remove user from the users array
    users = users.filter(user => user.email !== currentUser.email);
    saveUsers();

    // Log out the user
    currentUser = null;
    isLoggedIn = false;
    saveCurrentUser();

    // Hide Profile and Logout buttons
    profileTab.style.display = 'none';
    logoutButton.style.display = 'none';

    // Show Login and Register buttons
    document.querySelector('[data-tab="login"]').style.display = 'inline-block';
    document.querySelector('[data-tab="register"]').style.display = 'inline-block';

    // Switch to Browse tab
    switchTab('browse');
    alert('Your profile has been deleted.');
  }
});

// Initialize the application
function init() {
  loadUsers();
  loadCurrentUser();
  renderUserCards();
  setupEventListeners();

  // Show Profile and Logout buttons if user is logged in
  if (isLoggedIn) {
    updateUIForLoggedInUser();
  }
}

// Call init when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);


 // DOM Elements
 const themeToggle = document.getElementById('theme-toggle');
 const themeLabel = document.getElementById('theme-label');
 const body = document.body;
 
 // Check user's preference from localStorage
 const savedTheme = localStorage.getItem('theme');
 if (savedTheme === 'dark') {
   body.classList.add('dark-mode');
   themeToggle.checked = true;
   themeLabel.textContent = 'Light Mode';
 } else {
   body.classList.remove('dark-mode');
   themeToggle.checked = false;
   themeLabel.textContent = 'Dark Mode';
 }
 
 // Toggle Dark Mode
 themeToggle.addEventListener('change', () => {
   if (themeToggle.checked) {
     body.classList.add('dark-mode');
     localStorage.setItem('theme', 'dark');
     themeLabel.textContent = 'Light Mode';
   } else {
     body.classList.remove('dark-mode');
     localStorage.setItem('theme', 'light');
     themeLabel.textContent = 'Dark Mode';
   }
 });
