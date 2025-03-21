// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core features
    initializeDarkMode();
    initializeNavigation();
    initializeMoodTracking();
    initializeActivityTracking();
    initializeMusicPlayer();
    initializeMeditation();
    initializeFocusTimer();
});

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        html.classList.add('dark');
        darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
    
    // Toggle dark mode
    darkModeToggle?.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        
        // Toggle icon
        const icon = darkModeToggle.querySelector('i');
        icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
        
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });
}

// Navigation functionality
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target section with animation
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                    // Add fade-in animation
                    section.style.opacity = '0';
                    requestAnimationFrame(() => {
                        section.style.transition = 'opacity 0.3s ease-in-out';
                        section.style.opacity = '1';
                    });
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });
}

// Mood tracking functionality
function initializeMoodTracking() {
    const moodButtons = document.querySelectorAll('#mood .emoji-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.querySelector('span:last-child')?.textContent || '';
            handleMoodSelection(mood, button);
        });
    });
}

function handleMoodSelection(mood, selectedButton) {
    // Remove active state from all buttons
    document.querySelectorAll('#mood .emoji-btn').forEach(btn => {
        btn.classList.remove('bg-primary-100', 'dark:bg-primary-900');
    });
    
    // Add active state to selected button
    selectedButton.classList.add('bg-primary-100', 'dark:bg-primary-900');
    
    const suggestions = {
        'Great': 'Perfect time for challenging tasks!',
        'Good': 'Keep the momentum going!',
        'Okay': 'Consider a quick meditation break.',
        'Tired': 'Take a 15-minute rest.',
        'Stressed': 'Try some deep breathing exercises.'
    };
    
    showToast(suggestions[mood] || 'Thank you for checking in!');
    updateMoodHistory(mood);
}

function updateMoodHistory(mood) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const emojis = {
        'Great': '😊',
        'Good': '🙂',
        'Okay': '😐',
        'Tired': '😴',
        'Stressed': '😣'
    };
    
    const historyEntry = document.createElement('div');
    historyEntry.className = 'flex items-center justify-between animate-fade-in';
    historyEntry.innerHTML = `
        <div class="flex items-center">
            <span class="text-2xl mr-3">${emojis[mood] || '😊'}</span>
            <span>${mood}</span>
        </div>
        <span class="text-sm text-gray-600 dark:text-gray-400">Today ${timeString}</span>
    `;
    
    const historyContainer = document.querySelector('#mood .space-y-4');
    if (historyContainer) {
        historyContainer.insertBefore(historyEntry, historyContainer.firstChild);
    }
}

// Activity tracking functionality
function initializeActivityTracking() {
    // Add Task button
    const addTaskBtn = document.querySelector('button:has(i.fa-plus)');
    addTaskBtn?.addEventListener('click', () => {
        showToast('Task logging feature coming soon!');
    });
    
    // Log Break button
    const logBreakBtn = document.querySelector('button:has(i.fa-coffee)');
    logBreakBtn?.addEventListener('click', () => {
        showToast('Break logged successfully!');
    });
}

// Music player functionality
function initializeMusicPlayer() {
    const playButtons = document.querySelectorAll('.music-player button');
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            if (icon && (icon.classList.contains('fa-play') || icon.classList.contains('fa-pause'))) {
                const isPlaying = icon.classList.contains('fa-play');
                icon.classList.toggle('fa-play', !isPlaying);
                icon.classList.toggle('fa-pause', isPlaying);
                showToast(isPlaying ? 'Music playing' : 'Music paused');
            }
        });
    });
}

// Meditation functionality
function initializeMeditation() {
    const meditationButtons = document.querySelectorAll('.meditation-card button');
    meditationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sessionName = button.closest('.meditation-card')?.querySelector('h3')?.textContent || 'Session';
            showToast(`Starting ${sessionName}`);
        });
    });
}

// Focus timer functionality
function initializeFocusTimer() {
    const startFocusBtn = document.querySelector('button:has(i.fa-play)');
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    
    startFocusBtn?.addEventListener('click', () => {
        const icon = startFocusBtn.querySelector('i');
        const isStarting = icon.classList.contains('fa-play');
        
        icon.classList.toggle('fa-play', !isStarting);
        icon.classList.toggle('fa-pause', isStarting);
        
        if (isStarting) {
            // Start timer
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    showToast('Focus session completed!');
                    timeLeft = 25 * 60;
                    updateTimerDisplay(timeLeft);
                    icon.classList.replace('fa-pause', 'fa-play');
                }
            }, 1000);
            showToast('Focus session started!');
        } else {
            // Pause timer
            clearInterval(timerInterval);
            showToast('Focus session paused');
        }
    });
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const display = document.querySelector('.text-4xl');
    if (display) {
        display.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Toast notification system
function showToast(message) {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-primary-500 text-white py-3 px-4 rounded-lg shadow-lg transform transition-all duration-300 z-50 flex items-center';
    toast.innerHTML = `
        <i class="fas fa-info-circle mr-2"></i>
        <span>${message}</span>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateY(100%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}