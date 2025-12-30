// WiFi Billing System - Complete Fixed JavaScript with User Panel
class WiFiBillingSystem {
    constructor() {
        this.currentLang = localStorage.getItem('wifi_lang') || 'bn';
        this.currentTheme = localStorage.getItem('wifi_theme') || 'light';
        this.selectedPlan = 'basic';
        this.formData = {};
        this.currentUser = null;
        this.isLoggedIn = false;
        
        console.log('System initialized with:', {
            lang: this.currentLang,
            theme: this.currentTheme
        });
    }
    
    async init() {
        // Initialize the system
        this.setupEventListeners();
        await this.loadLanguage();
        this.applyTheme(this.currentTheme);
        this.updateFormPlaceholders();
        
        // Set initial active buttons
        this.updateActiveButtons();
        
        // Check if user is already logged in
        const loggedInUser = this.getLoggedInUser();
        if (loggedInUser && window.location.hash === '#userPanel') {
            this.showDashboard(loggedInUser);
        }
        
        console.log('System ready!');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Language switcher - FIXED
        const langBnBtn = document.getElementById('langBn');
        const langEnBtn = document.getElementById('langEn');
        
        if (langBnBtn && langEnBtn) {
            langBnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage('bn');
            });
            
            langEnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage('en');
            });
            console.log('Language buttons initialized');
        }
        
        // Theme switcher - FIXED
        const themeLightBtn = document.getElementById('themeLight');
        const themeDarkBtn = document.getElementById('themeDark');
        
        if (themeLightBtn && themeDarkBtn) {
            themeLightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setTheme('light');
            });
            
            themeDarkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setTheme('dark');
            });
            console.log('Theme buttons initialized');
        }
        
        // Plan selection
        const selectPlanBtn = document.querySelector('.select-plan');
        if (selectPlanBtn) {
            selectPlanBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectedPlan = 'basic';
                this.scrollToForm();
            });
        }
        
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
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleRegistration(e));
        }
        
        // Promo code login
        const promoLoginForm = document.getElementById('promoLoginFormElement');
        if (promoLoginForm) {
            promoLoginForm.addEventListener('submit', (e) => this.handlePromoLogin(e));
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
        
        // Add device button
        const addDeviceBtn = document.getElementById('addDeviceBtn');
        if (addDeviceBtn) {
            addDeviceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddDeviceModal();
            });
        }
        
        // Quick action buttons
        const quickActionIds = ['changePasswordBtn', 'upgradePlanBtn', 'reportIssueBtn', 'viewInvoiceBtn'];
        quickActionIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleQuickAction(id);
                });
            }
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModals();
            });
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });
        
        // Add device form
        const addDeviceForm = document.getElementById('addDeviceForm');
        if (addDeviceForm) {
            addDeviceForm.addEventListener('submit', (e) => this.handleAddDevice(e));
        }
        
        // Change password form
        const changePasswordForm = document.getElementById('changePasswordForm');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }
        
        // Navigation to user panel
        document.querySelectorAll('a[href="#userPanel"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUserPanel();
            });
        });
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.closest('button').getAttribute('data-copy');
                this.copyToClipboard(targetId);
            });
        });
        
        // Show password buttons
        document.querySelectorAll('.show-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.target.closest('button').getAttribute('data-show');
                this.togglePasswordVisibility(targetId);
            });
        });
        
        console.log('All event listeners set up');
    }
    
    // ==================== LANGUAGE SYSTEM ====================
    
    async loadLanguage() {
        console.log('Loading language:', this.currentLang);
        
        try {
            // Try to load from JSON file
            const response = await fetch(`lang/${this.currentLang}.json`);
            if (response.ok) {
                this.translations = await response.json();
                console.log('Language file loaded successfully');
            } else {
                throw new Error('Language file not found');
            }
        } catch (error) {
            console.warn('Using fallback translations:', error.message);
            // Use embedded translations as fallback
            this.translations = this.getEmbeddedTranslations(this.currentLang);
        }
        
        this.updatePageContent();
    }
    
    getEmbeddedTranslations(lang) {
        const translations = {
            'bn': {
                'site_name': 'আল্ট্রা ওয়াইফাই',
                'hero_title': '⚡ আল্ট্রা ফাস্ট ওয়াইফাই ইন্টারনেট',
                'hero_subtitle': '২৪/৭ ১০০% আপটাইম গ্যারান্টি সহ বাংলাদেশের সেরা হাই-স্পিড ওয়াইফাই সার্ভিস',
                'view_plans': 'প্ল্যান দেখুন',
                'register_now': 'এখনই রেজিস্টার করুন',
                'our_features': 'আমাদের বিশেষ সুবিধাসমূহ',
                'feature_uptime': '২৪/৭ ১০০% আপটাইম',
                'feature_uptime_desc': 'বিদ্যুৎ চলে গেলেও আমাদের ব্যাকআপ সিস্টেমে ২৪ ঘণ্টা সার্ভিস',
                'feature_speed': '৫০০ Mbps স্পিড',
                'feature_speed_desc': '৪K স্ট্রিমিং, গেমিং, ডাউনলোড - সবকিছুর জন্য পারফেক্ট স্পিড',
                'feature_gaming': 'গেমিং অপটিমাইজড',
                'feature_gaming_desc': 'Valorant, Steam, Fivem, Epic Games - সব গেমে লো লেটেন্সি',
                'feature_streaming': '৪K স্ট্রিমিং',
                'feature_streaming_desc': 'Netflix, YouTube, Amazon Prime - বাফারিং ছাড়া ৪K স্ট্রিমিং',
                'feature_ftp': 'FTP সার্ভার',
                'feature_ftp_desc': 'নিজস্ব FTP সার্ভার এক্সেস, ফাইল শেয়ারিং সহজ',
                'feature_cdn': 'CDN এক্সেলারেশন',
                'feature_cdn_desc': 'জনপ্রিয় সার্ভারে ১০x স্পিড, কনটেন্ট ডেলিভারি নেটওয়ার্ক',
                'pricing_plans': 'প্যাকেজ ও মূল্য',
                'basic_plan': 'বেসিক প্ল্যান',
                'bdt': 'টাকা/মাস',
                'plan_device': '১টি ডিভাইস',
                'plan_unlimited': 'আনলিমিটেড ডেটা',
                'plan_speed': '৫০০ Mbps স্পিড',
                'plan_ftp': 'FTP সার্ভার এক্সেস',
                'plan_support': '২৪/৭ সাপোর্ট',
                'select_plan': 'সিলেক্ট প্ল্যান',
                'payment_methods': 'পেমেন্ট পদ্ধতি',
                'bkash': 'বিকাশ',
                'nagad': 'নগদ',
                'upay': 'আপে',
                'rocket': 'রকেট',
                'registration_form': 'রেজিস্ট্রেশন ফর্ম',
                'full_name': 'পূর্ণ নাম *',
                'phone_number': 'মোবাইল নাম্বার *',
                'email_address': 'ইমেইল ঠিকানা',
                'payment_method': 'পেমেন্ট মেথড *',
                'transaction_id': 'ট্রানজেকশন আইডি *',
                'sender_number': 'সেন্ডার নম্বর *',
                'terms_text': 'আমি ১৫০ টাকা পাঠিয়েছি এবং সমস্ত শর্ত মেনে নিচ্ছি। পেমেন্ট ভেরিফাই হলে WhatsApp/ইমেইলে পাসওয়ার্ড পাবো।',
                'submit_form': 'সাবমিট করুন',
                'payment_steps': 'পেমেন্ট করার নিয়ম',
                'step1': 'বিকাশ/নগদ/আপে/রকেট এ ১৫০ টাকা পাঠান',
                'step2': 'নিচের নম্বরে পাঠান: 01XXX-XXXXXX',
                'step3': 'ট্রানজেকশন আইডি নোট করুন',
                'step4': 'উপরের ফর্ম পূরণ করুন',
                'step5': 'আমরা পেমেন্ট ভেরিফাই করব',
                'step6': 'WhatsApp/ইমেইলে পাসওয়ার্ড পাবেন',
                'contact_us': 'যোগাযোগ করুন',
                'whatsapp': 'WhatsApp',
                'email': 'ইমেইল',
                'footer_text': 'বাংলাদেশের সেরা হাই-স্পিড ওয়াইফাই সার্ভিস প্রোভাইডার',
                'features': 'ফিচারস',
                'pricing': 'মূল্য',
                'register': 'রেজিস্টার',
                'copyright': '© ২০২৪ আল্ট্রা ওয়াইফাই। সর্বস্বত্ব সংরক্ষিত।',
                'success_title': 'সফলভাবে সাবমিট হয়েছে!',
                'success_message': 'আপনার ফর্ম সফলভাবে জমা দেওয়া হয়েছে। আমরা পেমেন্ট ভেরিফাই করে WhatsApp/ইমেইলে পাসওয়ার্ড পাঠাবো। ২৪ ঘণ্টার মধ্যে পেয়ে যাবেন।',
                'error_title': 'ত্রুটি হয়েছে!',
                'error_message': 'সাবমিট করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
                'close_modal': 'ঠিক আছে',
                'processing': 'প্রসেসিং হচ্ছে...',
                'light_mode': 'দিন',
                'dark_mode': 'রাত',
                'phone_hint': 'WhatsApp এ পাসওয়ার্ড পাঠানোর জন্য',
                'email_hint': 'ঐচ্ছিক - ইমেইলেও পাসওয়ার্ড পাঠানো হবে',
                'select_method': 'পেমেন্ট মেথড নির্বাচন করুন',
                'user_panel': 'ইউজার প্যানেল',
                'promo_login': 'প্রোমো কোড দিয়ে লগইন করুন',
                'promo_login_desc': 'আপনার রেজিস্ট্রেশনের পর WhatsApp/ইমেইলে প্রাপ্ত প্রোমো কোডটি দিন',
                'promo_hint': 'যেমন: ULTRA-XXXX-XXXX',
                'login': 'লগইন করুন',
                'promo_help': 'প্রোমো কোড পাননি? আমাদের WhatsApp বা ইমেইলে যোগাযোগ করুন',
                'logout': 'লগআউট',
                'user_id': 'ইউজার আইডি',
                'package_info': 'প্যাকেজ তথ্য',
                'plan_type': 'প্ল্যান টাইপ',
                'devices_allowed': 'অনুমোদিত ডিভাইস',
                'devices_used': 'ব্যবহৃত ডিভাইস',
                'payment_info': 'পেমেন্ট তথ্য',
                'registration_date': 'রেজিস্ট্রেশন তারিখ',
                'last_payment': 'সর্বশেষ পেমেন্ট',
                'next_payment': 'পরবর্তী পেমেন্ট',
                'payment_status': 'স্ট্যাটাস',
                'active': 'একটিভ',
                'expired': 'মেয়াদোত্তীর্ণ',
                'connection_info': 'কানেকশন তথ্য',
                'wifi_name': 'WiFi নাম',
                'wifi_password': 'WiFi পাসওয়ার্ড',
                'speed': 'স্পিড',
                'uptime': 'আপটাইম',
                'ftp_server': 'FTP সার্ভার',
                'ftp_host': 'হোস্ট',
                'ftp_username': 'ইউজারনেম',
                'ftp_password': 'পাসওয়ার্ড',
                'ftp_port': 'পোর্ট',
                'connect_ftp': 'FTP তে কানেক্ট করুন',
                'device_management': 'ডিভাইস ব্যবস্থাপনা',
                'connected': 'কানেক্টেড',
                'disconnected': 'ডিসকানেক্টেড',
                'disconnect': 'ডিসকানেক্ট',
                'add_device': 'নতুন ডিভাইস যোগ করুন',
                'quick_actions': 'দ্রুত কাজ',
                'change_wifi_password': 'WiFi পাসওয়ার্ড পরিবর্তন',
                'upgrade_plan': 'প্ল্যান আপগ্রেড করুন',
                'report_issue': 'সমস্যা রিপোর্ট করুন',
                'view_invoice': 'ইনভয়েস দেখুন',
                'usage_statistics': 'ব্যবহার পরিসংখ্যান',
                'data_used': 'ব্যবহৃত ডেটা',
                'online_time': 'অনলাইন সময়',
                'avg_speed': 'গড় স্পিড',
                'days_left': 'দিন বাকি',
                'of_unlimited': 'আনলিমিটেড এর মধ্যে',
                'today': 'আজ',
                'download': 'ডাউনলোড',
                'current_cycle': 'বর্তমান চক্র',
                'add_new_device': 'নতুন ডিভাইস যোগ করুন',
                'device_name': 'ডিভাইসের নাম',
                'device_type': 'ডিভাইস টাইপ',
                'mobile_phone': 'মোবাইল ফোন',
                'laptop': 'ল্যাপটপ',
                'desktop_pc': 'ডেস্কটপ পিসি',
                'tablet': 'ট্যাবলেট',
                'smart_tv': 'স্মার্ট টিভি',
                'mac_address': 'MAC Address',
                'new_password': 'নতুন পাসওয়ার্ড',
                'confirm_password': 'পাসওয়ার্ড নিশ্চিত করুন',
                'password_rules': 'ন্যূনতম ৮ অক্ষর, সংখ্যা ও বিশেষ চিহ্ন সহ',
                'change_password': 'পাসওয়ার্ড পরিবর্তন করুন'
            },
            'en': {
                'site_name': 'Ultra WiFi',
                'hero_title': '⚡ Ultra Fast WiFi Internet',
                'hero_subtitle': 'Bangladesh\'s best high-speed WiFi service with 24/7 100% uptime guarantee',
                'view_plans': 'View Plans',
                'register_now': 'Register Now',
                'our_features': 'Our Features',
                'feature_uptime': '24/7 100% Uptime',
                'feature_uptime_desc': '24-hour service on backup system even during power outage',
                'feature_speed': '500 Mbps Speed',
                'feature_speed_desc': 'Perfect speed for 4K streaming, gaming, downloading',
                'feature_gaming': 'Gaming Optimized',
                'feature_gaming_desc': 'Low latency in all games - Valorant, Steam, Fivem, Epic Games',
                'feature_streaming': '4K Streaming',
                'feature_streaming_desc': '4K streaming without buffering on Netflix, YouTube, Amazon Prime',
                'feature_ftp': 'FTP Server',
                'feature_ftp_desc': 'Personal FTP server access, easy file sharing',
                'feature_cdn': 'CDN Acceleration',
                'feature_cdn_desc': '10x speed on popular servers, content delivery network',
                'pricing_plans': 'Packages & Pricing',
                'basic_plan': 'Basic Plan',
                'bdt': 'BDT/Month',
                'plan_device': '1 Device',
                'plan_unlimited': 'Unlimited Data',
                'plan_speed': '500 Mbps Speed',
                'plan_ftp': 'FTP Server Access',
                'plan_support': '24/7 Support',
                'select_plan': 'Select Plan',
                'payment_methods': 'Payment Methods',
                'bkash': 'bKash',
                'nagad': 'Nagad',
                'upay': 'Upay',
                'rocket': 'Rocket',
                'registration_form': 'Registration Form',
                'full_name': 'Full Name *',
                'phone_number': 'Phone Number *',
                'email_address': 'Email Address',
                'payment_method': 'Payment Method *',
                'transaction_id': 'Transaction ID *',
                'sender_number': 'Sender Number *',
                'terms_text': 'I have sent 150 BDT and accept all terms and conditions. I will receive password on WhatsApp/Email after payment verification.',
                'submit_form': 'Submit Form',
                'payment_steps': 'Payment Instructions',
                'step1': 'Send 150 BDT via bKash/Nagad/Upay/Rocket',
                'step2': 'Send to this number: 01XXX-XXXXXX',
                'step3': 'Note the Transaction ID',
                'step4': 'Fill up the form above',
                'step5': 'We will verify the payment',
                'step6': 'You will receive password on WhatsApp/Email',
                'contact_us': 'Contact Us',
                'whatsapp': 'WhatsApp',
                'email': 'Email',
                'footer_text': 'Bangladesh\'s best high-speed WiFi service provider',
                'features': 'Features',
                'pricing': 'Pricing',
                'register': 'Register',
                'copyright': '© 2024 Ultra WiFi. All rights reserved.',
                'success_title': 'Successfully Submitted!',
                'success_message': 'Your form has been submitted successfully. We will verify the payment and send password on WhatsApp/Email. You will receive it within 24 hours.',
                'error_title': 'Error Occurred!',
                'error_message': 'There was a problem submitting. Please try again later.',
                'close_modal': 'OK',
                'processing': 'Processing...',
                'light_mode': 'Light',
                'dark_mode': 'Dark',
                'phone_hint': 'For sending password on WhatsApp',
                'email_hint': 'Optional - Password will also be sent to email',
                'select_method': 'Select Payment Method',
                'user_panel': 'User Panel',
                'promo_login': 'Login with Promo Code',
                'promo_login_desc': 'Enter the promo code you received via WhatsApp/Email after registration',
                'promo_hint': 'e.g., ULTRA-XXXX-XXXX',
                'login': 'Login',
                'promo_help': 'Didn\'t receive promo code? Contact us on WhatsApp or Email',
                'logout': 'Logout',
                'user_id': 'User ID',
                'package_info': 'Package Information',
                'plan_type': 'Plan Type',
                'devices_allowed': 'Devices Allowed',
                'devices_used': 'Devices Used',
                'payment_info': 'Payment Information',
                'registration_date': 'Registration Date',
                'last_payment': 'Last Payment',
                'next_payment': 'Next Payment',
                'payment_status': 'Status',
                'active': 'Active',
                'expired': 'Expired',
                'connection_info': 'Connection Information',
                'wifi_name': 'WiFi Name',
                'wifi_password': 'WiFi Password',
                'speed': 'Speed',
                'uptime': 'Uptime',
                'ftp_server': 'FTP Server',
                'ftp_host': 'Host',
                'ftp_username': 'Username',
                'ftp_password': 'Password',
                'ftp_port': 'Port',
                'connect_ftp': 'Connect to FTP',
                'device_management': 'Device Management',
                'connected': 'Connected',
                'disconnected': 'Disconnected',
                'disconnect': 'Disconnect',
                'add_device': 'Add New Device',
                'quick_actions': 'Quick Actions',
                'change_wifi_password': 'Change WiFi Password',
                'upgrade_plan': 'Upgrade Plan',
                'report_issue': 'Report Issue',
                'view_invoice': 'View Invoice',
                'usage_statistics': 'Usage Statistics',
                'data_used': 'Data Used',
                'online_time': 'Online Time',
                'avg_speed': 'Average Speed',
                'days_left': 'Days Left',
                'of_unlimited': 'of Unlimited',
                'today': 'Today',
                'download': 'Download',
                'current_cycle': 'Current Cycle',
                'add_new_device': 'Add New Device',
                'device_name': 'Device Name',
                'device_type': 'Device Type',
                'mobile_phone': 'Mobile Phone',
                'laptop': 'Laptop',
                'desktop_pc': 'Desktop PC',
                'tablet': 'Tablet',
                'smart_tv': 'Smart TV',
                'mac_address': 'MAC Address',
                'new_password': 'New Password',
                'confirm_password': 'Confirm Password',
                'password_rules': 'Minimum 8 characters, with numbers and special characters',
                'change_password': 'Change Password'
            }
        };
        
        return translations[lang] || translations['bn'];
    }
    
    updatePageContent() {
        console.log('Updating page content...');
        
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
        
        console.log('Page content updated');
    }
    
    updateFormPlaceholders() {
        console.log('Updating form placeholders...');
        
        // Update input placeholders based on language
        document.querySelectorAll('[data-placeholder-bn]').forEach(input => {
            const placeholder = this.currentLang === 'bn' 
                ? input.getAttribute('data-placeholder-bn')
                : input.getAttribute('data-placeholder-en');
            
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
        
        // Update select options
        const select = document.getElementById('paymentMethod');
        if (select) {
            const firstOption = select.querySelector('option[value=""]');
            if (firstOption && this.translations['select_method']) {
                firstOption.textContent = this.translations['select_method'];
            }
        }
    }
    
    setLanguage(lang) {
        console.log(`Setting language to: ${lang}`);
        
        if (lang === this.currentLang) {
            console.log('Language already set to:', lang);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('wifi_lang', lang);
        
        // Update page without reloading
        this.loadLanguage();
        this.updateActiveButtons();
        
        // Update button texts
        if (lang === 'bn') {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.id === 'langBn') {
                    btn.innerHTML = '<img src="https://flagcdn.com/w20/bd.png" alt="Bangla" class="flag"> বাংলা';
                } else if (btn.id === 'langEn') {
                    btn.innerHTML = '<img src="https://flagcdn.com/w20/gb.png" alt="English" class="flag"> English';
                }
            });
        } else {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                if (btn.id === 'langBn') {
                    btn.innerHTML = '<img src="https://flagcdn.com/w20/bd.png" alt="Bangla" class="flag"> Bangla';
                } else if (btn.id === 'langEn') {
                    btn.innerHTML = '<img src="https://flagcdn.com/w20/gb.png" alt="English" class="flag"> English';
                }
            });
        }
        
        console.log(`Language changed to: ${lang}`);
    }
    
    setTheme(theme) {
        console.log(`Setting theme to: ${theme}`);
        
        this.currentTheme = theme;
        localStorage.setItem('wifi_theme', theme);
        this.applyTheme(theme);
        this.updateActiveButtons();
        
        console.log(`Theme changed to: ${theme}`);
    }
    
    applyTheme(theme) {
        // Apply theme to body
        document.body.setAttribute('data-theme', theme);
        
        // Update theme icon
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
        console.log('Updating active buttons...');
        
        // Update language buttons
        const langBnBtn = document.getElementById('langBn');
        const langEnBtn = document.getElementById('langEn');
        
        if (langBnBtn && langEnBtn) {
            langBnBtn.classList.toggle('active', this.currentLang === 'bn');
            langEnBtn.classList.toggle('active', this.currentLang === 'en');
        }
        
        // Update theme buttons
        const themeLightBtn = document.getElementById('themeLight');
        const themeDarkBtn = document.getElementById('themeDark');
        
        if (themeLightBtn && themeDarkBtn) {
            themeLightBtn.classList.toggle('active', this.currentTheme === 'light');
            themeDarkBtn.classList.toggle('active', this.currentTheme === 'dark');
        }
        
        console.log('Active buttons updated');
    }
    
    // ==================== REGISTRATION SYSTEM ====================
    
    async handleRegistration(e) {
        e.preventDefault();
        console.log('Registration form submitted');
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            paymentMethod: document.getElementById('paymentMethod')?.value || '',
            transactionId: document.getElementById('transactionId')?.value.trim() || '',
            senderNumber: document.getElementById('senderNumber')?.value.trim() || '',
            plan: this.selectedPlan,
            language: this.currentLang,
            theme: this.currentTheme,
            timestamp: new Date().toISOString()
        };
        
        // Basic validation
        if (!formData.name || !formData.phone || !formData.paymentMethod || !formData.transactionId || !formData.senderNumber) {
            alert(this.currentLang === 'bn' 
                ? '❌ অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন'
                : '❌ Please fill in all required information');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        if (!phoneRegex.test(formData.phone)) {
            alert(this.currentLang === 'bn'
                ? '❌ দয়া করে একটি বৈধ বাংলাদেশি মোবাইল নম্বর দিন'
                : '❌ Please enter a valid Bangladeshi mobile number');
            return;
        }
        
        // Show loading
        this.showLoading();
        
        try {
            // Generate promo code and user data
            const promoCode = this.generatePromoCode(formData.phone);
            const userData = this.createUserData(formData, promoCode);
            
            // Save user
            this.saveUser(userData);
            
            // Send to Discord webhook
            await this.sendToDiscord(formData, promoCode);
            
            // Show success message with promo code
            this.showRegistrationSuccess(userData);
            
            // Reset form
            document.getElementById('registrationForm')?.reset();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError();
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
        const regDate = new Date();
        const nextPayment = new Date();
        nextPayment.setMonth(nextPayment.getMonth() + 1);
        
        return {
            id: `USER-${Date.now()}`,
            promoCode: promoCode,
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            paymentMethod: formData.paymentMethod,
            transactionId: formData.transactionId,
            senderNumber: formData.senderNumber,
            plan: 'basic',
            registrationDate: regDate.toISOString(),
            nextPaymentDate: nextPayment.toISOString(),
            lastPayment: 150,
            paymentStatus: 'active',
            wifiName: `ULTRA_WIFI_${formData.phone.slice(-4)}`,
            wifiPassword: this.generatePassword(formData.phone),
            ftpHost: 'ftp.ultrawifi.com',
            ftpUsername: `user_${formData.phone.slice(-4)}`,
            ftpPassword: this.generatePassword(formData.phone + 'ftp'),
            devices: [],
            usage: {
                dataUsed: '0 GB',
                onlineTime: '0h 0m',
                avgSpeed: '0 Mbps',
                daysLeft: 30
            },
            invoices: [
                {
                    id: `INV-${Date.now().toString().slice(-6)}`,
                    date: new Date().toISOString(),
                    amount: 150,
                    status: 'paid'
                }
            ]
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
    
    saveUser(userData) {
        const users = JSON.parse(localStorage.getItem('wifi_users')) || [];
        users.push(userData);
        localStorage.setItem('wifi_users', JSON.stringify(users));
        console.log('User saved:', userData.name);
    }
    
    async sendToDiscord(data, promoCode) {
        // YOUR DISCORD WEBHOOK URL - Replace this with your actual webhook URL
        const WEBHOOK_URL = 'https://discord.com/api/webhooks/1455692458733080808/EXt-DQQHQBwhQ0FGlG95PRLnOClGYpYUpyS8V0AV1QsPFv4v1W5NmqyuCxybA1lcieX6';
        
        if (!WEBHOOK_URL || WEBHOOK_URL.includes('https://discord.com/api/webhooks/1455692458733080808/EXt-DQQHQBwhQ0FGlG95PRLnOClGYpYUpyS8V0AV1QsPFv4v1W5NmqyuCxybA1lcieX6')) {
            console.warn('Discord webhook URL not configured');
            return true; // For testing, return success
        }
        
        const message = {
            embeds: [{
                title: "📡 নতুন ওয়াইফাই রেজিস্ট্রেশন | New WiFi Registration",
                color: this.currentTheme === 'dark' ? 0x2b2d31 : 0x5865f2,
                fields: [
                    { name: "👤 নাম | Name", value: data.name, inline: true },
                    { name: "📱 ফোন | Phone", value: data.phone, inline: true },
                    { name: "📧 ইমেইল | Email", value: data.email || "N/A | নাই", inline: true },
                    { name: "💳 পেমেন্ট মেথড | Payment Method", value: data.paymentMethod.toUpperCase(), inline: true },
                    { name: "🔢 ট্রানজেকশন আইডি | Transaction ID", value: data.transactionId, inline: true },
                    { name: "📞 সেন্ডার নম্বর | Sender Number", value: data.senderNumber, inline: true },
                    { name: "🎫 প্রোমো কোড | Promo Code", value: promoCode, inline: true },
                    { name: "🕒 সময় | Time", value: new Date(data.timestamp).toLocaleString('bn-BD'), inline: false }
                ],
                footer: { text: "Ultra WiFi Registration System" },
                timestamp: data.timestamp
            }]
        };
        
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
            
            if (!response.ok) {
                throw new Error(`Discord webhook error: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Discord webhook error:', error);
            return false;
        }
    }
    
    showRegistrationSuccess(userData) {
        const message = this.currentLang === 'bn' 
            ? `
                <h3>✅ রেজিস্ট্রেশন সফল!</h3>
                <p><strong>প্রোমো কোড:</strong> ${userData.promoCode}</p>
                <p>এই প্রোমো কোডটি সংরক্ষণ করুন। ইউজার প্যানেলে লগইন করতে এটি ব্যবহার করবেন।</p>
                <p>আমরা আপনার পেমেন্ট ভেরিফাই করে WhatsApp/ইমেইলে WiFi পাসওয়ার্ড পাঠাবো।</p>
            `
            : `
                <h3>✅ Registration Successful!</h3>
                <p><strong>Promo Code:</strong> ${userData.promoCode}</p>
                <p>Save this promo code. You will use it to login to User Panel.</p>
                <p>We will verify your payment and send WiFi password via WhatsApp/Email.</p>
            `;
        
        // Create success modal with promo code
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align: center;">
                    ${message}
                    <div style="margin-top: 20px;">
                        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                            ${this.currentLang === 'bn' ? 'ঠিক আছে' : 'OK'}
                        </button>
                        <button class="btn btn-secondary" onclick="window.wifiSystem.goToUserPanel()" style="margin-left: 10px;">
                            ${this.currentLang === 'bn' ? 'ইউজার প্যানেলে যান' : 'Go to User Panel'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    goToUserPanel() {
        this.closeAllModals();
        document.getElementById('userPanel')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // ==================== USER PANEL SYSTEM ====================
    
    async handlePromoLogin(e) {
        e.preventDefault();
        console.log('Promo login attempted');
        
        const promoCodeInput = document.getElementById('promoCode');
        if (!promoCodeInput) return;
        
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            this.showNotification(
                this.currentLang === 'bn' ? 'প্রোমো কোড দিন' : 'Enter promo code',
                'error'
            );
            return;
        }
        
        this.showLoading();
        
        // Simulate API delay
        setTimeout(() => {
            const user = this.verifyPromoCode(promoCode);
            
            if (user) {
                this.loginUser(user);
                this.showNotification(
                    this.currentLang === 'bn' ? 'লগইন সফল!' : 'Login successful!',
                    'success'
                );
            } else {
                this.showNotification(
                    this.currentLang === 'bn' ? 'ভুল প্রোমো কোড' : 'Invalid promo code',
                    'error'
                );
                
                // Shake animation
                promoCodeInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    promoCodeInput.style.animation = '';
                }, 500);
            }
            
            this.hideLoading();
        }, 1000);
    }
    
    verifyPromoCode(promoCode) {
        console.log('Verifying promo code:', promoCode);
        
        const users = JSON.parse(localStorage.getItem('wifi_users')) || [];
        const user = users.find(u => u.promoCode === promoCode);
        
        if (!user) {
            console.log('Promo code not found');
            return null;
        }
        
        console.log('User found:', user.name);
        return user;
    }
    
    loginUser(user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        this.showDashboard(user);
    }
    
    getLoggedInUser() {
        const userData = localStorage.getItem('current_user');
        return userData ? JSON.parse(userData) : null;
    }
    
    showDashboard(user) {
        console.log('Showing dashboard for:', user.name);
        
        const loginForm = document.getElementById('promoLoginForm');
        const dashboard = document.getElementById('userDashboard');
        
        if (loginForm) loginForm.style.display = 'none';
        if (dashboard) {
            dashboard.style.display = 'block';
            this.populateDashboard(user);
        }
    }
    
    populateDashboard(user) {
        console.log('Populating dashboard...');
        
        // User Info
        this.setElementText('userName', user.name);
        this.setElementText('userId', user.id);
        
        // Plan Info
        this.setElementText('userPlan', this.currentLang === 'bn' ? 'বেসিক প্ল্যান' : 'Basic Plan');
        this.setElementText('allowedDevices', this.currentLang === 'bn' ? '১টি ডিভাইস' : '1 Device');
        
        // Device Usage
        const usedDevices = user.devices?.length || 0;
        const devicePercentage = Math.min((usedDevices / 1) * 100, 100);
        this.setElementText('usedDevices', usedDevices);
        document.getElementById('deviceProgress').style.width = `${devicePercentage}%`;
        
        // Payment Info
        const regDate = new Date(user.registrationDate);
        const nextDate = new Date(user.nextPaymentDate);
        
        this.setElementText('regDate', regDate.toLocaleDateString(this.currentLang === 'bn' ? 'bn-BD' : 'en-US'));
        this.setElementText('lastPayment', this.currentLang === 'bn' ? '১৫০ টাকা' : '150 BDT');
        this.setElementText('nextPayment', nextDate.toLocaleDateString(this.currentLang === 'bn' ? 'bn-BD' : 'en-US'));
        
        // Status
        const today = new Date();
        const status = nextDate > today ? 'active' : 'expired';
        this.setElementText('paymentStatus', this.currentLang === 'bn' 
            ? (status === 'active' ? 'একটিভ' : 'মেয়াদোত্তীর্ণ')
            : (status === 'active' ? 'Active' : 'Expired')
        );
        
        // Connection Info
        this.setElementText('wifiName', user.wifiName);
        this.setElementText('wifiPassword', '••••••••');
        
        // FTP Info
        this.setElementText('ftpHost', user.ftpHost);
        this.setElementText('ftpUsername', user.ftpUsername);
        this.setElementText('ftpPassword', '••••••••');
        
        // Usage Stats
        this.setElementText('dataUsed', user.usage?.dataUsed || '0 GB');
        this.setElementText('onlineTime', user.usage?.onlineTime || '0h 0m');
        this.setElementText('avgSpeed', user.usage?.avgSpeed || '0 Mbps');
        
        // Days Left
        const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        this.setElementText('daysLeft', Math.max(0, daysLeft));
        
        // Update device list
        this.updateDeviceList(user.devices || []);
        
        console.log('Dashboard populated');
    }
    
    setElementText(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }
    
    updateDeviceList(devices) {
        const deviceList = document.getElementById('deviceList');
        if (!deviceList) return;
        
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
                <span class="device-status ${device.status}">
                    ${this.currentLang === 'bn' 
                        ? (device.status === 'active' ? 'কানেক্টেড' : 'ডিসকানেক্টেড')
                        : (device.status === 'active' ? 'Connected' : 'Disconnected')}
                </span>
                <button class="btn btn-small btn-danger" onclick="window.wifiSystem.removeDevice('${device.id}')">
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
    
    removeDevice(deviceId) {
        if (!this.currentUser) return;
        
        if (confirm(this.currentLang === 'bn' 
            ? 'আপনি কি এই ডিভাইস রিমুভ করতে চান?'
            : 'Are you sure you want to remove this device?'
        )) {
            this.currentUser.devices = this.currentUser.devices?.filter(d => d.id !== deviceId) || [];
            this.updateUser(this.currentUser);
            this.populateDashboard(this.currentUser);
        }
    }
    
    handleLogout() {
        if (confirm(this.currentLang === 'bn' 
            ? 'আপনি কি লগআউট করতে চান?'
            : 'Are you sure you want to logout?'
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
                    ? 'সফলভাবে লগআউট হয়েছে'
                    : 'Successfully logged out',
                'success'
            );
        }
    }
    
    updateUser(updatedUser) {
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        
        const users = JSON.parse(localStorage.getItem('wifi_users')) || [];
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('wifi_users', JSON.stringify(users));
        }
    }
    
    // ==================== UTILITY METHODS ====================
    
    scrollToForm() {
        const registerSection = document.getElementById('register');
        if (registerSection) {
            registerSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    highlightSelectedMethod(method) {
        document.querySelectorAll('.method').forEach(m => {
            m.classList.remove('selected');
            m.style.borderColor = '';
            m.style.transform = '';
        });
        
        const selectedMethod = document.querySelector(`[data-method="${method}"]`);
        if (selectedMethod) {
            selectedMethod.classList.add('selected');
            selectedMethod.style.borderColor = 'var(--primary-color)';
            selectedMethod.style.transform = 'translateY(-3px)';
        }
    }
    
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }
    
    showSuccess() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                if (modal.style.display === 'flex') {
                    this.closeModals();
                }
            }, 10000);
        }
    }
    
    showError() {
        const modal = document.getElementById('errorModal');
        if (modal) modal.style.display = 'flex';
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        // Close button event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    showUserPanel() {
        const userPanel = document.getElementById('userPanel');
        if (userPanel) {
            userPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    handleQuickAction(actionId) {
        switch(actionId) {
            case 'changePasswordBtn':
                this.showChangePasswordModal();
                break;
            case 'upgradePlanBtn':
                this.upgradePlan();
                break;
            case 'reportIssueBtn':
                this.reportIssue();
                break;
            case 'viewInvoiceBtn':
                this.viewInvoice();
                break;
        }
    }
    
    showAddDeviceModal() {
        const modal = document.getElementById('addDeviceModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
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
        if (this.currentUser.devices.length >= 1) {
            this.showNotification(
                this.currentLang === 'bn' 
                    ? 'আপনি সর্বোচ্চ ১টি ডিভাইস যুক্ত করতে পারেন'
                    : 'You can only connect 1 device',
                'error'
            );
            return;
        }
        
        const newDevice = {
            id: `DEV-${Date.now()}`,
            name: deviceName,
            type: deviceType || 'mobile',
            status: 'active',
            connectedSince: new Date().toISOString()
        };
        
        this.currentUser.devices.push(newDevice);
        this.updateUser(this.currentUser);
        
        this.populateDashboard(this.currentUser);
        this.closeModals();
        document.getElementById('addDeviceForm')?.reset();
        
        this.showNotification(
            this.currentLang === 'bn' ? 'ডিভাইস সফলভাবে যুক্ত হয়েছে' : 'Device added successfully',
            'success'
        );
    }
    
    showChangePasswordModal() {
        const modal = document.getElementById('changePasswordModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    async handleChangePassword(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('newWifiPassword')?.value;
        const confirmPassword = document.getElementById('confirmWifiPassword')?.value;
        
        if (newPassword !== confirmPassword) {
            this.showNotification(
                this.currentLang === 'bn' ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match',
                'error'
            );
            return;
        }
        
        if (newPassword.length < 8) {
            this.showNotification(
                this.currentLang === 'bn' 
                    ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে'
                    : 'Password must be at least 8 characters',
                'error'
            );
            return;
        }
        
        if (!this.currentUser) return;
        
        this.currentUser.wifiPassword = newPassword;
        this.updateUser(this.currentUser);
        
        this.closeModals();
        document.getElementById('changePasswordForm')?.reset();
        
        this.showNotification(
            this.currentLang === 'bn' 
                ? 'WiFi পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে'
                : 'WiFi password changed successfully',
            'success'
        );
    }
    
    upgradePlan() {
        this.showNotification(
            this.currentLang === 'bn' 
                ? 'প্ল্যান আপগ্রেড করতে WhatsApp এ যোগাযোগ করুন'
                : 'Contact us on WhatsApp to upgrade your plan',
            'info'
        );
    }
    
    reportIssue() {
        this.showNotification(
            this.currentLang === 'bn' 
                ? 'সমস্যা রিপোর্ট করতে WhatsApp এ মেসেজ করুন'
                : 'Message us on WhatsApp to report an issue',
            'info'
        );
    }
    
    viewInvoice() {
        if (!this.currentUser) return;
        
        let invoiceHTML = '<h3>' + (this.currentLang === 'bn' ? 'ইনভয়েস সমূহ' : 'Invoices') + '</h3><ul>';
        
        this.currentUser.invoices?.forEach(invoice => {
            const date = new Date(invoice.date).toLocaleDateString(
                this.currentLang === 'bn' ? 'bn-BD' : 'en-US'
            );
            
            invoiceHTML += `
                <li>
                    <strong>${invoice.id}</strong> - ${date}
                    <br>${this.currentLang === 'bn' ? 'পরিমাণ:' : 'Amount:'} ${invoice.amount} BDT
                    <br>${this.currentLang === 'bn' ? 'স্ট্যাটাস:' : 'Status:'} ${invoice.status}
                </li>
            `;
        });
        
        invoiceHTML += '</ul>';
        
        const invoiceModal = document.createElement('div');
        invoiceModal.className = 'modal';
        invoiceModal.style.display = 'flex';
        invoiceModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.currentLang === 'bn' ? 'ইনভয়েস' : 'Invoices'}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${invoiceHTML}
                </div>
            </div>
        `;
        
        document.body.appendChild(invoiceModal);
        
        invoiceModal.querySelector('.close-modal').addEventListener('click', () => {
            invoiceModal.remove();
        });
        
        invoiceModal.addEventListener('click', (e) => {
            if (e.target === invoiceModal) {
                invoiceModal.remove();
            }
        });
    }
    
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification(
                this.currentLang === 'bn' ? 'কপি করা হয়েছে' : 'Copied to clipboard',
                'success'
            );
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
    
    togglePasswordVisibility(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (element.textContent === '••••••••') {
            if (!this.currentUser) return;
            
            if (elementId === 'wifiPassword') {
                element.textContent = this.currentUser.wifiPassword;
            } else if (elementId === 'ftpPassword') {
                element.textContent = this.currentUser.ftpPassword;
            }
        } else {
            element.textContent = '••••••••';
        }
    }
    
    closeAllModals() {
        this.closeModals();
    }
}

// ==================== INITIALIZATION ====================

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Clear any previous errors
    try {
        window.wifiSystem = new WiFiBillingSystem();
        window.wifiSystem.init();
    } catch (error) {
        console.error('Error initializing WiFi System:', error);
        alert('System initialization failed. Please check console for errors.');
    }
    
    // Add keyboard shortcuts for testing
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            const currentLang = window.wifiSystem?.currentLang;
            if (currentLang) {
                const newLang = currentLang === 'bn' ? 'en' : 'bn';
                window.wifiSystem?.setLanguage(newLang);
            }
        }
        
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            const currentTheme = window.wifiSystem?.currentTheme;
            if (currentTheme) {
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                window.wifiSystem?.setTheme(newTheme);
            }
        }
    });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .notification {
            transition: all 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
        }
        
        .no-devices {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});

// Global helper functions for backward compatibility
function copyToClipboardGlobal(elementId) {
    window.wifiSystem?.copyToClipboard(elementId);
}

function togglePasswordVisibilityGlobal(elementId) {
    window.wifiSystem?.togglePasswordVisibility(elementId);
}