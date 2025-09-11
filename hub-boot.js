// ===== Hub Boot JS Avanzado con Glitch Mejorado =====

document.addEventListener("DOMContentLoaded", () => {

  // Datos piloto y unidad
  const piloto = sessionStorage.getItem('piloto') || 'Desconocido';
  const unidad = sessionStorage.getItem('unidad') || 'Lázaro';
  document.getElementById('hud-unit-name').textContent = unidad;

  // Elementos DOM
  const bootScreen = document.getElementById('hud-boot-screen');
  const bootLog = document.getElementById('hud-boot-log');
  const progressBar = document.getElementById('hud-progress-bar');

  // Interfaces aleatorias
  const interfaces = ["Geminis", "Altus", "Observer", "Knosos", "Darpa", "Vanguard", "Titanium"];

  // ===== Three.js Boot Background =====
  const canvas = document.getElementById('boot-bg');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.z = 5;

  // Partículas estilo terminal
  const particleCount = 2500;
  const positions = new Float32Array(particleCount * 3);
  for(let i=0;i<particleCount*3;i++) positions[i] = (Math.random()-0.5)*20;
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({color:0x00ff00, size:0.05});
  const pointCloud = new THREE.Points(particlesGeo, particlesMat);
  scene.add(pointCloud);

  function animate3D(){
      pointCloud.rotation.y += 0.0015;
      pointCloud.rotation.x += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate3D);
  }
  animate3D();

  // ===== Boot Lines con errores =====
  let bootLines = [
      `[SISTEMA] Conectando piloto: ${piloto}`,
      `[SISTEMA] Asignando unidad: ${unidad}`,
      `[SISTEMA] Inicializando interfaz: ${interfaces[Math.floor(Math.random()*interfaces.length)]}`,
      `[SISTEMA] Cargando sistemas internos...`,
      `[SISTEMA] Verificando integridad...`,
      `[SISTEMA] Todos los sistemas en línea`
  ];

  // Probabilidad de error 30%
  bootLines = bootLines.map(line => ({text:line, error: Math.random()<0.3}));

  let currentLine = 0;
  let charIndex = 0;

  function typeBootLine(speed=35){
      if(currentLine < bootLines.length){
          const lineObj = bootLines[currentLine];
          const line = lineObj.text;
          const isError = lineObj.error;

          if(charIndex < line.length){
              const span = document.createElement('span');
              span.textContent = line[charIndex];
              span.style.color = isError ? '#ff3f3f' : '#00ff00';
              bootLog.appendChild(span);

              // Glitch efecto para errores
              if(isError){
                  gsap.to(span, {
                      x: "+=" + (Math.random()*2-1) + "px",
                      y: "+=" + (Math.random()*2-1) + "px",
                      duration: 0.05,
                      repeat: 3,
                      yoyo:true,
                      ease: "power1.inOut"
                  });
              }

              charIndex++;
              setTimeout(typeBootLine, speed + Math.random()*15);
          } else {
              if(isError){
                  // Parpadeo rápido en todo el mensaje
                  const lastSpan = bootLog.lastChild;
                  gsap.to(lastSpan, {opacity:0, duration:0.1, repeat:5, yoyo:true});
                  
                  setTimeout(()=>{
                      lastSpan.style.color='#00ff00';
                      lastSpan.textContent += ' ✔️';
                      bootLog.innerHTML += '\n';
                      currentLine++;
                      charIndex = 0;
                      updateProgress(currentLine/bootLines.length);
                      setTimeout(typeBootLine, 300);
                  },900);
              } else {
                  bootLog.innerHTML += '\n';
                  currentLine++;
                  charIndex=0;
                  updateProgress(currentLine/bootLines.length);
                  setTimeout(typeBootLine,300);
              }
          }
          bootLog.scrollTop = bootLog.scrollHeight;
      } else {
          // Fin boot -> fade out
          setTimeout(()=>{
              gsap.to(bootScreen, {opacity:0, duration:0.7, onComplete:()=> bootScreen.style.display='none'});
          },1000);
      }
  }

  function updateProgress(percent){
      gsap.to(progressBar, {width:`${percent*100}%`, duration:0.4, ease:"power1.out"});
  }

  // Iniciar boot
  typeBootLine();

  // ===== Reloj HUD =====
  function updateClock(){
      const clockElem = document.getElementById('hud-clock');
      const now = new Date();
      clockElem.textContent = now.toLocaleTimeString('es-AR');
  }
  setInterval(updateClock,1000);
  updateClock();
});
