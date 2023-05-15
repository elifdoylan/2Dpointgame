// Nokta sınıfı tanımlaması
class Point {
    constructor(x, y, color, radius = 10) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
    }
}

// Canvas ve context oluşturma
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Canvastaki noktaları saklayacak dizi
let points = [];

// Noktaların alabileceği renkler
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'gray', '#66ff00', '#a35200', '#2e963d', '#eee0b1', '#00cca8']

// Rastgele renk seçimi
let userColor = colors[Math.floor(Math.random() * colors.length)];

// Kullanıcı noktasının oluşturulması
let userPoint = new Point(canvas.width / 2, canvas.height - 50, userColor, 10);

// Noktaların oluşturulması
for (let i = 0; i < 300; i++) {
    // Rastgele x ve y koordinatları (canvas boyutlarına bağlı olarak ayarlanmalıdır)

    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    // if location is too close to userPoint, don't add it
    while ((x == userPoint.x && y == userPoint.y) || (x > userPoint.x - 100 && x < userPoint.x + 100 && y > userPoint.y - 100 && y < userPoint.y + 100)) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
    }

    // Rastgele renk seçimi
    let color = colors[Math.floor(Math.random() * colors.length)];

    // Yeni noktanın oluşturulması ve dizilere eklenmesi
    points.push(new Point(x, y, color));
}

// Mouse hareketlerini izleme ve kullanıcı noktasını güncelleme
canvas.addEventListener('mousemove', event => {
    userPoint.x = event.clientX - canvas.offsetLeft;
    userPoint.y = event.clientY - canvas.offsetTop;
});


let gameState = 'running';
let lastCaptureTime = Date.now();
let score = 0
let scoreBoard = document.getElementById('score');
let timer = 3; 
let timerElement = document.getElementById('time');

setInterval(() => {
    if (gameState === 'running') {
        timer--;
        timerElement.textContent = timer;

        if (timer === -1) {
            gameState = 'over';
            alert("Oyun bitti!");
            document.location.reload();
        }
    }
}, 1000);


function draw() {
    if (gameState === 'over') {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.fillStyle = userPoint.color;
    ctx.beginPath();
    ctx.arc(userPoint.x, userPoint.y, userPoint.radius, 0, 2 * Math.PI);
    ctx.fill();

    points.forEach(point => {
        if (checkCollision(userPoint, point)) {
            if (userPoint.color === point.color) {
                userPoint.color = colors[Math.floor(Math.random() * colors.length)];
                points = points.filter(p => p !== point);
                
                score++; // Skoru arttir 
                scoreBoard.textContent = score; // Skoru guncelle
                
                timer = 3; // Timeri sifirla
                timerElement.textContent = timer; // Timeri guncelle
            } else if (userPoint.color !== point.color) {
                gameState = 'over';
                alert("Game Over!");
                document.location.reload();
            }
        }
    });

    if (gameState !== 'over') {
        requestAnimationFrame(draw);
    }
}
// Çizim fonksiyonunu çağır
draw();

function checkCollision(point1, point2) {
    const distance = Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    return distance < point1.radius + point2.radius;
}