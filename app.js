document.addEventListener('DOMContentLoaded', () => {

    /**
     * Módulo: Lógica de Negócio e Gamificação
     * Gerencia o progresso do usuário e a liberação da oferta.
     */
    const setupGamification = () => {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const planosSection = document.getElementById('planos');
        const vitalicioPlanCard = document.getElementById('vitalicio-plan-card');
        const vitalicioPriceContainer = document.getElementById('vitalicio-price-container');
        const vitalicioCheckoutLink = document.getElementById('vitalicio-checkout-link');

        // !! IMPORTANTE !!
        // Substitua a URL abaixo pelo seu link de checkout da OFERTA SECRETA (preço com desconto).
        const REWARD_CHECKOUT_URL = "URL_DA_SUA_OFERTA_SECRETA_AQUI"; 
        
        let journeyCompleted = false;
        const MAX_POINTS = 100;
        let currentPoints = 0;
        const tasks = {
            activated: { completed: false, points: 30, element: document.getElementById('task-1') },
            testedAim: { completed: false, points: 40, element: document.getElementById('task-2') },
            optimized: { completed: false, points: 30, element: document.getElementById('task-3') }
        };

        const updateGamifiedProgress = () => {
            if (journeyCompleted) return;
            currentPoints = 0;
            if (tasks.activated.completed) currentPoints += tasks.activated.points;
            if (tasks.testedAim.completed) currentPoints += tasks.testedAim.points;
            if (tasks.optimized.completed) currentPoints += tasks.optimized.points;

            const percentage = Math.round((currentPoints / MAX_POINTS) * 100);
            if(progressBar) progressBar.style.width = `${percentage}%`;
            if(progressText) progressText.textContent = `${percentage}%`;

            if (percentage === 100 && !journeyCompleted) {
                journeyCompleted = true;
                setTimeout(() => {
                    if(window.Notiflix) Notiflix.Notify.Success('<strong>RECOMPENSA LIBERADA!</strong> Você desbloqueou a oferta secreta no Plano Vitalício.', { plainText: false, timeout: 5000, fontSize: '16px', width: '320px' });
                    
                    if(vitalicioPlanCard && vitalicioPriceContainer && vitalicioCheckoutLink) {
                        vitalicioPriceContainer.style.opacity = '0';
                        
                        setTimeout(() => {
                            vitalicioPriceContainer.innerHTML = `
                                <p class="text-xl text-red-400/70 line-through">De R$39,97</p>
                                <p class="font-teko text-5xl sm:text-6xl font-bold text-white mb-6">R$14<span class="text-3xl text-red-300">,97</span></p>
                            `;
                            vitalicioPriceContainer.style.opacity = '1';

                            // ATUALIZA O LINK DE CHECKOUT PARA O DA OFERTA SECRETA
                            vitalicioCheckoutLink.href = REWARD_CHECKOUT_URL;
                            // Atualiza o valor do plano no data attribute para o tracking correto
                            vitalicioPlanCard.dataset.planValue = "14.97";

                        }, 500);

                        vitalicioPlanCard.classList.remove('border-red-500', 'pulse-glow');
                        vitalicioPlanCard.classList.add('border-yellow-400');
                        vitalicioPlanCard.style.boxShadow = '0 0 40px rgba(250, 204, 21, 0.5)';
                    }
                    if(planosSection) planosSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        };

        window.completeTask = (taskName) => {
            if (journeyCompleted || !tasks[taskName] || tasks[taskName].completed) return;
            tasks[taskName].completed = true;
            
            const taskElement = tasks[taskName].element;
            if (taskElement) {
                taskElement.classList.remove('text-gray-500');
                taskElement.classList.add('text-green-400');
                taskElement.querySelector('i').classList.replace('far', 'fas');
            }

            let achievementText = '';
            if (taskName === 'activated') achievementText = '<strong>CONQUISTA:</strong> Painel Ativado!';
            if (taskName === 'testedAim') achievementText = '<strong>CONQUISTA:</strong> Mira de Elite!';
            if (taskName === 'optimized') achievementText = '<strong>CONQUISTA:</strong> Máquina Otimizada!';
            
            if (achievementText && window.Notiflix) {
                Notiflix.Notify.Success(achievementText, { plainText: false, timeout: 3000 });
            }

            if (typeof fbq === 'function') {
                fbq('trackCustom', 'JornadaDoCapudo', { mission_completed: taskName });
            }

            updateGamifiedProgress();
        };
    };

    /**
     * Módulo: Carrossel de Feedback
     */
    const setupCarousel = () => {
        const carouselContent = document.getElementById('carousel-content');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!carouselContent || !dotsContainer) return;

        const feedbackImages = ["https://i.imgur.com/NC8sgSy.png", "https://i.imgur.com/UajvZM1.png", "https://i.imgur.com/6LpvOAk.png", "https://i.imgur.com/Pd7spkl.png", "https://i.imgur.com/3GIql6p.png", "https://i.imgur.com/pRBfwHH.png", "https://i.imgur.com/jHHTrMH.png", "https://i.imgur.com/v7VueRe.png", "https://i.imgur.com/rWUmPO3.png", "https://i.imgur.com/66Z2P2J.png"];
        let currentSlide = 0;
        
        const getSlidesInView = () => window.innerWidth >= 768 ? 3 : 2;

        const updateCarousel = () => { 
            if (carouselContent.children.length === 0) return;
            const slidesInView = getSlidesInView();
            const maxSlideIndex = Math.max(0, feedbackImages.length - slidesInView);
            if (currentSlide > maxSlideIndex) currentSlide = maxSlideIndex;
            if (currentSlide < 0) currentSlide = 0;
            
            const itemWidth = carouselContent.children[0].offsetWidth;
            const transformValue = -currentSlide * itemWidth;
            carouselContent.style.transform = `translateX(${transformValue}px)`;
            
            document.querySelectorAll(".carousel-dot").forEach((dot, index) => { 
                dot.classList.toggle("bg-red-500", index === currentSlide);
                dot.classList.toggle("bg-gray-700", index !== currentSlide);
            });
        };

        const renderCarousel = () => { 
            const slidesInView = getSlidesInView();
            const slideWidthPercent = 100 / slidesInView; 
            
            carouselContent.innerHTML = feedbackImages.map(src => `<div class="flex-shrink-0 p-2" style="width: ${slideWidthPercent}%"><img src="${src}" class="w-full h-auto rounded-lg" loading="lazy" alt="Feedback de cliente" /></div>`).join("");
            
            const numDots = Math.max(0, feedbackImages.length - slidesInView + 1);
            dotsContainer.innerHTML = Array.from({ length: numDots }).map((_, index) => `<button data-slide-to="${index}" class="carousel-dot w-2.5 h-2.5 rounded-full transition-colors duration-300"></button>`).join("");
            updateCarousel();
        };

        const navigateCarousel = (direction) => { 
            const slidesInView = getSlidesInView();
            const maxSlideIndex = Math.max(0, feedbackImages.length - slidesInView);
            currentSlide += direction;
            if (currentSlide > maxSlideIndex) currentSlide = 0;
            else if (currentSlide < 0) currentSlide = maxSlideIndex;
            updateCarousel();
        };

        document.getElementById("next-slide")?.addEventListener("click", () => navigateCarousel(1));
        document.getElementById("prev-slide")?.addEventListener("click", () => navigateCarousel(-1));
        dotsContainer.addEventListener("click", e => { 
            if (e.target.matches(".carousel-dot")) {
                currentSlide = parseInt(e.target.dataset.slideTo);
                updateCarousel();
            }
        });

        window.addEventListener("resize", renderCarousel);
        renderCarousel();
        setInterval(() => navigateCarousel(1), 5000);
    };

    /**
     * Módulo: FAQ Interativo
     */
    const setupFAQ = () => {
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer) return;

        const faqData = [{ question: "O aplicativo dá ban? É seguro?", answer: "Não. Nosso aplicativo é 100% seguro e funciona como uma ferramenta de otimização e sensibilidade, sem alterar os arquivos do jogo. Pode usar sem medo de banimento." }, { question: "Funciona em todos os celulares?", answer: "Sim, o Aplicativo Noskill é compatível com todos os dispositivos Android e iOS. Após a compra, você recebe o acesso para instalar e configurar facilmente no seu celular." }, { question: "Como recebo o acesso após a compra?", answer: "A entrega é imediata. Assim que o pagamento for confirmado, você receberá um e-mail com o link para download do aplicativo e todas as instruções de instalação e uso." }, { question: "As funções são hacks?", answer: "Não. Nossas ferramentas usam tecnologia legal para simular a precisão de um jogador de elite, mas sem nenhum risco de ban, porque não modificam o jogo." }, { question: "Tenho garantia?", answer: "Sim! Oferecemos uma garantia de 7 dias. Se você não sentir uma melhora clara na sua jogabilidade ou não estiver satisfeito, devolvemos seu dinheiro." }];
        let openFaq = 0;

        const renderFaq = () => {
            faqContainer.innerHTML = faqData.map((e, t) => `<div class="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${openFaq===t?"border-red-500/50":""}"><button data-faq-index="${t}" class="faq-toggle w-full flex justify-between items-center text-left p-6 cursor-pointer hover:bg-gray-800/50"><h4 class="font-semibold text-lg text-white pr-4">${e.question}</h4><div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800/50 rounded-full"><span class="text-red-500 transition-transform duration-300 ${openFaq===t?"rotate-180":""}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span></div></button><div class="overflow-hidden transition-all duration-500 ease-in-out" style="max-height: ${openFaq===t?"200px":"0px"}"><div class="px-6 pb-6 pt-0"><p class="text-gray-400">${e.answer}</p></div></div></div>`).join("");
            
            document.querySelectorAll(".faq-toggle").forEach(btn => { 
                btn.addEventListener("click", e => { 
                    const t = parseInt(e.currentTarget.dataset.faqIndex); 
                    openFaq = openFaq === t ? null : t;
                    renderFaq();
                });
            });
        };
        renderFaq();
    };

    /**
     * Módulo: Simulador do Aplicativo
     */
    const setupAppSimulator = () => {
        // ... (toda a lógica de simulação do app, desde 'const mainToggleBtn' até o final, vai aqui)
        // Nenhuma alteração necessária nesta parte da lógica, apenas a transferência para esta função.
    };

    /**
     * Módulo: Utilitários e Efeitos Visuais
     */
    const setupUtilities = () => {
        // Lógica de Rolagem Suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Lógica do Scroll Reveal
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('animate-fade-in') }) }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        
        // Lógica das Notificações Falsas (Social Proof)
        if (window.Notiflix) { 
            setInterval(() => { 
                const messages = ["<strong>Sucesso!</strong> Alguém acabou de garantir o acesso vitalício.", "<strong>Aproveite!</strong> Um jogador garantiu o acesso vitalício.", "<strong>Imperdível!</strong> Mais um jogador comprou o acesso permanente."];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                Notiflix.Notify.Success(randomMessage, { position: "left-bottom", plainText: false, timeout: 4000 });
            }, 10000 + Math.random() * 5000);
        }

        // Propagação de parâmetros de URL para os links de checkout
        const params = new URLSearchParams(window.location.search);
        if ([...params].length > 0) {
            document.querySelectorAll(".purchase-link").forEach(link => {
                try {
                    const url = new URL(link.href);
                    params.forEach((value, key) => {
                        url.searchParams.set(key, value);
                    });
                    link.href = url.toString();
                } catch (e) {
                    console.error("URL inválida no link de checkout:", link.href);
                }
            });
        }
    };

    /**
     * Módulo: Rastreamento de Eventos (Tracking)
     */
    const setupTracking = () => {
        document.querySelectorAll('.purchase-link').forEach(link => {
            link.addEventListener("click", (event) => {
                const planCard = event.currentTarget.closest('div[data-plan-name]');
                if (!planCard || typeof fbq !== 'function') return;

                const planName = planCard.dataset.planName || 'Plano Desconhecido';
                const planValue = parseFloat(planCard.dataset.planValue) || 0.00;
                
                fbq('track', 'InitiateCheckout', {
                    content_ids: [`noskill_${planName.toLowerCase().replace(' ', '_')}`],
                    content_name: planName,
                    value: planValue,
                    currency: 'BRL'
                });
            });
        });
    };

    // --- INICIALIZAÇÃO DE TODOS OS MÓDULOS ---
    setupGamification();
    setupCarousel();
    setupFAQ();
    setupAppSimulator();
    setupUtilities();
    setupTracking();
});
