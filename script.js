// ✅ Configuration - আপনার নিজের মান বসান
const SUPABASE_URL = 'https://oxoyiqeyuhnudkexnhpa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h0JmEF4dLBJ80tr710mwsQ_hwN2g71S';
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1455692458733080808/EXt-DQQHQBwhQ0FGlG95PRLnOClGYpYUpyS8V0AV1QsPFv4v1W5NmqyuCxybA1lcieX6';

// WiFi Billing System - Complete Working Version
class WiFiBillingSystem {
    constructor() {
        this.currentLang = localStorage.getItem('wifi_lang') || 'bn';
        this.currentTheme = localStorage.getItem('wifi_theme') || 'light';
        this.selectedPlan = 'basic';
        this.formData = {};
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // ✅ Initialize Supabase Client
        this.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ System initialized with Supabase');
    }
    
    async init() {
        await this.setupEventListeners();
        await this.loadLanguage();
        this.applyTheme(this.currentTheme);
        this.updateFormPlaceholders();
        this.updateActiveButtons(); // ✅ এটা যোগ করুন
        
        // Check if user is already logged in
        const loggedInUser = this.getLoggedInUser();
        if (loggedInUser && window.location.hash === '#userPanel') {
            await this.showDashboard(loggedInUser);
        }
        
        console.log('✅ System ready!');
    }
    
    async setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // ✅ Language switcher - Fixed
        document.getElementById('langBn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setLanguage('bn');
        });
        
        document.getElementById('langEn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setLanguage('en');
        });
        
        // ✅ Theme switcher - Fixed
        document.getElementById('themeLight')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setTheme('light');
        });
        
        document.getElementById('themeDark')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.setTheme('dark');
        });
        
        // Plan selection
        document.querySelector('.select-plan')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectedPlan = 'basic';
            this.scrollToForm();
        });
        
        // Payment method selection
        document.querySelectorAll('.method').forEach(method => {
            method.addEventListener('click', (e) => {
                e.preventDefault();
                const paymentMethod = method.getAttribute('data-method');
                const selectElement = document.getElementById('paymentMethod');
                if (selectElement) {
                    selectElement.value = paymentMethod;
                }
                this.highlightSelectedMethod(paymentMethod);
            });
        });
        
        // Registration Form submission
        document.getElementById('registrationForm')?.addEventListener('submit', (e) => this.handleRegistration(e));
        
        // Promo code login
        document.getElementById('promoLoginFormElement')?.addEventListener('submit', (e) => this.handlePromoLogin(e));
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
        
        // Add device button
        document.getElementById('addDeviceBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAddDeviceModal();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModals();
            });
        });
        
        // Add device form
        document.getElementById('addDeviceForm')?.addEventListener('submit', (e) => this.handleAddDevice(e));
        
        console.log('✅ All event listeners set up');
    }
    
    // ==================== LANGUAGE & THEME SYSTEM (FIXED) ====================
    
    async loadLanguage() {
        console.log('🌐 Loading language:', this.currentLang);
        
        try {
            this.translations = this.getEmbeddedTranslations(this.currentLang);
            this.updatePageContent();
            
            // Update switcher UI
            this.updateActiveButtons();
            
        } catch (error) {
            console.error('Language load error:', error);
        }
    }
    
    getEmbeddedTranslations(lang) {
        // ... আপনার পুরানো translation object এখানে রাখুন ...
        // (পুরানো কোড থেকে কপি করুন)
    }
    
    updatePageContent() {
        if (!this.translations) {
            console.error('No translations available');
            return;
        }
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = this.translations[key];
                } else if (element.tagName === 'INPUT' && element.type === 'button') {
                    element.value = this.translations[key];
                } else {
                    element.textContent = this.translations[key];
                }
            } else {
                console.warn(`Translation key not found: ${key}`);
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Update form placeholders
        this.updateFormPlaceholders();
        
        // Update switcher text
        this.updateSwitcherText();
        
        console.log('✅ Page content updated');
    }
    
    updateSwitcherText() {
        // Update language button text based on current language
        const langBnBtn = document.getElementById('langBn');
        const langEnBtn = document.getElementById('langEn');
        
        if (this.currentLang === 'bn') {
            if (langBnBtn) {
                langBnBtn.querySelector('.lang-text').textContent = 'বাংলা';
            }
            if (langEnBtn) {
                langEnBtn.querySelector('.lang-text').textContent = 'English';
            }
        } else {
            if (langBnBtn) {
                langBnBtn.querySelector('.lang-text').textContent = 'Bangla';
            }
            if (langEnBtn) {
                langEnBtn.querySelector('.lang-text').textContent = 'English';
            }
        }
    }
    
    setLanguage(lang) {
        if (lang === this.currentLang) {
            console.log('Language already set to:', lang);
            return;
        }
        
        console.log(`🌐 Setting language to: ${lang}`);
        
        this.currentLang = lang;
        localStorage.setItem('wifi_lang', lang);
        
        // Update with animation
        document.documentElement.style.opacity = '0.7';
        setTimeout(async () => {
            await this.loadLanguage();
            this.updateActiveButtons();
            document.documentElement.style.opacity = '1';
            
            // Show notification
            this.showNotification(
                lang === 'bn' ? '🌐 ভাষা পরিবর্তন করা হয়েছে' : '🌐 Language changed',
                'success'
            );
        }, 300);
    }
    
    setTheme(theme) {
        if (theme === this.currentTheme) {
            console.log('Theme already set to:', theme);
            return;
        }
        
        console.log(`🎨 Setting theme to: ${theme}`);
        
        this.currentTheme = theme;
        localStorage.setItem('wifi_theme', theme);
        
        // Smooth theme transition
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            this.applyTheme(theme);
            this.updateActiveButtons();
            
            document.body.style.opacity = '1';
            
            // Show notification with icon
            this.showNotification(
                theme === 'light' ? '☀️ লাইট মোড' : '🌙 ডার্ক মোড',
                'success'
            );
        }, 300);
    }
    
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        // Update theme icons
        const themeLightIcon = document.querySelector('#themeLight i');
        const themeDarkIcon = document.querySelector('#themeDark i');
        
        if (themeLightIcon && themeDarkIcon) {
            if (theme === 'light') {
                themeLightIcon.className = 'fas fa-sun';
                themeDarkIcon.className = 'fas fa-moon';
            } else {
                themeLightIcon.className = 'fas fa-sun';
                themeDarkIcon.className = 'fas fa-moon';
            }
        }
    }
    
    updateActiveButtons() {
        console.log('🔄 Updating active buttons...');
        
        // ✅ Language buttons
        const langBnBtn = document.getElementById('langBn');
        const langEnBtn = document.getElementById('langEn');
        
        if (langBnBtn && langEnBtn) {
            langBnBtn.classList.toggle('active', this.currentLang === 'bn');
            langEnBtn.classList.toggle('active', this.currentLang === 'en');
        }
        
        // ✅ Theme buttons
        const themeLightBtn = document.getElementById('themeLight');
        const themeDarkBtn = document.getElementById('themeDark');
        
        if (themeLightBtn && themeDarkBtn) {
            themeLightBtn.classList.toggle('active', this.currentTheme === 'light');
            themeDarkBtn.classList.toggle('active', this.currentTheme === 'dark');
        }
        
        console.log('✅ Active buttons updated');
    }
    
    updateFormPlaceholders() {
        // Update input placeholders based on language
        document.querySelectorAll('[data-placeholder-bn]').forEach(input => {
            const placeholder = this.currentLang === 'bn' 
                ? input.getAttribute('data-placeholder-bn')
                : input.getAttribute('data-placeholder-en');
            
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    }
    
    // ==================== SUPABASE INTEGRATION ====================
    
    async handleRegistration(e) {
        e.preventDefault();
        console.log('📝 Registration form submitted');
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            paymentMethod: document.getElementById('paymentMethod')?.value || '',
            transactionId: document.getElementById('transactionId')?.value.trim() || '',
            senderNumber: document.getElementById('senderNumber')?.value.trim() || '',
            plan: this.selectedPlan,
            timestamp: new Date().toISOString()
        };
        
        // Validation
        if (!formData.name || !formData.phone || !formData.paymentMethod || !formData.transactionId || !formData.senderNumber) {
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '❌ অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন'
                    : '❌ Please fill in all required information',
                'error'
            );
            return;
        }
        
        this.showLoading();
        
        try {
            // Generate promo code
            const promoCode = this.generatePromoCode(formData.phone);
            const userData = this.createUserData(formData, promoCode);
            
            // Save to Supabase
            const supabaseResult = await this.saveToSupabase(userData);
            
            // Send to Discord
            const discordResult = await this.sendToDiscord(formData, promoCode);
            
            // Show success
            this.showRegistrationSuccess(userData, true);
            
            // Reset form
            document.getElementById('registrationForm')?.reset();
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '❌ রেজিস্ট্রেশনে সমস্যা হয়েছে'
                    : '❌ Registration failed',
                'error'
            );
        } finally {
            this.hideLoading();
        }
    }
    
    generatePromoCode(phone) {
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        const last4 = phone.slice(-4);
        return `ULTRA-${last4}-${random}`;
    }
    
    createUserData(formData, promoCode) {
        const now = new Date();
        const nextPayment = new Date();
        nextPayment.setMonth(nextPayment.getMonth() + 1);
        
        return {
            promoCode: promoCode,
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            paymentMethod: formData.paymentMethod,
            transactionId: formData.transactionId,
            senderNumber: formData.senderNumber,
            plan: 'basic',
            wifiName: `ULTRA_WIFI_${formData.phone.slice(-4)}`,
            wifiPassword: this.generatePassword(formData.phone),
            devices: []
        };
    }
    
    generatePassword(base) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const last4 = base.toString().slice(-4);
        return `ULTRA@${last4}${result.slice(0, 4)}`;
    }
    
    async saveToSupabase(userData) {
        try {
            const now = new Date().toISOString();
            const nextPayment = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            
            const { data, error } = await this.supabaseClient
                .from('wifi_users')
                .insert([{
                    promo_code: userData.promoCode,
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email || null,
                    payment_method: userData.paymentMethod,
                    transaction_id: userData.transactionId,
                    sender_number: userData.senderNumber,
                    plan: userData.plan || 'basic',
                    registration_date: now,
                    next_payment_date: nextPayment,
                    last_payment_date: now,
                    payment_status: 'active',
                    wifi_name: userData.wifiName,
                    devices: JSON.stringify(userData.devices || [])
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Saved to Supabase:', data);
            return data;
        } catch (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }
    }
    
    async sendToDiscord(formData, promoCode) {
        if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes('your-webhook-url')) {
            console.warn('⚠️ Discord webhook not configured');
            return false;
        }
        
        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "📡 নতুন রেজিস্ট্রেশন",
                        color: 0x5865F2,
                        fields: [
                            { name: "👤 নাম", value: formData.name, inline: true },
                            { name: "📱 ফোন", value: formData.phone, inline: true },
                            { name: "🎫 প্রোমো কোড", value: `\`${promoCode}\``, inline: true },
                            { name: "💳 পেমেন্ট", value: formData.paymentMethod.toUpperCase(), inline: true },
                            { name: "🔢 ট্রানজেকশন", value: formData.transactionId, inline: true },
                            { name: "🕒 সময়", value: new Date().toLocaleString('bn-BD'), inline: true }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                })
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            console.log('✅ Sent to Discord');
            return true;
        } catch (error) {
            console.error('❌ Discord error:', error);
            throw error;
        }
    }
    
    // ==================== USER PANEL ====================
    
    async handlePromoLogin(e) {
        e.preventDefault();
        
        const promoCode = document.getElementById('promoCode')?.value.trim().toUpperCase();
        
        if (!promoCode) {
            this.showNotification(
                this.currentLang === 'bn' ? 'প্রোমো কোড দিন' : 'Enter promo code',
                'error'
            );
            return;
        }
        
        this.showLoading();
        
        try {
            const user = await this.verifyPromoCodeInSupabase(promoCode);
            
            if (user) {
                // Convert data
                const userData = {
                    ...user,
                    devices: typeof user.devices === 'string' ? JSON.parse(user.devices) : user.devices || []
                };
                
                this.loginUser(userData);
                this.showNotification(
                    this.currentLang === 'bn' ? '✅ লগইন সফল!' : '✅ Login successful!',
                    'success'
                );
            } else {
                this.showNotification(
                    this.currentLang === 'bn' ? '❌ ভুল প্রোমো কোড' : '❌ Invalid promo code',
                    'error'
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(
                this.currentLang === 'bn' ? '❌ লগইনে সমস্যা' : '❌ Login error',
                'error'
            );
        } finally {
            this.hideLoading();
        }
    }
    
    async verifyPromoCodeInSupabase(promoCode) {
        try {
            const { data, error } = await this.supabaseClient
                .from('wifi_users')
                .select('*')
                .eq('promo_code', promoCode)
                .single();
            
            if (error || !data) {
                console.log('Promo code not found:', error?.message);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Verification error:', error);
            return null;
        }
    }
    
    loginUser(user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        this.showDashboard(user);
    }
    
    async showDashboard(user) {
        const loginForm = document.getElementById('promoLoginForm');
        const dashboard = document.getElementById('userDashboard');
        
        if (loginForm) loginForm.style.display = 'none';
        if (dashboard) {
            dashboard.style.display = 'block';
            this.populateDashboard(user);
        }
        
        // Scroll to dashboard with animation
        setTimeout(() => {
            document.getElementById('userPanel')?.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 500);
    }
    
    populateDashboard(user) {
        // User Info
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userId').textContent = user.promo_code || user.promoCode;
        
        // Plan Info
        document.getElementById('userPlan').textContent = 
            this.currentLang === 'bn' ? 'বেসিক প্ল্যান' : 'Basic Plan';
        
        // Device Usage
        const usedDevices = user.devices?.length || 0;
        const devicePercentage = Math.min((usedDevices / 1) * 100, 100);
        document.getElementById('usedDevices').textContent = usedDevices;
        document.getElementById('deviceProgress').style.width = `${devicePercentage}%`;
        
        // Payment Info
        const regDate = new Date(user.registration_date);
        const nextDate = new Date(user.next_payment_date);
        
        document.getElementById('regDate').textContent = 
            regDate.toLocaleDateString(this.currentLang === 'bn' ? 'bn-BD' : 'en-US');
        document.getElementById('nextPayment').textContent = 
            nextDate.toLocaleDateString(this.currentLang === 'bn' ? 'bn-BD' : 'en-US');
        
        // Status
        const today = new Date();
        const status = nextDate > today ? 'active' : 'expired';
        document.getElementById('paymentStatus').textContent = 
            this.currentLang === 'bn' 
                ? (status === 'active' ? 'একটিভ' : 'মেয়াদোত্তীর্ণ')
                : (status === 'active' ? 'Active' : 'Expired');
        
        // Connection Info
        document.getElementById('wifiName').textContent = user.wifi_name;
        
        // Update device list
        this.updateDeviceList(user.devices || []);
    }
    
    updateDeviceList(devices) {
        const deviceList = document.getElementById('deviceList');
        
        if (devices.length === 0) {
            deviceList.innerHTML = `
                <div class="no-devices">
                    ${this.currentLang === 'bn' 
                        ? 'কোনো ডিভাইস কানেক্টেড নেই' 
                        : 'No devices connected'}
                </div>
            `;
            return;
        }
        
        deviceList.innerHTML = devices.map(device => `
            <div class="device-item">
                <i class="fas fa-${this.getDeviceIcon(device.type)}"></i>
                <span>${device.name}</span>
                <span class="device-status active">
                    ${this.currentLang === 'bn' ? 'কানেক্টেড' : 'Connected'}
                </span>
                <button class="btn btn-danger btn-small" onclick="window.wifiSystem.removeDevice('${device.id}')">
                    ${this.currentLang === 'bn' ? 'রিমুভ' : 'Remove'}
                </button>
            </div>
        `).join('');
    }
    
    getDeviceIcon(type) {
        const icons = {
            'mobile': 'mobile-alt',
            'laptop': 'laptop',
            'pc': 'desktop',
            'tablet': 'tablet-alt',
            'tv': 'tv'
        };
        return icons[type] || 'question-circle';
    }
    
    // ==================== DEVICE MANAGEMENT ====================
    
    async handleAddDevice(e) {
        e.preventDefault();
        
        const deviceName = document.getElementById('newDeviceName')?.value.trim();
        const deviceType = document.getElementById('deviceType')?.value;
        
        if (!deviceName) {
            this.showNotification(
                this.currentLang === 'bn' ? 'ডিভাইসের নাম দিন' : 'Enter device name',
                'error'
            );
            return;
        }
        
        if (!this.currentUser) return;
        
        // Check device limit
        if (this.currentUser.devices?.length >= 1) {
            this.showNotification(
                this.currentLang === 'bn' 
                    ? 'আপনি সর্বোচ্চ ১টি ডিভাইস যুক্ত করতে পারেন'
                    : 'You can only connect 1 device',
                'error'
            );
            return;
        }
        
        const newDevice = {
            id: 'DEV-' + Date.now(),
            name: deviceName,
            type: deviceType || 'mobile',
            added_at: new Date().toISOString(),
            status: 'active'
        };
        
        // Add to current user
        if (!this.currentUser.devices) this.currentUser.devices = [];
        this.currentUser.devices.push(newDevice);
        
        // Update Supabase
        try {
            await this.updateUserInSupabase();
            this.populateDashboard(this.currentUser);
            this.closeModals();
            document.getElementById('addDeviceForm')?.reset();
            
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '✅ ডিভাইস যুক্ত হয়েছে' 
                    : '✅ Device added',
                'success'
            );
        } catch (error) {
            console.error('Device add error:', error);
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '❌ ডিভাইস যোগ করতে সমস্যা' 
                    : '❌ Device add failed',
                'error'
            );
        }
    }
    
    async removeDevice(deviceId) {
        if (!this.currentUser) return;
        
        if (!confirm(
            this.currentLang === 'bn' 
                ? 'ডিভাইস রিমুভ করবেন?'
                : 'Remove device?'
        )) return;
        
        // Remove from current user
        this.currentUser.devices = this.currentUser.devices?.filter(d => d.id !== deviceId) || [];
        
        // Update Supabase
        try {
            await this.updateUserInSupabase();
            this.populateDashboard(this.currentUser);
            
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '✅ ডিভাইস রিমুভ করা হয়েছে' 
                    : '✅ Device removed',
                'success'
            );
        } catch (error) {
            console.error('Device remove error:', error);
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '❌ ডিভাইস রিমুভ করতে সমস্যা' 
                    : '❌ Device remove failed',
                'error'
            );
        }
    }
    
    async updateUserInSupabase() {
        if (!this.currentUser) return;
        
        try {
            const { data, error } = await this.supabaseClient
                .from('wifi_users')
                .update({
                    devices: JSON.stringify(this.currentUser.devices || [])
                })
                .eq('promo_code', this.currentUser.promoCode);
            
            if (error) throw error;
            console.log('✅ User updated in Supabase');
        } catch (error) {
            console.error('❌ Supabase update error:', error);
            throw error;
        }
    }
    
    // ==================== UTILITIES ====================
    
    handleLogout() {
        if (confirm(
            this.currentLang === 'bn' 
                ? 'লগআউট করবেন?'
                : 'Logout?'
        )) {
            localStorage.removeItem('current_user');
            this.isLoggedIn = false;
            this.currentUser = null;
            
            const loginForm = document.getElementById('promoLoginForm');
            const dashboard = document.getElementById('userDashboard');
            
            if (loginForm) loginForm.style.display = 'block';
            if (dashboard) dashboard.style.display = 'none';
            
            document.getElementById('promoCode').value = '';
            
            this.showNotification(
                this.currentLang === 'bn' 
                    ? '✅ লগআউট সম্পন্ন'
                    : '✅ Logged out',
                'success'
            );
        }
    }
    
    showRegistrationSuccess(userData, success = true) {
        const message = this.currentLang === 'bn' 
            ? `
                <div style="text-align: center;">
                    <h3 style="color: #10b981; margin-bottom: 1.5rem;">
                        <i class="fas fa-check-circle"></i> রেজিস্ট্রেশন সফল!
                    </h3>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                         color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                        <strong style="font-size: 1.1rem;">প্রোমো কোড:</strong>
                        <div style="font-family: 'Courier New', monospace; font-size: 1.8rem; 
                             font-weight: bold; letter-spacing: 2px; background: rgba(255,255,255,0.15); 
                             padding: 0.75rem; border-radius: 8px; margin: 0.75rem 0; 
                             border: 2px dashed rgba(255,255,255,0.3);">
                            ${userData.promoCode}
                        </div>
                        <small>ইউজার প্যানেলে লগইন করতে এই কোডটি ব্যবহার করুন</small>
                    </div>
                    <p>আমরা আপনার পেমেন্ট ভেরিফাই করে WhatsApp/ইমেইলে WiFi পাসওয়ার্ড পাঠাবো।</p>
                </div>
            `
            : `
                <div style="text-align: center;">
                    <h3 style="color: #10b981; margin-bottom: 1.5rem;">
                        <i class="fas fa-check-circle"></i> Registration Successful!
                    </h3>
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                         color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                        <strong style="font-size: 1.1rem;">Promo Code:</strong>
                        <div style="font-family: 'Courier New', monospace; font-size: 1.8rem; 
                             font-weight: bold; letter-spacing: 2px; background: rgba(255,255,255,0.15); 
                             padding: 0.75rem; border-radius: 8px; margin: 0.75rem 0; 
                             border: 2px dashed rgba(255,255,255,0.3);">
                            ${userData.promoCode}
                        </div>
                        <small>Use this code to login to User Panel</small>
                    </div>
                    <p>We will verify your payment and send WiFi password via WhatsApp/Email.</p>
                </div>
            `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                ${message}
                <div style="margin-top: 25px; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                        ${this.currentLang === 'bn' ? 'ঠিক আছে' : 'OK'}
                    </button>
                    <button class="btn btn-secondary" onclick="window.wifiSystem.goToUserPanel(); this.closest('.modal').remove()">
                        <i class="fas fa-user-circle"></i>
                        ${this.currentLang === 'bn' ? 'ইউজার প্যানেলে যান' : 'Go to User Panel'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    goToUserPanel() {
        this.closeAllModals();
        document.getElementById('userPanel')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    showAddDeviceModal() {
        document.getElementById('addDeviceModal').style.display = 'flex';
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    closeAllModals() {
        this.closeModals();
    }
    
    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = {
            'success': 'fa-check-circle',
            'error': 'fa-times-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${{
                        'success': '#10b981',
                        'error': '#e63946',
                        'warning': '#f9a826',
                        'info': '#4361ee'
                    }[type] || '#4361ee'};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 10000;
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                @keyframes slideIn {
                    from { transform: translateX(100%) translateY(-20px); opacity: 0; }
                    to { transform: translateX(0) translateY(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0) translateY(0); opacity: 1; }
                    to { transform: translateX(100%) translateY(-20px); opacity: 0; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                .notification-close {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: 15px;
                    padding: 5px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    transition: background 0.2s;
                }
                .notification-close:hover {
                    background: rgba(255,255,255,0.25);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    getLoggedInUser() {
        const userData = localStorage.getItem('current_user');
        return userData ? JSON.parse(userData) : null;
    }
    
    scrollToForm() {
        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    highlightSelectedMethod(method) {
        document.querySelectorAll('.method').forEach(m => {
            m.classList.remove('selected');
        });
        
        const selectedMethod = document.querySelector(`[data-method="${method}"]`);
        if (selectedMethod) {
            selectedMethod.classList.add('selected');
        }
    }
    
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        navigator.clipboard.writeText(element.textContent).then(() => {
            this.showNotification(
                this.currentLang === 'bn' ? '📋 কপি করা হয়েছে' : '📋 Copied to clipboard',
                'success'
            );
        });
    }
    
    togglePassword(elementId) {
        const element = document.getElementById(elementId);
        if (!element || !this.currentUser) return;
        
        if (element.textContent === '••••••••') {
            const password = elementId === 'wifiPassword' 
                ? this.currentUser.wifi_password || 'Not available'
                : 'Not available';
            element.textContent = password;
            setTimeout(() => {
                element.textContent = '••••••••';
            }, 3000);
        }
    }
}

// Global helper functions
function copyToClipboard(elementId) {
    window.wifiSystem?.copyToClipboard(elementId);
}

function togglePassword(elementId) {
    window.wifiSystem?.togglePassword(elementId);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM fully loaded');
    
    try {
        window.wifiSystem = new WiFiBillingSystem();
        window.wifiSystem.init();
        console.log('🎉 WiFi System initialized successfully!');
    } catch (error) {
        console.error('💥 Error initializing WiFi System:', error);
        
        // Fallback notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #e63946;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 9999;
            font-family: sans-serif;
            font-weight: bold;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            System initialization failed. Please check console (F12) for errors.
        `;
        document.body.appendChild(errorDiv);
    }
});