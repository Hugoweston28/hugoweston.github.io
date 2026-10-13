const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const sceneMap = {
  hero: {
    image: 'url("scene-1.svg")',
    position: 'center center',
    opacity: 0.68,
    scale: 1.1,
    tilt: '0deg'
  },
  about: {
    image: 'url("scene-2.svg")',
    position: 'center center',
    opacity: 0.62,
    scale: 1.15,
    tilt: '-5deg'
  },
  world: {
    image: 'url("scene-3.svg")',
    position: 'center center',
    opacity: 0.6,
    scale: 1.18,
    tilt: '4deg'
  },
  journey: {
    image: 'url("scene-4.svg")',
    position: 'center center',
    opacity: 0.58,
    scale: 1.2,
    tilt: '-6deg'
  },
  projects: {
    image: 'url("scene-5.svg")',
    position: 'center center',
    opacity: 0.56,
    scale: 1.25,
    tilt: '5deg'
  },
  hobbies: {
    image: 'url("scene-6.svg")',
    position: 'center center',
    opacity: 0.6,
    scale: 1.18,
    tilt: '-4deg'
  },
  contact: {
    image: 'url("scene-1.svg")',
    position: 'center center',
    opacity: 0.7,
    scale: 1.12,
    tilt: '2deg'
  }
};

const applyScene = (key) => {
  const scene = sceneMap[key] || sceneMap.hero;
  document.documentElement.style.setProperty('--scene-image', scene.image);
  document.documentElement.style.setProperty('--scene-position', scene.position);
  document.documentElement.style.setProperty('--scene-opacity', String(scene.opacity));
  document.documentElement.style.setProperty('--scene-scale', String(scene.scale));
  document.documentElement.style.setProperty('--scene-tilt', scene.tilt);
};

const scenes = document.querySelectorAll('[data-scene]');
const sceneObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      applyScene(visibleEntry.target.dataset.scene);
    }
  },
  {
    threshold: [0.25, 0.45, 0.7],
    rootMargin: '0px 0px -8% 0px'
  }
);

scenes.forEach((section) => sceneObserver.observe(section));
applyScene('hero');

const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealItems.forEach((item) => observer.observe(item));
