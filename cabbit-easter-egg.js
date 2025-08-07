class CabbitEasterEgg {
    constructor() {
        this.clickCount = 0;
        this.cabbits = [];
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.performanceTimer = 0;
        this.lastFrameTime = 0;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const findMeSection = document.getElementById('social');
            if (findMeSection) {
                findMeSection.addEventListener('click', () => this.handleFindMeClick());
            }

            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        });
    }

    handleFindMeClick() {
        this.clickCount++;
        console.log(`Find me clicked: ${this.clickCount}/10`);
        
        if (this.clickCount >= 10 && !this.isActive) {
            this.spawnCabbit();
            this.isActive = true;
        }
    }

    spawnCabbit() {
        const cabbit = document.createElement('div');
        cabbit.className = 'cabbit';
        cabbit.style.cssText = `
            position: fixed;
            width: 64px;
            height: 64px;
            background-image: url('cabbit.png');
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 10000;
            transition: none;
        `;

        const startX = Math.random() * (window.innerWidth - 64);
        const startY = Math.random() * (window.innerHeight - 64);
        
        cabbit.style.left = startX + 'px';
        cabbit.style.top = startY + 'px';

        document.body.appendChild(cabbit);

        const cabbitObj = {
            element: cabbit,
            x: startX,
            y: startY,
            targetX: this.mouseX,
            targetY: this.mouseY,
            speed: 2,
            state: 'chasing',
            splitTimer: 0,
            splitDuration: 2000,
            splitDistance: 100,
            splitAngle: Math.random() * Math.PI * 2
        };

        this.cabbits.push(cabbitObj);
        this.animateCabbits();
    }

    animateCabbits() {
        if (this.cabbits.length === 0) return;

        const currentTime = Date.now();
        if (this.lastFrameTime > 0) {
            const frameTime = currentTime - this.lastFrameTime;
            if (frameTime > 50) {
                this.performanceTimer++;
            } else {
                this.performanceTimer = Math.max(0, this.performanceTimer - 1);
            }
        }
        this.lastFrameTime = currentTime;

        if (this.performanceTimer > 10) {
            this.summonOwlcat();
            return;
        }

        this.cabbits.forEach((cabbit, index) => {
            this.updateCabbit(cabbit, index);
        });

        if (currentTime - this.lastFrameTime >= 16) {
            requestAnimationFrame(() => this.animateCabbits());
        } else {
            setTimeout(() => this.animateCabbits(), 16);
        }
    }

    updateCabbit(cabbit, index) {
        const dx = cabbit.targetX - cabbit.x;
        const dy = cabbit.targetY - cabbit.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        switch (cabbit.state) {
            case 'chasing':
                if (distance > 5) {
                    cabbit.x += (dx / distance) * cabbit.speed;
                    cabbit.y += (dy / distance) * cabbit.speed;
                } else {
                    cabbit.state = 'splitting';
                    cabbit.splitTimer = Date.now();
                    this.splitCabbit(cabbit);
                }
                break;

            case 'splitting':
                const splitElapsed = Date.now() - cabbit.splitTimer;
                if (splitElapsed < cabbit.splitDuration) {
                    const progress = splitElapsed / cabbit.splitDuration;
                    const radius = 50 + Math.sin(progress * Math.PI) * 30;
                    const angle = cabbit.splitAngle + progress * Math.PI * 2;
                    
                    cabbit.x = this.mouseX + Math.cos(angle) * radius;
                    cabbit.y = this.mouseY + Math.sin(angle) * radius;
                } else {
                    cabbit.state = 'returning';
                }
                break;

            case 'returning':
                if (distance > 5) {
                    cabbit.x += (dx / distance) * cabbit.speed;
                    cabbit.y += (dy / distance) * cabbit.speed;
                } else {
                    cabbit.state = 'chasing';
                }
                break;
        }

        cabbit.targetX = this.mouseX;
        cabbit.targetY = this.mouseY;

        cabbit.element.style.left = cabbit.x + 'px';
        cabbit.element.style.top = cabbit.y + 'px';

        this.keepCabbitOnScreen(cabbit);
    }

    splitCabbit(originalCabbit) {
        const newCabbit = document.createElement('div');
        newCabbit.className = 'cabbit';
        newCabbit.style.cssText = `
            position: fixed;
            width: 64px;
            height: 64px;
            background-image: url('cabbit.png');
            background-size: contain;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 10000;
            transition: none;
        `;

        document.body.appendChild(newCabbit);

        const splitCabbit = {
            element: newCabbit,
            x: originalCabbit.x,
            y: originalCabbit.y,
            targetX: this.mouseX,
            targetY: this.mouseY,
            speed: 2,
            state: 'splitting',
            splitTimer: Date.now(),
            splitDuration: 2000,
            splitDistance: 100,
            splitAngle: originalCabbit.splitAngle + Math.PI
        };

        this.cabbits.push(splitCabbit);
    }

    keepCabbitOnScreen(cabbit) {
        const maxX = window.innerWidth - 64;
        const maxY = window.innerHeight - 64;

        if (cabbit.x < 0) cabbit.x = 0;
        if (cabbit.x > maxX) cabbit.x = maxX;
        if (cabbit.y < 0) cabbit.y = 0;
        if (cabbit.y > maxY) cabbit.y = maxY;
    }

    summonOwlcat() {
        const bounds = this.calculateCabbitBounds();
        if (!bounds) {
            this.cleanupCabbits();
            return;
        }

        const owlcat = document.createElement('div');
        owlcat.className = 'owlcat';
        owlcat.style.cssText = `
            position: fixed;
            width: ${bounds.width}px;
            height: ${bounds.height}px;
            background-image: url('owlcat.png');
            background-size: cover;
            background-repeat: no-repeat;
            pointer-events: none;
            z-index: 10001;
            transition: none;
        `;

        owlcat.style.left = '-128px';
        owlcat.style.top = bounds.top + 'px';

        document.body.appendChild(owlcat);

        let swoopProgress = 0;
        const swoopDuration = 2000;
        const swoopStart = Date.now();

        const animateOwlcat = () => {
            const elapsed = Date.now() - swoopStart;
            swoopProgress = elapsed / swoopDuration;

            if (swoopProgress < 1) {
                const x = -128 + (window.innerWidth + 128) * swoopProgress;
                
                owlcat.style.left = x + 'px';

                this.checkCabbitCollisions(x, bounds.width);

                requestAnimationFrame(animateOwlcat);
            } else {
                this.cleanupCabbits();
                document.body.removeChild(owlcat);
            }
        };

        animateOwlcat();
    }

    calculateCabbitBounds() {
        if (this.cabbits.length === 0) return null;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        this.cabbits.forEach(cabbit => {
            minX = Math.min(minX, cabbit.x);
            maxX = Math.max(maxX, cabbit.x + 64);
            minY = Math.min(minY, cabbit.y);
            maxY = Math.max(maxY, cabbit.y + 64);
        });

        return {
            left: minX,
            right: maxX,
            top: minY,
            bottom: maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    checkCabbitCollisions(owlcatX, owlcatWidth) {
        const owlcatRight = owlcatX + owlcatWidth;
        
        this.cabbits = this.cabbits.filter(cabbit => {
            const cabbitRight = cabbit.x + 64;
            
            if (owlcatRight > cabbit.x && owlcatX < cabbitRight) {
                if (cabbit.element && cabbit.element.parentNode) {
                    cabbit.element.parentNode.removeChild(cabbit.element);
                }
                return false;
            }
            return true;
        });
    }

    cleanupCabbits() {
        
        this.cabbits.forEach(cabbit => {
            if (cabbit.element && cabbit.element.parentNode) {
                cabbit.element.parentNode.removeChild(cabbit.element);
            }
        });

        this.cabbits = [];
        this.isActive = false;
        this.performanceTimer = 0;
        this.lastFrameTime = 0;
    }

    reset() {
        this.clickCount = 0;
        this.isActive = false;
        this.cabbits.forEach(cabbit => {
            if (cabbit.element && cabbit.element.parentNode) {
                cabbit.element.parentNode.removeChild(cabbit.element);
            }
        });
        this.cabbits = [];
        this.performanceTimer = 0;
        this.lastFrameTime = 0;
    }
}

const cabbitEasterEgg = new CabbitEasterEgg();

window.cabbitEasterEgg = cabbitEasterEgg;
