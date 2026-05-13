document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('main > section');

    /** Paths must match files in assets/img/ exactly (including spaces in filenames). */
    const IMAGES = {
        strawberryMatcha: 'assets/img/strawberry matcha.jpg',
        icedMatchaLatte: 'assets/img/iced matcha lattee.jpg',
        icedMatchaLatteWithFoam: 'assets/img/iced matcha latte with foam .jpg'
    };

    const FALLBACK_DRINK = {
        id: 'fallback',
        name: 'Build Your Matcha',
        flavor: 'Choose a foam',
        tag: 'Your Matcha',
        score: 82,
        image: IMAGES.icedMatchaLatte,
        ingredients: 'Matcha, milk or water, and your custom steps',
        tasteProfile: 'Select a foam topping to unlock the matching drink photo.',
        category: 'classic',
        tags: ['Custom'],
        description:
            'Pick Strawberry, Light, or Vanilla foam on the last step to see the right drink image. This is a placeholder iced matcha until then.',
        note: 'Your whisk score still counts!',
        match: { matchaType: null, iceLevel: null, sweetness: null, foam: null }
    };

    const recipes = [
        {
            id: 'strawberry',
            name: 'Strawberry Matcha',
            flavor: 'Sweet & Fruity',
            tag: 'Sweet Pick',
            score: 95,
            image: IMAGES.strawberryMatcha,
            ingredients: 'Ceremonial Matcha, Strawberry Puree, Oat Milk',
            tasteProfile: 'A perfect balance of earthy matcha and sweet strawberry.',
            category: 'strawberry',
            tags: ['Sweet', 'Fruity'],
            description: 'Sweet, milky and full of berry flavor.',
            note: 'Extra creamy. Best for hot days!',
            foamKey: 'strawberry-foam',
            match: {
                matchaType: 'classic-matcha',
                iceLevel: 'ice-medium',
                sweetness: 'sweet-medium',
                foam: 'strawberry-foam'
            }
        },
        {
            id: 'classic',
            name: 'Iced Matcha Latte',
            flavor: 'Refreshing & Earthy',
            tag: 'Cafe Favorite',
            score: 92,
            image: IMAGES.icedMatchaLatte,
            ingredients: 'Premium Matcha, Water, Ice, Light Syrup',
            tasteProfile: 'Clean, crisp, and pure matcha flavor.',
            category: 'classic',
            tags: ['Classic', 'Iced'],
            description: 'Smooth and refreshing with a clean matcha finish.',
            note: 'Clean and refreshing.',
            foamKey: 'light-foam',
            match: {
                matchaType: 'iced-matcha-latte',
                iceLevel: 'ice-high',
                sweetness: 'sweet-low',
                foam: 'light-foam'
            }
        },
        {
            id: 'float',
            name: 'Iced Matcha Latte with Foam',
            flavor: 'Creamy & Indulgent',
            tag: 'Creamy',
            score: 98,
            image: IMAGES.icedMatchaLatteWithFoam,
            ingredients: 'Matcha Latte, Vanilla Foam',
            tasteProfile: 'Rich matcha topped with airy vanilla sweetness.',
            category: 'classic',
            tags: ['Dessert', 'Creamy'],
            description: 'A creamy iced matcha finished with sweet vanilla foam.',
            note: 'Dessert-like and decadent.',
            foamKey: 'vanilla-foam',
            match: {
                matchaType: 'dirty-matcha',
                iceLevel: 'ice-low',
                sweetness: 'sweet-medium',
                foam: 'vanilla-foam'
            }
        }
    ];

    const recipeByFoam = recipes.reduce((acc, recipe) => {
        acc[recipe.foamKey] = recipe;
        return acc;
    }, {});

    const choices = {
        matchaType: null,
        iceLevel: null,
        sweetness: null,
        foam: null
    };

    function showSection(targetSection) {
        allSections.forEach((sec) => sec.classList.add('hidden-section'));
        targetSection.classList.remove('hidden-section');
        targetSection.classList.add('section-enter');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => targetSection.classList.remove('section-enter'), 500);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
            showSection(targetSection);
        });
    });

    let whiskProgress = 0;
    const maxProgress = 100;

    const whiskBtn = document.getElementById('whisk-btn');
    const bowlBtn = document.getElementById('bowl-btn');
    const nextBtn = document.getElementById('next-btn');
    const bowlContainer = document.querySelector('.bowl-container');
    const percentText = document.getElementById('whisk-percent');
    const progressBar = document.getElementById('whisk-progress');
    const liquidLevel = document.getElementById('liquid-level');
    const bowlFroth = document.querySelector('.bowl-froth');
    const perfectBadge = document.getElementById('perfect-badge');
    const scoreText = document.getElementById('score-text');
    const homeSection = document.getElementById('home');
    const chooseMatchaSection = document.getElementById('choose-matcha');
    const chooseIceSection = document.getElementById('choose-ice');
    const chooseSweetnessSection = document.getElementById('choose-sweetness');
    const chooseFoamSection = document.getElementById('choose-foam');
    const resultSection = document.getElementById('result');

    const backToWhiskingBtn = document.getElementById('back-to-whisking-btn');
    const toIceBtn = document.getElementById('to-ice-btn');
    const backToMatchaBtn = document.getElementById('back-to-matcha-btn');
    const toSweetnessBtn = document.getElementById('to-sweetness-btn');
    const backToIceBtn = document.getElementById('back-to-ice-btn');
    const toFoamBtn = document.getElementById('to-foam-btn');
    const backToSweetnessBtn = document.getElementById('back-to-sweetness-btn');
    const finishMatchaBtn = document.getElementById('finish-matcha-btn');
    const choiceCards = document.querySelectorAll('.choice-card');

    const resultTag = document.getElementById('result-tag');
    const resultImage = document.getElementById('result-image');
    const resultName = document.getElementById('result-name');
    const resultFlavor = document.getElementById('result-flavor');
    const resultScoreText = document.getElementById('result-score-text');
    const resultScoreBar = document.getElementById('result-score-bar');
    const resultMatchaType = document.getElementById('result-matcha-type');
    const resultIceAmount = document.getElementById('result-ice-amount');
    const resultSweetness = document.getElementById('result-sweetness');
    const resultToppings = document.getElementById('result-toppings');
    const recipeGrid = document.getElementById('recipe-grid');
    const savedEmptyState = document.getElementById('saved-empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');

    const SAVED_RECIPES_KEY = 'matchaSavedRecipes';
    let currentResultRecipe = FALLBACK_DRINK;
    let savedRecipes = [];
    let activeSavedFilter = 'all';

    function toLabel(value) {
        if (value == null || value === '') return '—';
        const map = {
            'classic-matcha': 'Classic Matcha',
            'strawberry-matcha': 'Strawberry Matcha',
            'iced-matcha-latte': 'Iced Matcha Latte',
            'dirty-matcha': 'Dirty Matcha',
            'ice-low': 'Low',
            'ice-medium': 'Medium',
            'ice-high': 'High',
            'sweet-low': 'Low',
            'sweet-medium': 'Medium',
            'sweet-high': 'High',
            'strawberry-foam': 'Strawberry Foam',
            'light-foam': 'Light Foam',
            'vanilla-foam': 'Vanilla Foam',
            ceremonial: 'Ceremonial Matcha',
            premium: 'Premium Matcha',
            latte: 'Matcha Latte',
            low: 'Low',
            medium: 'Medium',
            high: 'High'
        };
        return map[value] || value;
    }

    function createFoamBubble() {
        if (!bowlContainer) return;
        const bubble = document.createElement('span');
        bubble.className = 'foam-bubble';
        bubble.style.left = `${Math.random() * 70 + 15}%`;
        bubble.style.bottom = `${Math.random() * 20 + 20}%`;
        bubble.style.width = `${Math.random() * 16 + 8}px`;
        bubble.style.height = bubble.style.width;
        bowlContainer.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 900);
    }

    function burstCelebration() {
        const burstCount = 28;
        for (let i = 0; i < burstCount; i += 1) {
            const particle = document.createElement('span');
            particle.className = 'celebration-particle';
            particle.style.left = `${50 + (Math.random() * 40 - 20)}%`;
            particle.style.top = `${45 + (Math.random() * 30 - 15)}%`;
            particle.style.setProperty('--dx', `${Math.random() * 240 - 120}px`);
            particle.style.setProperty('--dy', `${-Math.random() * 220 - 20}px`);
            particle.style.backgroundColor = ['#ECC4C3', '#B97D7B', '#928E5E', '#DDDBC9'][i % 4];
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1200);
        }
    }

    function doWhisk() {
        if (whiskProgress >= maxProgress) return;

        whiskProgress += Math.floor(Math.random() * 8) + 5; // 5 to 12 percent per click
        if (whiskProgress > maxProgress) whiskProgress = maxProgress;

        // Update UI
        if (percentText) percentText.textContent = whiskProgress;
        if (progressBar) progressBar.style.width = `${whiskProgress}%`;
        if (liquidLevel) {
            liquidLevel.style.height = `${64 + (whiskProgress * 0.2)}px`;
            liquidLevel.style.transform = `translateX(-50%) scale(${1 + (whiskProgress * 0.001)})`;
        }
        if (bowlFroth) {
            bowlFroth.style.opacity = `${Math.min(0.15 + (whiskProgress * 0.008), 0.85)}`;
        }

        // Add whisking animation class
        if (bowlContainer) bowlContainer.classList.add('whisking');
        setTimeout(() => {
            if (bowlContainer) bowlContainer.classList.remove('whisking');
        }, 200);
        createFoamBubble();

        // Update Score Text
        if (whiskProgress < 30) {
            if (scoreText) scoreText.textContent = 'Beginner';
        } else if (whiskProgress < 70) {
            if (scoreText) scoreText.textContent = 'Getting Frothy';
        } else if (whiskProgress < 100) {
            if (scoreText) scoreText.textContent = 'Almost There';
        } else {
            if (scoreText) scoreText.textContent = 'Perfect!';
            if (perfectBadge) perfectBadge.classList.remove('hidden');
            if (whiskBtn) whiskBtn.classList.add('hidden');
            if (nextBtn) nextBtn.classList.remove('hidden');
            burstCelebration();
        }
    }

    if (whiskBtn) whiskBtn.addEventListener('click', doWhisk);
    if (bowlBtn) bowlBtn.addEventListener('click', doWhisk);

    function requireChoice(key) {
        if (choices[key]) return true;
        alert('Please pick an option first.');
        return false;
    }

    function getWhiskScoreForResult() {
        const s = typeof whiskProgress === 'number' ? whiskProgress : 0;
        return Math.max(60, Math.min(100, s || 82));
    }

    function getResultRecipe() {
        const foam = choices.foam;
        if (!foam || !recipeByFoam[foam]) {
            return { ...FALLBACK_DRINK, score: getWhiskScoreForResult() };
        }
        return recipeByFoam[foam];
    }

    function renderResult(recipe) {
        currentResultRecipe = recipe;
        if (resultTag) resultTag.textContent = recipe.tag;
        if (resultImage) {
            resultImage.src = recipe.image;
            resultImage.alt = recipe.name;
        }
        if (resultName) resultName.textContent = recipe.name;
        if (resultFlavor) resultFlavor.textContent = recipe.description;
        if (resultScoreText) resultScoreText.textContent = `${recipe.score}/100`;
        if (resultScoreBar) resultScoreBar.style.width = `${recipe.score}%`;
        if (resultMatchaType) {
            resultMatchaType.textContent = choices.matchaType ? toLabel(choices.matchaType) : '—';
        }
        if (resultIceAmount) {
            resultIceAmount.textContent = choices.iceLevel ? toLabel(choices.iceLevel) : '—';
        }
        if (resultSweetness) {
            resultSweetness.textContent = choices.sweetness ? toLabel(choices.sweetness) : '—';
        }
        if (resultToppings) {
            resultToppings.textContent = choices.foam ? toLabel(choices.foam) : 'Not selected';
        }
    }

    function refreshResultIfVisible() {
        if (!resultSection || resultSection.classList.contains('hidden-section')) return;
        renderResult(getResultRecipe());
    }

    function saveRecipesToStorage() {
        localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));
    }

    function migrateRecipeImageToImgFolder(recipe) {
        if (!recipe || typeof recipe.image !== 'string') return recipe;
        if (!recipe.image.startsWith('assets/images/')) return recipe;
        return { ...recipe, image: recipe.image.replace('assets/images/', 'assets/img/') };
    }

    function loadSavedRecipesFromStorage() {
        try {
            const raw = localStorage.getItem(SAVED_RECIPES_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.map(migrateRecipeImageToImgFolder);
        } catch (error) {
            return [];
        }
    }

    function getFilteredSavedRecipes() {
        if (activeSavedFilter === 'all') return savedRecipes;
        if (activeSavedFilter === 'favorites') return savedRecipes.filter((recipe) => recipe.isFavorite);
        return savedRecipes.filter((recipe) => recipe.category === activeSavedFilter);
    }

    function renderSavedRecipes() {
        if (!recipeGrid) return;
        const filtered = getFilteredSavedRecipes();

        if (savedEmptyState) {
            savedEmptyState.classList.toggle('hidden', savedRecipes.length > 0);
        }

        if (filtered.length === 0) {
            recipeGrid.innerHTML = '';
            if (savedRecipes.length > 0 && savedEmptyState) {
                savedEmptyState.textContent = 'No recipes match this filter yet.';
                savedEmptyState.classList.remove('hidden');
            } else if (savedEmptyState) {
                savedEmptyState.textContent = 'No saved recipes yet. Make a drink and tap Save Recipe.';
            }
            return;
        }

        recipeGrid.innerHTML = filtered.map((recipe) => `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <button class="btn-heart ${recipe.isFavorite ? 'active' : ''}" aria-label="Toggle favorite">
                    <i data-lucide="heart"></i>
                </button>
                <div class="recipe-img-box">
                    <img src="${recipe.image}" alt="${recipe.name}">
                    <div class="recipe-score"><i data-lucide="star"></i> ${recipe.score}</div>
                </div>
                <div class="recipe-content">
                    <div class="recipe-tags">${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <p class="recipe-desc">${recipe.description}</p>
                    <div class="recipe-ingredients"><strong>Ingredients:</strong> ${recipe.ingredients}</div>
                    <div class="recipe-note">"${recipe.note}"</div>
                    <div class="action-grid">
                        <button class="btn btn-dark btn-half remake-btn"><i data-lucide="play"></i> Remake</button>
                        <button class="btn btn-white btn-half remove-btn"><i data-lucide="trash-2"></i> Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function setActiveFilter(filterValue) {
        activeSavedFilter = filterValue;
        filterButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.filter === filterValue);
        });
        renderSavedRecipes();
    }

    choiceCards.forEach((card) => {
        card.addEventListener('click', () => {
            const group = card.dataset.group;
            const value = card.dataset.value;
            if (!group || !value) return;

            document.querySelectorAll(`.choice-card[data-group="${group}"]`).forEach((item) => {
                item.classList.remove('active');
            });
            card.classList.add('active');
            choices[group] = value;
            refreshResultIfVisible();
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (chooseMatchaSection) showSection(chooseMatchaSection);
        });
    }

    if (backToWhiskingBtn) {
        backToWhiskingBtn.addEventListener('click', () => {
            if (homeSection) showSection(homeSection);
        });
    }

    if (toIceBtn) {
        toIceBtn.addEventListener('click', () => {
            if (!requireChoice('matchaType')) return;
            if (chooseIceSection) showSection(chooseIceSection);
        });
    }

    if (backToMatchaBtn) {
        backToMatchaBtn.addEventListener('click', () => {
            if (chooseMatchaSection) showSection(chooseMatchaSection);
        });
    }

    if (toSweetnessBtn) {
        toSweetnessBtn.addEventListener('click', () => {
            if (!requireChoice('iceLevel')) return;
            if (chooseSweetnessSection) showSection(chooseSweetnessSection);
        });
    }

    if (backToIceBtn) {
        backToIceBtn.addEventListener('click', () => {
            if (chooseIceSection) showSection(chooseIceSection);
        });
    }

    if (toFoamBtn) {
        toFoamBtn.addEventListener('click', () => {
            if (!requireChoice('sweetness')) return;
            if (chooseFoamSection) showSection(chooseFoamSection);
        });
    }

    if (backToSweetnessBtn) {
        backToSweetnessBtn.addEventListener('click', () => {
            if (chooseSweetnessSection) showSection(chooseSweetnessSection);
        });
    }

    if (finishMatchaBtn) {
        finishMatchaBtn.addEventListener('click', () => {
            if (!requireChoice('matchaType')) return;
            if (!requireChoice('iceLevel')) return;
            if (!requireChoice('sweetness')) return;
            renderResult(getResultRecipe());
            if (resultSection) showSection(resultSection);
        });
    }

    const customizeAgainBtn = document.getElementById('customize-again-btn');
    if (customizeAgainBtn) {
        customizeAgainBtn.addEventListener('click', () => {
            if (chooseMatchaSection) showSection(chooseMatchaSection);
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter || 'all';
            setActiveFilter(filterValue);
        });
    });

    if (recipeGrid) {
        recipeGrid.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const card = target.closest('.recipe-card');
            if (!card) return;
            const recipeId = card.getAttribute('data-recipe-id');
            if (!recipeId) return;

            const heartButton = target.closest('.btn-heart');
            if (heartButton) {
                savedRecipes = savedRecipes.map((recipe) =>
                    recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
                );
                saveRecipesToStorage();
                renderSavedRecipes();
                return;
            }

            const remakeButton = target.closest('.remake-btn');
            if (remakeButton && homeSection) {
                showSection(homeSection);
                return;
            }

            const removeButton = target.closest('.remove-btn');
            if (removeButton) {
                savedRecipes = savedRecipes.filter((recipe) => recipe.id !== recipeId);
                saveRecipesToStorage();
                renderSavedRecipes();
            }
        });
    }

    // Save Recipe Button Interaction
    const saveRecipeBtn = document.getElementById('save-recipe-btn');
    if (saveRecipeBtn) {
        saveRecipeBtn.addEventListener('click', function() {
            const originalMarkup = this.innerHTML;
            const existingRecipeIndex = savedRecipes.findIndex((recipe) => recipe.id === currentResultRecipe.id);
            const recipeToStore = { ...currentResultRecipe, isFavorite: existingRecipeIndex >= 0 ? savedRecipes[existingRecipeIndex].isFavorite : true };

            if (existingRecipeIndex >= 0) {
                savedRecipes[existingRecipeIndex] = recipeToStore;
            } else {
                savedRecipes.unshift(recipeToStore);
                if (savedRecipes.length > 3) {
                    savedRecipes = savedRecipes.slice(0, 3);
                }
            }

            saveRecipesToStorage();
            renderSavedRecipes();

            this.innerHTML = `<i data-lucide="check"></i> ${existingRecipeIndex >= 0 ? 'Updated' : 'Saved'} to Collection`;
            this.classList.replace('btn-dark', 'btn-primary');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
            setTimeout(() => {
                this.innerHTML = originalMarkup;
                this.classList.replace('btn-primary', 'btn-dark');
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
            }, 3000);
        });
    }

    savedRecipes = loadSavedRecipesFromStorage();
    setActiveFilter('all');
});
