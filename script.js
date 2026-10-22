/**
 * Lebenslauf-Webseite - Ehsan Akbari
 * Interaktive Skripte: Theme-Toggle, vCard-Download, Druckfunktion,
 * Skill-Filter, Live-Editor-Modus & Toast-Nachrichten
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light / Dark)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const savedTheme = localStorage.getItem('ehsan-cv-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ehsan-cv-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Design gewechselt zu ${newTheme === 'dark' ? 'Dunkelmodus' : 'Hellmodus'}`);
    });
  }

  function updateThemeIcon(theme) {
    const iconSpan = document.getElementById('theme-icon');
    if (!iconSpan) return;
    if (theme === 'dark') {
      // Sun icon
      iconSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // Moon icon
      iconSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  // 2. Mobile Nav Menu Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. Print / PDF Button
  const printBtns = document.querySelectorAll('.trigger-print');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  // 4. vCard (.vcf) Generator & Download
  const vcardBtns = document.querySelectorAll('.trigger-vcard');
  vcardBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadVCard();
    });
  });

  function downloadVCard() {
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Akbari;Ehsan;;;',
      'FN:Ehsan Akbari',
      'TITLE:IT-System-Techniker / Systemadministrator',
      'TEL;TYPE=CELL,VOICE:+41762404389',
      'EMAIL;TYPE=INTERNET,PREF:ehsan.ak64@gmail.com',
      'ADR;TYPE=HOME:;;Sonnhalde 2;Pfäffikon;SZ;8808;Switzerland',
      'LABEL;TYPE=HOME:Sonnhalde 2\\n8808 Pfäffikon SZ\\nSchweiz',
      'NOTE:Lebenslauf & Kontakt Ehsan Akbari (IT-System-Techniker)',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Ehsan_Akbari_Kontakt.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Kontaktdaten (.vcf) erfolgreich heruntergeladen!');
  }

  // 5. Copy-To-Clipboard
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Kopiert: "${textToCopy}"`);
        }).catch(() => {
          showToast('Konnte nicht kopiert werden');
        });
      }
    });
  });

  // 6. Skill Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 7. Live Editor Mode (Inhalte direkt bearbeiten & im Browser speichern)
  const editToggle = document.getElementById('edit-mode-toggle');
  const saveBtn = document.getElementById('save-edits-btn');
  const resetBtn = document.getElementById('reset-edits-btn');

  // Load saved content if exists
  const savedCvData = localStorage.getItem('ehsan-cv-custom-content');
  if (savedCvData) {
    try {
      const parsed = JSON.parse(savedCvData);
      Object.keys(parsed).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = parsed[id];
      });
    } catch (e) {
      console.warn('Fehler beim Laden gespeicherter CV-Daten', e);
    }
  }

  if (editToggle) {
    editToggle.addEventListener('change', () => {
      const isEditing = editToggle.checked;
      document.body.classList.toggle('editable-active', isEditing);
      
      const editableElements = document.querySelectorAll('[data-editable="true"]');
      editableElements.forEach(el => {
        el.contentEditable = isEditing ? 'true' : 'false';
      });

      if (saveBtn) saveBtn.style.display = isEditing ? 'inline-flex' : 'none';
      if (resetBtn) resetBtn.style.display = isEditing ? 'inline-flex' : 'none';

      if (isEditing) {
        showToast('Bearbeitungsmodus aktiv: Klicke auf Texte zum Ändern!');
      } else {
        showToast('Bearbeitungsmodus beendet');
      }
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const editableElements = document.querySelectorAll('[data-editable="true"]');
      const dataToSave = {};
      editableElements.forEach(el => {
        if (el.id) {
          dataToSave[el.id] = el.innerHTML;
        }
      });
      localStorage.setItem('ehsan-cv-custom-content', JSON.stringify(dataToSave));
      showToast('Änderungen im Browser gespeichert!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Möchtest du wirklich alle Änderungen auf den Originalzustand zurücksetzen?')) {
        localStorage.removeItem('ehsan-cv-custom-content');
        location.reload();
      }
    });
  }

  // 8. Toast Helper
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('live-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'live-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
