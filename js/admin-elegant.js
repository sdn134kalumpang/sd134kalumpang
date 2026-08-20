// ADMIN ELEGANT JS - SDN 134 KALUMPANG
document.addEventListener('DOMContentLoaded', () => {
  // Date
  const dateBadge = document.getElementById('dateBadge');
  if(dateBadge){
    const now = new Date();
    dateBadge.textContent = now.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  }

  // Sidebar submenu toggle
  document.querySelectorAll('.nav-group .has-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.nav-group');
      group.classList.toggle('open');
      // close others
      document.querySelectorAll('.nav-group').forEach(g => {
        if(g !== group) g.classList.remove('open');
      });
    });
  });

  // Open first group by default
  const firstGroup = document.querySelector('.nav-group');
  if(firstGroup) firstGroup.classList.add('open');

  // Mobile sidebar
  const sidebar = document.getElementById('sidebar');
  const mobileMenu = document.getElementById('mobileMenu');
  if(mobileMenu && sidebar){
    mobileMenu.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle && sidebar){
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
    });
  }

  // Submenu items click - simulate page change
  document.querySelectorAll('.sub-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const text = link.textContent.trim();
      // Update breadcrumb
      const breadcrumb = document.querySelector('.breadcrumb');
      if(breadcrumb) breadcrumb.innerHTML = `<span>Admin</span> / <span>${link.closest('.nav-group').querySelector('.nav-label').textContent}</span> / <strong>${text}</strong>`;
      // Highlight
      document.querySelectorAll('.sub-menu a').forEach(a => a.style.background = '');
      link.style.background = 'rgba(255,255,255,.1)';
      link.style.color = 'white';
      // Alert demo - nanti ganti dengan load halaman sebenarnya
      console.log('Buka:', text);
    });
  });

  // Quick buttons
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Fitur: ' + btn.textContent.trim() + ' - akan dikembangkan');
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
      if(confirm('Keluar dari Admin Panel?')){
        localStorage.clear();
        window.location.href = './index.html';
      }
    });
  }

  // KPI animation
  document.querySelectorAll('.kpi-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(() => {
      card.style.transition = 'all .4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 100);
  });
});
