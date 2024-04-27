const timer = {
    pomodoro: 60,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  const buttonSound = new Audio('button-sound.mp3');
  const mainButton = document.getElementById('js-btn');
  mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer();
    }   else {
      stopTimer();
    }
  });
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);

        switch (timer.mode) {
            case 'pomodoro':
              if (timer.sessions % timer.longBreakInterval === 0) {
                switchMode('longBreak');
              } else {
                switchMode('shortBreak');
              }
              break;
            default:
              switchMode('pomodoro');
          }
    
          startTimer();

      }
    }, 1000);
    document.querySelector(`[data-sound="${timer.mode}"]`).play();

  }
  function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');

  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
  document.title = `${minutes}:${seconds} — ${text}`;
  
  const progress = document.getElementById('js-progress');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
    .getElementById('js-progress')
    .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }
  

  
  document.addEventListener('DOMContentLoaded', () => {
    // Let's check if the browser supports notifications
    if ('Notification' in window) {
      // If notification permissions been granted or denied
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        // ask the user for permission
        Notification.requestPermission().then(function(permission) {
          // If permission is granted
          if (permission === 'granted') {
            // Create a new notification
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
    switchMode('pomodoro');
    if (Notification.permission === 'granted') {
      const text =
        timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
      new Notification(text);
    }
    
  });
// Background images


// Select all images in the dropdown
const images = document.querySelectorAll('.dropdown-content img');

// Function to change background image
function changeBackground(imageUrl) {
    document.body.style.backgroundImage = "url('" + imageUrl + "')";
}

// Add click event listener to each image
images.forEach(image => {
    image.addEventListener('click', function() {
        // Get the URL of the clicked image
        const imageUrl = this.getAttribute('src');
        // Change the background image of the body
        changeBackground(imageUrl);
    });
});
function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var files = event.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        if (file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.backgroundImage = 'url(' + e.target.result + ')';
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please drop an image file.");
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
  const dropdownButton = document.querySelector('.background-button');
  const dropdownContent = document.querySelector('.dropdown-content');
  const dropArea = document.getElementById('dropArea');

  dropdownButton.addEventListener('click', function () {
      dropdownContent.classList.toggle('active'); // Toggle the 'active' class
      // Clear the timeout if it exists
      clearTimeout(autoCloseTimeout);
  });

  dropdownContent.addEventListener('click', function (event) {
      if (event.target.tagName === 'IMG') {
          dropdownContent.classList.remove('active');
          // Save selected background image URL to localStorage
          localStorage.setItem('selectedBgImage', event.target.src);
          // Apply the selected background image to body and dropArea
          document.body.style.backgroundImage = `url(${event.target.src})`;
          dropArea.style.backgroundImage = `url(${event.target.src})`;
      }
  });

  let autoCloseTimeout; // Variable to hold the timeout reference

  // Function to automatically close the dropdown after 5 seconds
  function closeDropdownAfterTimeout() {
      autoCloseTimeout = setTimeout(function () {
          dropdownContent.classList.remove('active');
      }, 4000); // Remove 'active' class after 5 seconds
  }

  // Call the function initially
  closeDropdownAfterTimeout();

  // Reset the timeout whenever the dropdown button is clicked
  dropdownButton.addEventListener('click', function () {
      clearTimeout(autoCloseTimeout); // Clear the previous timeout
      closeDropdownAfterTimeout(); // Set a new timeout
  });

  // Retrieve and apply the selected background image from localStorage on page load
  const selectedBgImage = localStorage.getItem('selectedBgImage');
  if (selectedBgImage) {
      document.body.style.backgroundImage = `url(${selectedBgImage})`;
      dropArea.style.backgroundImage = `url(${selectedBgImage})`;
  }
});

  