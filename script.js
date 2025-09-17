// Theme toggle (unchanged)
const toggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') root.classList.add('light');
toggle.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Scroll buttons for all project categories
document.querySelectorAll('#projects .projects-wrapper').forEach(wrapper => {
  const projectRow = wrapper.querySelector('.projects');

  if (projectRow && projectRow.children.length > 3) {
    // Create buttons
    const leftBtn = document.createElement('button');
    leftBtn.className = 'scroll-btn left';
    leftBtn.textContent = '‹';

    const rightBtn = document.createElement('button');
    rightBtn.className = 'scroll-btn right';
    rightBtn.textContent = '›';

    // Append buttons to wrapper (overlay)
    wrapper.appendChild(leftBtn);
    wrapper.appendChild(rightBtn);

    const scrollAmount = 320;

    leftBtn.addEventListener('click', () => {
      projectRow.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
      projectRow.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
});

// Ensure all project rows start scrolled to the left
document.querySelectorAll('#projects .projects').forEach(row => {
  row.scrollLeft = 0;
});
