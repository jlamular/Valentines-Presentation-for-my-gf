const cube = document.getElementById('cube');
const scene = document.getElementById('scene');
const cubeView = document.getElementById('cube-view');
const cinemaView = document.getElementById('cinema-view');
const video = document.getElementById('cinema-video');
const bgMusic = document.getElementById('bg-music');
bgMusic.addEventListener('ended', () => {
  bgMusic.currentTime = 29;
  bgMusic.play().catch(() => {});
});
const entrancePage = document.getElementById('entrance-page');
const entranceName = document.getElementById('entrance-name');
const entranceSubmit = document.getElementById('entrance-submit');
const entranceForm = document.getElementById('entrance-form');
const entranceWrong = document.getElementById('entrance-wrong');
const tryAgainBtn = document.getElementById('try-again-btn');

const CORRECT_NAME = 'jssmy';

entranceSubmit.addEventListener('click', checkEntranceName);
entranceName.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkEntranceName(); });
tryAgainBtn.addEventListener('click', () => {
  entranceWrong.classList.remove('show');
  entranceForm.classList.remove('show');
  entranceName.value = '';
  entranceName.focus();
});

const TYPEWRITER_MESSAGE = `It's like twice in a leap year I surprise you,\nAnd a whole year before I get to see you,\nEvery month, we can't escape a little quarrel,\nAnd every week, there's always a fight, but...\nEvery day, I wake up to love you`;

const typewriterPage = document.getElementById('typewriter-page');
const typewriterOutput = document.getElementById('typewriter-output');

function checkEntranceName() {
  const name = (entranceName.value || '').trim().toLowerCase();
  if (name === CORRECT_NAME.toLowerCase()) {
    entrancePage.classList.add('hidden');
    setTimeout(() => { entrancePage.style.display = 'none'; }, 500);
    bgMusic.currentTime = 29;
    bgMusic.play().catch(() => {});
    typewriterPage.classList.add('show');
    runTypewriter();
  } else {
    entranceForm.classList.add('show');
    entranceWrong.classList.add('show');
  }
}

function runTypewriter() {
  typewriterOutput.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  typewriterOutput.appendChild(cursor);
  let i = 0;
  function type() {
    if (i >= TYPEWRITER_MESSAGE.length) {
      cursor.remove();
      typewriterOutput.appendChild(document.createTextNode(' 💕'));
      setTimeout(showCubeAfterMessage, 2200);
      return;
    }
    const char = TYPEWRITER_MESSAGE[i];
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === '\n' ? '\n' : char;
    typewriterOutput.insertBefore(span, cursor);
    i++;
    const delay = char === '\n' ? 650 : (char === ',' || char === '.' ? 420 : 165);
    setTimeout(type, delay);
  }
  setTimeout(type, 400);
}

function showCubeAfterMessage() {
  typewriterPage.classList.add('fade-out');
  setTimeout(() => {
    typewriterPage.classList.remove('show', 'fade-out');
    // Cube: maliit muna then lalaki (smooth scale-in)
    scene.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    scene.style.transform = 'scale(0.12)';
    cubeView.classList.remove('entrance-hidden');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateZoom();
      });
    });
    setTimeout(() => {
      scene.style.transition = '';
    }, 750);
  }, 1000);
}

//wala ng rename
const vidPlaylist = [
  'Vid/351414818_9722770524407171_2047449945446737998_n.mp4',
  'Vid/351421710_5742560789181652_9009582178636285897_n.mp4'
];
let currentVidIndex = 0;

let rotX = -20, rotY = 30;
let isDragging = false;
let prevX = 0, prevY = 0;
let autoRotate = true;
let rafId = null;
let resumeTimeout = null;

// Zoom state
let zoomLevel = 1.0;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_SPEED = 0.1;

let pendingRotX = rotX;
let pendingRotY = rotY;
let rafScheduled = false;

function scheduleRender() {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    cube.style.transform = `rotateX(${pendingRotX}deg) rotateY(${pendingRotY}deg) translateZ(0)`;
    rafScheduled = false;
  });
}

function updateZoom() {
  scene.style.transform = `scale(${zoomLevel})`;
}


function startAuto() {
  autoRotate = true;
  function loop() {
    if (!autoRotate) return;
    pendingRotY += 0.25;
    scheduleRender();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

function stopAuto() {
  autoRotate = false;
  if (rafId) { 
    cancelAnimationFrame(rafId); 
    rafId = null; 
  }
  if (resumeTimeout) {
    clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }
}

function scheduleAutoResume() {
  if (resumeTimeout) clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => {
    rotX = pendingRotX;
    rotY = pendingRotY;
    startAuto();
  }, 500);
}

// ─── CLICK DETECTION ───
let clickTimeout = null;
let clickCount = 0;

scene.addEventListener('click', (e) => {
  if (isDragging) return; 

  clickCount++;

  if (clickCount === 1) {
    // First click ----------------------  wait to see if there's a second click
    clickTimeout = setTimeout(() => {

      cube.style.setProperty('--rotX', `${pendingRotX}deg`);
      cube.style.setProperty('--rotY', `${pendingRotY}deg`);
      
      cube.classList.remove('wiggling');
      void cube.offsetWidth; // reflow
      cube.classList.add('wiggling');
      
    
      setTimeout(() => {
        cube.classList.remove('wiggling');
       
        rotX = pendingRotX;
        rotY = pendingRotY;
       
        scheduleRender();
        
        startAuto();
      }, 600);
      
      clickCount = 0;
    }, 300); // Wait 300ms for potential double click
  } else if (clickCount === 2) {
    
    clearTimeout(clickTimeout);
    clickCount = 0;
    explodeCubeThenOpenCinema();
  }
});

function explodeCubeThenOpenCinema() {
  stopAuto();
  
  cube.style.setProperty('--rotX', `${pendingRotX}deg`);
  cube.style.setProperty('--rotY', `${pendingRotY}deg`);
  
  
  scene.classList.add('explode-bubwelo');
  
  setTimeout(() => {
  
    cube.classList.add('explode-wiggle');
    
    setTimeout(() => {
      cube.classList.remove('explode-wiggle');
      scene.classList.remove('explode-bubwelo');
      updateZoom();  
      // 3) BOOM ----- explode
      cube.classList.add('exploding');
      
      setTimeout(() => {
        cinemaView.classList.add('active');
      }, 350);
      
      setTimeout(() => {
        cubeView.classList.add('hidden');
        resetExplosion();
        playCinemaVideo();
      }, 1250);
    }, 400);  // wiggle duration
  }, 450);    // bubwelo duration
}

function resetExplosion() {
  cube.classList.remove('exploding', 'explode-wiggle');
  scene.classList.remove('explode-bubwelo');
  updateZoom();
}

function openCinema() {
  stopAuto();
  cinemaView.classList.add('active');
  cubeView.classList.add('hidden');
  playCinemaVideo();
}

function playCinemaVideo() {
  video.src = vidPlaylist[currentVidIndex];
  video.play().catch(err => console.log('Video play:', err));
}

video.addEventListener('ended', () => {
  currentVidIndex++;
  if (currentVidIndex < vidPlaylist.length) {
    video.src = vidPlaylist[currentVidIndex];
    video.play().catch(err => console.log('Video play:', err));
  } else {
    // Tapos na dalawang video – balik sa 3D box
    currentVidIndex = 0;
    closeCinema();
  }
});

function closeCinema() {
  cinemaView.classList.remove('active');
  setTimeout(() => {
    cubeView.classList.remove('hidden');
    cube.classList.remove('opening');
    resetExplosion();
    video.pause();
    pendingRotX = -20;
    pendingRotY = 30;
    scheduleRender();
    setTimeout(() => startAuto(), 100);
  }, 300);
}



let dragStartX = 0, dragStartY = 0;

scene.addEventListener('mousedown', e => {
  isDragging = false;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  prevX = e.clientX;
  prevY = e.clientY;
  stopAuto();
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (prevX !== 0 && prevY !== 0) {
    const dx = Math.abs(e.clientX - dragStartX);
    const dy = Math.abs(e.clientY - dragStartY);
    
    if (dx > 5 || dy > 5) {
      isDragging = true;
    }
    
    if (isDragging) {
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      pendingRotY += deltaX * 0.45;
      pendingRotX -= deltaY * 0.45;
      pendingRotX = Math.max(-85, Math.min(85, pendingRotX));
      prevX = e.clientX;
      prevY = e.clientY;
      scheduleRender();
    }
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    scheduleAutoResume();
  }
  prevX = 0;
  prevY = 0;
});

// ─── TOUCH SUPPORT ───
let initialPinchDistance = null;
let initialZoomLevel = 1;

scene.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    isDragging = false;
    stopAuto();
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    initialPinchDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    initialZoomLevel = zoomLevel;
    e.preventDefault();
  } else if (e.touches.length === 1) {
    isDragging = true;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    stopAuto();
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (e.touches.length === 2 && initialPinchDistance) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const scale = currentDistance / initialPinchDistance;
    zoomLevel = initialZoomLevel * scale;
    zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel));
    updateZoom();
    e.preventDefault();
  } else if (isDragging && e.touches.length === 1) {
    const dx = e.touches[0].clientX - prevX;
    const dy = e.touches[0].clientY - prevY;
    pendingRotY += dx * 0.45;
    pendingRotX -= dy * 0.45;
    pendingRotX = Math.max(-85, Math.min(85, pendingRotX));
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    scheduleRender();
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchend', e => {
  if (e.touches.length < 2) {
    initialPinchDistance = null;
  }
  if (e.touches.length === 0) {
    if (isDragging) {
      isDragging = false;
    }
    scheduleAutoResume();
  }
});

// ─── MOUSE WHEEL ZOOM ───
scene.addEventListener('wheel', e => {
  e.preventDefault();
  
  if (e.deltaY < 0) {
    zoomLevel = Math.min(zoomLevel + ZOOM_SPEED, MAX_ZOOM);
  } else {
    zoomLevel = Math.max(zoomLevel - ZOOM_SPEED, MIN_ZOOM);
  }
  
  updateZoom();
}, { passive: false });


const totalImages = 24;
const imageFolder = 'Pic/';
const allImages = document.querySelectorAll('.cell img');

function getRandomImageNumber() {
  return Math.floor(Math.random() * totalImages) + 1;
}

function updateSingleImage(img) {
  img.style.opacity = '0';
  setTimeout(() => {
    const randomNum = getRandomImageNumber();
    img.src = `${imageFolder}${randomNum}.jpg`;
    setTimeout(() => {
      img.style.opacity = '1';
    }, 50);
  }, 400);
}

const timingIntervals = [2000, 2500, 3000, 3500, 4000, 4500, 2200, 2800, 3200, 3800, 4200, 2600, 3400, 3600, 4400, 2400, 2700, 3100, 3300, 3900, 4100, 2900, 3700, 4300];

allImages.forEach(img => {
  const randomNum = getRandomImageNumber();
  img.src = `${imageFolder}${randomNum}.jpg`;
  img.style.opacity = '1';
});

allImages.forEach((img, index) => {
  const interval = timingIntervals[index];
  setInterval(() => {
    updateSingleImage(img);
  }, interval);
});


scheduleRender();
startAuto();


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cinemaView.classList.contains('active')) {
    closeCinema();
  }
});
