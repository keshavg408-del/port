export const skillsData = [
  // Frontend
  { name: 'HTML5', category: 'frontend', level: 95, icon: 'fa-brands fa-html5', color: '#e34f26' },
  { name: 'CSS3', category: 'frontend', level: 92, icon: 'fa-brands fa-css3-alt', color: '#1572b6' },
  { name: 'JavaScript', category: 'frontend', level: 96, icon: 'fa-brands fa-js', color: '#f7df1e' },
  { name: 'React', category: 'frontend', level: 90, icon: 'fa-brands fa-react', color: '#61dafb' },
  { name: 'Tailwind CSS', category: 'frontend', level: 88, icon: 'fa-solid fa-wind', color: '#38bdf8' },

  // Backend
  { name: 'Node.js', category: 'backend', level: 90, icon: 'fa-brands fa-node-js', color: '#339933' },
  { name: 'Express.js', category: 'backend', level: 88, icon: 'fa-solid fa-server', color: '#00f5d4' },

  // Database
  { name: 'MySQL', category: 'database', level: 85, icon: 'fa-solid fa-database', color: '#4479a1' },
  { name: 'MongoDB', category: 'database', level: 86, icon: 'fa-solid fa-leaf', color: '#47a248' },

  // Programming
  { name: 'C++', category: 'programming', level: 92, icon: 'fa-solid fa-code', color: '#00599c' },
  { name: 'Python', category: 'programming', level: 89, icon: 'fa-brands fa-python', color: '#3776ab' },
  { name: 'Java', category: 'programming', level: 84, icon: 'fa-brands fa-java', color: '#5382a1' },

  // Tools
  { name: 'Git', category: 'tools', level: 94, icon: 'fa-brands fa-git-alt', color: '#f05032' },
  { name: 'GitHub', category: 'tools', level: 95, icon: 'fa-brands fa-github', color: '#ffffff' },
  { name: 'VS Code', category: 'tools', level: 96, icon: 'fa-solid fa-laptop-code', color: '#007acc' },
  { name: 'Figma', category: 'tools', level: 85, icon: 'fa-brands fa-figma', color: '#f24e1e' }
];

export function renderSkills(filterCategory = 'all') {
  const container = document.getElementById('skills-grid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? skillsData 
    : skillsData.filter(s => s.category === filterCategory);

  container.innerHTML = filtered.map(skill => {
    // Circle math
    const radius = 40;
    const circumference = 2 * Math.PI * radius; // 251.2
    const offset = circumference - (skill.level / 100) * circumference;

    return `
      <div class="glass-card skill-card tilt-element" data-category="${skill.category}">
        <div class="skill-ring-wrap">
          <svg class="skill-svg" viewBox="0 0 100 100">
            <circle class="skill-bg-circle" cx="50" cy="50" r="${radius}"></circle>
            <circle class="skill-progress-circle" cx="50" cy="50" r="${radius}" 
                    style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};" 
                    data-offset="${offset}" data-color="${skill.color}"></circle>
          </svg>
          <div class="skill-icon-center" style="color: ${skill.color}">
            <i class="${skill.icon}"></i>
          </div>
        </div>
        <h4 class="skill-name">${skill.name}</h4>
        <span class="skill-percent">${skill.level}% Mastery</span>
      </div>
    `;
  }).join('');

  // Animate Circular Progress Rings after DOM render
  setTimeout(() => {
    const circles = container.querySelectorAll('.skill-progress-circle');
    circles.forEach(circle => {
      const targetOffset = circle.getAttribute('data-offset');
      const targetColor = circle.getAttribute('data-color');
      circle.style.stroke = targetColor;
      circle.style.strokeDashoffset = targetOffset;
    });
  }, 100);
}
