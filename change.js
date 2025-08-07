const asciiArt = `

                   ..-**=.        .:=#*-.                                                    ..-**=.          .=%@@@@@@+:
                  .:*@@@%.       .-#@@@#.                                                   .:*@@@%-         :#@@@#-.-+#-
    ..:====-.. .:-=*@@+@@====:.:==#@%+@@====:.   .:-===-:..               .-==-:.     .-==-==*@@*#@+===-.   .*@@:*@@@@@#-
  .-#@@@@@@@@#-:*@@@%=.*@@@@@#:*@@@%-.#@@@@@*: .=%@@@@@@@@+:              -*@@@+.    .+@@@#@@@%=.+@@@@@#-   .%@-=@@-.-=-.
 .=@@@+:==:+@@@:**==+-.=+===*#.*+=++:.++===*#:.+@@%--=-:#@@#:             -%%*@%:+%%+:%@*#-+==+-.=+===+#=-#@@@%:=@@@@@%=.
 :%@*:+=..=+:*@#=%@@@+.%@@@@@*:+@@@@=:@@@@@@+.=@@+-+: :+=-%@+.            :@@.%@=@@@@+@@:@%@@@@+.*@@@@@*:=*:.++.-+=. :+=.
.=@#::=*##+---@@: .+@*.@@.       .*@+:@@.    .#@+.-+###=:-+@*.            .%@-#@#@--@%@%+@#..+@* %@-     -#@@@%:=@@@@@%=.
.+@*.-#@@@@@@@@#. .+@*.@@:       .*@+:@@.    .%@-:+%@@@@@@@@+.  .=%@@#=.  .*@++##-++-%#+#@+..+@*.%@=        :@@:+@#.     
.-@@-=*=:..:::+-. .=@#.%@@@@%+:  .*@*.@@@@@%+.*@#.+*-:.:::-+:. .=@@@@@@-.  -@%:==+@@+=+:%@- .=@#.*@@@@%*:   :@@:+@#.     
 :*@@#.%@@@@#+*-  .-@@%.#@@%**:  .=@@#:%@@#**:-%@@+=@@@@@**+.  .=@#:-#@=.  :@@::=@%%@-:-@%: .-%@%:*@@%**-   :@@:+@#.     
  :+@@@@@@%@@@*:   .=@@@@@@@@*:   :+@@@@@@@@+..:*@@@@@%@@@@+.  .-%@@@@%-.  .#@@@@@=+@@@@@*.  .=%@@@@@@@#:   .#@@@@+.     
    .-*@@@@@#=..    .:+%@@@%+:     .:+@@@@#=.   ..=#@@@@@*-.    .-*@@*:.    -#@@@+.:+@@@#-.    .=%@@@%+:.   .=%@@#-.
    
    
                          @                     @@@@                     @                          
                           #@@@@@@@      @@@@@@@@@@@@@@@@@@      @@@@@@@@@                          
                           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                           
                           @%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                           
                            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                            
                            @%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                            
                             %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                            
                            @@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                             
                        @@@@@@%#%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                             
                       @@     @*@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                              
                      @@      @#@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                              
                      @@      @@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                              
                      @@      @*@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                              
                       @@     @%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                              
                        @@   @@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                         @@@@@ @%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               
                      @@@@ @@@  @@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@                                
                    @@@      @@@ @@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@                                 
                   @@         @@@@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@                                  
                  @@@           @@@ @@@@%%@@@@@@@@@@@@@@@@@@@@@@                                    
                  @@              @@@ @@@@@@@@@@@@@@@@@@@@@@@@                                      
                  @@                @@@@ @@@@@@@@@@@@@@@@@@                                         
                   @@               @@@@@       @@@@                                                
                    @@@          @@@@   @@@                                                         
                      @@@@@@@@@@@@        @@@                                                       `;

const symbols = ['@', '#', '%', '&', '*', '+', '=', '$', '!', '?', '~'];
const animationSpeed = 150;
const fadeSpeed = 50;

let displayElement = null;
let currentIndex = 0;
let animationInterval = null;
let isAnimating = false;

const symbolMap = new Map();
symbols.forEach((symbol, index) => {
    symbolMap.set(symbol, index);
});

function initAnimation() {
    try {
        displayElement = document.querySelector('.ascii');
        if (!displayElement) {
            console.warn('ASCII art container not found');
            return;
        }
        
        startAnimation();
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        displayElement.style.opacity = '0';
        setTimeout(() => {
            displayElement.style.transition = 'opacity 1s ease-in-out';
            displayElement.style.opacity = '1';
        }, 100);
        
    } catch (error) {
        console.error('Error initializing ASCII animation:', error);
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        stopAnimation();
    } else {
        startAnimation();
    }
}

function startAnimation() {
    if (animationInterval || isAnimating) return;
    
    isAnimating = true;
    
    cycleSymbols();
    
    let lastTime = 0;
    function animate(currentTime) {
        if (currentTime - lastTime >= animationSpeed) {
            cycleSymbols();
            lastTime = currentTime;
        }
        animationInterval = requestAnimationFrame(animate);
    }
    
    animationInterval = requestAnimationFrame(animate);
}

function stopAnimation() {
    if (animationInterval) {
        cancelAnimationFrame(animationInterval);
        animationInterval = null;
    }
    isAnimating = false;
}

function cycleSymbols() {
    if (!displayElement) return;
    
    try {
        const transformedArt = asciiArt.split('').map(char => {
            if (symbolMap.has(char)) {
                const symbolIndex = symbolMap.get(char);
                return symbols[(currentIndex + symbolIndex) % symbols.length];
            }
            return char;
        }).join('');
        
        displayElement.innerHTML = `<pre>${transformedArt}</pre>`;
        currentIndex = (currentIndex + 1) % symbols.length;
        
    } catch (error) {
        console.error('Error updating ASCII art:', error);
        stopAnimation();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
} else {
    initAnimation();
}
