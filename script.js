// ============================================
//   VÒNG QUAY LÌ XÌ TẾT - ENHANCED SCRIPT
// ============================================

// --- TẠO SAO TRÊN NỀN ---
function createBgStars() {
    const container = document.getElementById('bgStars');
    if (!container) return;
    const count = 60;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'bg-star';
        const size = Math.random() * 4 + 2;
        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top:  ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 2 + 1.5}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(star);
    }
}

// --- TẠO HOA ANH ĐÀO RƠI ---
const PETALS = ['🌸', '🌺', '✿', '❀', '🌼'];
function createFallingPetals() {
    const count = 18;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
            const size = Math.random() * 0.8 + 0.7;
            petal.style.cssText = `
                left: ${Math.random() * 100}%;
                font-size: ${size}rem;
                animation-duration: ${Math.random() * 5 + 6}s;
                animation-delay: ${Math.random() * 8}s;
                opacity: ${Math.random() * 0.4 + 0.5};
            `;
            document.body.appendChild(petal);
            // Xoá sau khi animation xong để tránh tràn DOM
            petal.addEventListener('animationiteration', () => {
                petal.style.left = Math.random() * 100 + '%';
            });
        }, i * 300);
    }
}

createBgStars();
createFallingPetals();

// --- CẤU HÌNH PHẦN THƯỞNG ---
    const segments = [
        { text: "10.000đ", color: "#FFCDD2" }, // Hồng nhạt
        { text: "20.000đ", color: "#E1BEE7" }, // Tím nhạt
        { text: "50.000đ", color: "#C5CAE9" }, // Xanh dương nhạt
        { text: "100.000đ", color: "#B2DFDB" }, // Xanh ngọc nhạt
        { text: "200.000đ", color: "#DCEDC8" }, // Xanh lá nhạt
        { text: "500.000đ", color: "#FFF9C4" }, // Vàng nhạt
        { text: "May mắn!", color: "#FFECB3" }, // Cam nhạt
        { text: "Thêm lượt!", color: "#FFE0B2" }  // Cam đậm hơn
    ];

    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const resultDisplay = document.getElementById('resultDisplay');
    const popup = document.getElementById('popup');
    const popupResult = document.getElementById('popupResult');
    const closePopupButton = document.getElementById('closePopup');

    let currentRotation = 0; 
    let isSpinning = false;
    const segmentAngle = 360 / segments.length; 

    // --- HÀM KHỞI TẠO VÒNG QUAY ---
    function initWheel() {
        let gradientString = 'conic-gradient(';
        let currentAngle = 0;

        segments.forEach((segment, index) => {
            gradientString += `${segment.color} ${currentAngle}deg ${currentAngle + segmentAngle}deg`;
            if (index < segments.length - 1) {
                gradientString += ', ';
            }
            
            // 2. Tạo và thêm chữ lên vòng quay (ĐÃ SỬA)
            const textElement = document.createElement('div');
            textElement.className = 'wheel-text';
            
            // Transform 0 độ theo mặc định bắt đầu ở góc 3 giờ.
            // Vì conic-gradient bắt đầu ở góc 12 giờ nên phải trừ đi 90 độ.
            const rotation = currentAngle + (segmentAngle / 2) - 90;
            textElement.style.transform = `rotate(${rotation}deg)`;
            
            textElement.innerText = segment.text;
            wheel.appendChild(textElement);

            currentAngle += segmentAngle;
        });
        gradientString += ')';
        
        wheel.style.background = gradientString;
    }

    // --- HÀM BẮN PHÁO GIẤY (CONFETTI) ---
    function fireConfetti() {
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Bắn burst đầu tiên ngay lập tức
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.55 }, colors: ['#ffeb3b', '#c62828', '#fff', '#fdd835', '#ff5722'], zIndex: 9999 });

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 55 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ffeb3b', '#c62828', '#ff8f00']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ffffff', '#fdd835', '#e91e63']
            }));
        }, 250);
    }

    // --- SPINNING TEXT ANIMATION ---
    const spinningTexts = ['Đang quay...', 'May mắn đây!', 'Sắp ra rồi!', 'Hồi hộp quá!'];
    let spinTextIdx = 0;
    let spinTextInterval = null;

    // --- HÀM XỬ LÝ QUAY ---
    function startSpin() {
        if (isSpinning) return;

        isSpinning = true;
        spinButton.disabled = true;

        // Chạy chữ động trong lúc quay
        spinTextIdx = 0;
        resultDisplay.innerText = spinningTexts[0];
        resultDisplay.style.background = 'linear-gradient(135deg, #c62828, #a31515)';
        spinTextInterval = setInterval(() => {
            spinTextIdx = (spinTextIdx + 1) % spinningTexts.length;
            resultDisplay.innerText = spinningTexts[spinTextIdx];
        }, 700);

        const extraSpins = 360 * 8;
        const randomAngle = Math.floor(Math.random() * 360);
        const targetRotation = currentRotation + extraSpins + randomAngle;

        wheel.style.transform = `rotate(${targetRotation}deg)`;
        currentRotation = targetRotation;
    }

    // --- XỬ LÝ KHI VÒNG QUAY DỪNG LẠI ---
    wheel.addEventListener('transitionend', () => {
        isSpinning = false;
        clearInterval(spinTextInterval);

        const actualDeg = currentRotation % 360;
        const adjustedDeg = (360 - actualDeg) % 360;

        const winningIndex = Math.floor(adjustedDeg / segmentAngle);
        const prize = segments[winningIndex];

        resultDisplay.innerText = `🎉 ${prize.text}`;

        popupResult.innerText = `🎉 ${prize.text} 🎉`;
        popupResult.style.background = 'none';

        // Hiển thị popup sau 1 chút delay để người dùng thấy kết quả
        setTimeout(() => {
            popup.classList.add('show');
            fireConfetti();
        }, 400);
    });

    // --- XỬ LÝ ĐÓNG POPUP ---
    closePopupButton.addEventListener('click', () => {
        popup.classList.remove('show');
        spinButton.disabled = false;
        resultDisplay.innerText = "Chúc bạn may mắn!";
        resultDisplay.style.background = "linear-gradient(135deg, #c62828, #a31515)";
    });

    spinButton.addEventListener('click', startSpin);

    initWheel();