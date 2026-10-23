/**
 * ATSScan AI — Smart Resume Analyzer
 * Pure Vanilla JavaScript Client-Side Engine
 * 100% Private, Local ATS Scoring & Document Extraction
 */

// ==========================================================================
// 1. STATE & STORAGE
// ==========================================================================

const STATE = {
    mode: 'upload', // 'upload' | 'text'
    uploadedFile: null,
    resumeText: '',
    jobText: '',
    targetRole: '',
    lastAnalysis: null,
    activeKeywordFilter: 'all' // 'all' | 'matched' | 'missing'
};

const STORAGE_KEYS = {
    THEME: 'atsscan_theme',
    HISTORY: 'atsscan_history_v1'
};

// ==========================================================================
// 2. COMPREHENSIVE SKILL & KEYWORD TAXONOMY
// ==========================================================================

const TAXONOMY = {
    technicalSkills: [
        'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'c', 'golang', 'go', 'rust',
        'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'dart', 'matlab', 'bash', 'shell',
        'sql', 'nosql', 'html', 'html5', 'css', 'css3', 'sass', 'scss', 'json', 'xml',
        'react', 'react.js', 'angular', 'vue', 'vue.js', 'next.js', 'nuxt.js', 'svelte',
        'nodejs', 'node.js', 'express', 'express.js', 'django', 'flask', 'fastapi', 'spring',
        'spring boot', 'asp.net', 'ruby on rails', 'laravel', 'graphql', 'rest api', 'restful api'
    ],
    toolsAndCloud: [
        'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
        'terraform', 'ansible', 'jenkins', 'gitlab', 'github', 'github actions', 'ci/cd',
        'git', 'jira', 'confluence', 'linux', 'unix', 'nginx', 'apache',
        'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
        'oracle', 'sqlite', 'kafka', 'rabbitmq', 'firebase', 'supabase', 'snowflake', 'databricks',
        'postman', 'swagger', 'webpack', 'vite', 'npm', 'yarn', 'pnpm'
    ],
    domainAndMethods: [
        'agile', 'scrum', 'kanban', 'machine learning', 'deep learning', 'artificial intelligence', 'ai',
        'natural language processing', 'nlp', 'computer vision', 'data science', 'data analytics',
        'data modeling', 'system design', 'microservices', 'object-oriented programming', 'oop',
        'test-driven development', 'tdd', 'unit testing', 'integration testing', 'end-to-end testing',
        'cross-functional', 'leadership', 'communication', 'problem solving', 'teamwork', 'collaboration',
        'product management', 'roadmap', 'user research', 'a/b testing', 'stakeholder management',
        'project management', 'performance optimization', 'scalability', 'security', 'penetration testing'
    ]
};

// Common English Stop Words
const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
    'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
    'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
    'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
    'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
    'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
    'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
    'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
    'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
    'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
    'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
    'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
    'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
    'yourselves', 'will', 'shall', 'may', 'might', 'must', 'need', 'needs', 'also', 'etc', 'including',
    'experience', 'years', 'work', 'job', 'role', 'team', 'candidate', 'ability', 'proficient', 'knowledge'
]);

// Action Verbs for Impact Assessment
const ACTION_VERBS = [
    'accelerated', 'achieved', 'architected', 'automated', 'built', 'championed', 'collaborated',
    'conducted', 'created', 'delivered', 'deployed', 'designed', 'developed', 'directed', 'eliminated',
    'engineered', 'enhanced', 'established', 'executed', 'expanded', 'formulated', 'generated', 'guided',
    'implemented', 'improved', 'increased', 'initiated', 'integrated', 'introduced', 'launched', 'led',
    'managed', 'maximized', 'mentored', 'minimized', 'modernized', 'negotiated', 'optimized', 'orchestrated',
    'overhauled', 'pioneered', 'planned', 'reduced', 'refactored', 'resolved', 'restructured', 'revamped',
    'scaled', 'simplified', 'spearheaded', 'standardized', 'streamlined', 'strengthened', 'supervised',
    'transformed', 'upgraded'
];

// ==========================================================================
// 3. SAMPLE DATA (FOR DEMO & EVALUATION)
// ==========================================================================

const SAMPLE_JOBS = {
    fullstack: {
        title: 'Senior Full Stack Software Engineer',
        text: `We are looking for a Senior Full Stack Software Engineer proficient in JavaScript, TypeScript, React, and Node.js to build scalable web applications.
Requirements:
- 3+ years experience with React, Next.js, Redux, and modern CSS/Sass.
- Strong backend experience with Node.js, Express, RESTful APIs, and GraphQL.
- Hands-on database proficiency with PostgreSQL, Redis, and MongoDB.
- Experience with Docker, Kubernetes, AWS (ECS, S3, Lambda), and CI/CD pipelines.
- Proficient in Git, Jest unit testing, and Agile/Scrum team collaboration.
- Excellent communication, system design skills, and passion for performance optimization.`
    },
    datascience: {
        title: 'Data Scientist / Machine Learning Engineer',
        text: `Seeking a Data Scientist with deep expertise in Python, Machine Learning, Deep Learning, and SQL.
Key Responsibilities:
- Build, train, and evaluate predictive statistical models using PyTorch, TensorFlow, and Scikit-learn.
- Perform exploratory data analysis and data modeling using Pandas, NumPy, and SQL.
- Deploy machine learning models into production using Docker, FastAPI, and AWS.
- Create impactful data visualizations and dashboards in Tableau or Power BI.
- Strong mathematical background, problem solving, and cross-functional communication skills.`
    },
    productmanager: {
        title: 'Product Manager — SaaS Applications',
        text: `We are hiring a Product Manager to lead cross-functional product development for our cloud platform.
Qualifications:
- 3+ years experience managing product lifecycle from discovery to launch.
- Strong expertise in Agile product management, roadmap planning, user research, and Jira.
- Data-driven mindset with proficiency in SQL, Google Analytics, and A/B testing.
- Proven track record collaborating with UX designers, engineers, and executive stakeholders.
- Superior communication, leadership, and analytical problem-solving skills.`
    }
};

const SAMPLE_RESUME = `Akash Sharma
Senior Full Stack Engineer
akash.sharma.dev@gmail.com | +1 (555) 382-9102 | linkedin.com/in/akash-dev | github.com/akash-dev

SUMMARY
Results-driven Full Stack Engineer with 4+ years of experience architecting high-performance web applications using JavaScript, TypeScript, React, and Node.js. Proven track record in microservices, RESTful APIs, Docker, and AWS cloud deployments.

PROFESSIONAL EXPERIENCE
Senior Full Stack Developer | Apex Cloud Technologies (2022 - Present)
- Architected and deployed scalable React and TypeScript frontend, boosting user engagement by 35%.
- Built RESTful APIs and GraphQL microservices using Node.js and Express, supporting 200,000+ daily active users.
- Optimized PostgreSQL database queries and implemented Redis caching, reducing server response latency by 45%.
- Streamlined CI/CD deployment pipelines using Docker, GitHub Actions, and AWS (S3, ECS), reducing release time by 50%.
- Spearheaded Agile sprint planning and mentored 4 junior developers in unit testing with Jest.

Full Stack Software Engineer | Horizon Interactive (2020 - 2022)
- Developed responsive web interfaces using React, Redux, and CSS3, achieving 99.8% cross-browser compatibility.
- Integrated PostgreSQL and MongoDB databases for e-commerce transactional workloads.
- Collaborated with product managers and designers in Jira to deliver 12 major feature milestones on schedule.

EDUCATION
Bachelor of Technology in Computer Science & Engineering
State Technical University, GPA: 3.8/4.0 (2016 - 2020)

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Express, Next.js, Redux
- Databases & Storage: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS, Docker, Git, GitHub Actions, CI/CD, Linux
- Methodologies: Agile, Scrum, REST APIs, GraphQL, System Design, Unit Testing`;

// ==========================================================================
// 4. THEME MANAGEMENT
// ==========================================================================

function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
}

// ==========================================================================
// 5. TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ==========================================================================
// 6. RESUME PARSING (PDF, DOCX, TXT)
// ==========================================================================

if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        let lastY;
        let pageText = '';
        for (const item of textContent.items) {
            if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
                pageText += '\n';
            } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                pageText += ' ';
            }
            pageText += item.str;
            lastY = item.transform[5];
        }

        if (pageText.trim()) {
            fullText += pageText.trim() + '\n\n';
        }
    }

    return fullText.trim();
}

async function extractTextFromDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result.value || '').trim();
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function processFile(file) {
    if (!file) return;

    // File validation
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
        showToast('File size exceeds 10MB limit. Please upload a smaller file.', 'error');
        return;
    }

    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    const isPdf = lowerName.endsWith('.pdf') || file.type === 'application/pdf';
    const isDocx = lowerName.endsWith('.docx') || file.type.includes('wordprocessingml');
    const isTxt = lowerName.endsWith('.txt') || file.type.includes('text/plain');

    if (!isPdf && !isDocx && !isTxt) {
        showToast('Unsupported file type. Please upload a PDF, DOCX, or TXT resume.', 'error');
        return;
    }

    const dropZone = document.getElementById('dropZone');
    const fileCard = document.getElementById('fileCard');
    const uploadLoader = document.getElementById('uploadLoader');
    const loaderText = document.getElementById('uploadLoaderText');
    const fileTextPreview = document.getElementById('fileTextPreview');

    // UI state
    if (dropZone) dropZone.style.display = 'none';
    if (fileCard) fileCard.style.display = 'none';
    if (fileTextPreview) fileTextPreview.style.display = 'none';
    if (uploadLoader) {
        uploadLoader.style.display = 'flex';
        loaderText.textContent = `Extracting text from ${fileName}...`;
    }

    try {
        let extractedText = '';

        if (isPdf) {
            if (!window.pdfjsLib) throw new Error('PDF parsing library is unavailable.');
            extractedText = await extractTextFromPDF(file);
            if (!extractedText || extractedText.length < 20) {
                showToast('Warning: Low text content detected. Scanned image PDFs cannot be parsed by ATS scanners.', 'warning');
            }
        } else if (isDocx) {
            if (!window.mammoth) throw new Error('Word document parser is unavailable.');
            extractedText = await extractTextFromDocx(file);
        } else {
            extractedText = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error('Failed to read text file.'));
                reader.readAsText(file);
            });
        }

        STATE.uploadedFile = file;
        STATE.resumeText = extractedText;

        // Keep textarea in sync
        const textarea = document.getElementById('resume');
        if (textarea) {
            textarea.value = extractedText;
            updateResumeCharCount();
        }

        // Populate File Card
        const nameEl = document.getElementById('fileNameDisplay');
        const sizeEl = document.getElementById('fileSizeDisplay');
        const previewEl = document.getElementById('previewContent');

        if (nameEl) nameEl.textContent = fileName;
        if (sizeEl) sizeEl.textContent = formatFileSize(file.size);
        if (previewEl) previewEl.textContent = extractedText || '(No text extracted)';

        if (uploadLoader) uploadLoader.style.display = 'none';
        if (fileCard) fileCard.style.display = 'flex';
        showToast(`Extracted resume text from "${fileName}"`, 'success');
    } catch (err) {
        console.error('File parsing error:', err);
        if (uploadLoader) uploadLoader.style.display = 'none';
        if (dropZone) dropZone.style.display = 'flex';
        showToast(`Could not extract resume: ${err.message || 'Error parsing document'}`, 'error');
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
    event.target.value = '';
}

function removeUploadedFile() {
    STATE.uploadedFile = null;
    STATE.resumeText = '';

    const textarea = document.getElementById('resume');
    if (textarea) {
        textarea.value = '';
        updateResumeCharCount();
    }

    const fileCard = document.getElementById('fileCard');
    const fileTextPreview = document.getElementById('fileTextPreview');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    if (fileCard) fileCard.style.display = 'none';
    if (fileTextPreview) fileTextPreview.style.display = 'none';
    if (dropZone) dropZone.style.display = 'flex';
    if (fileInput) fileInput.value = '';

    showToast('Uploaded resume removed', 'info');
}

function toggleExtractedTextPreview() {
    const preview = document.getElementById('fileTextPreview');
    const toggleBtn = document.getElementById('togglePreviewBtn');
    if (!preview) return;

    if (preview.style.display === 'none' || !preview.style.display) {
        preview.style.display = 'block';
        if (toggleBtn) toggleBtn.querySelector('span').textContent = 'Hide Text';
    } else {
        preview.style.display = 'none';
        if (toggleBtn) toggleBtn.querySelector('span').textContent = 'View Text';
    }
}

// ==========================================================================
// 7. TAB & INPUT MANAGEMENT
// ==========================================================================

function switchResumeTab(mode) {
    STATE.mode = mode;
    const tabUpload = document.getElementById('tabUpload');
    const tabText = document.getElementById('tabText');
    const fileUploadPane = document.getElementById('fileUploadPane');
    const textInputPane = document.getElementById('textInputPane');

    if (mode === 'upload') {
        tabUpload.classList.add('active');
        tabUpload.setAttribute('aria-selected', 'true');
        tabText.classList.remove('active');
        tabText.setAttribute('aria-selected', 'false');
        fileUploadPane.style.display = 'flex';
        textInputPane.style.display = 'none';
    } else {
        tabText.classList.add('active');
        tabText.setAttribute('aria-selected', 'true');
        tabUpload.classList.remove('active');
        tabUpload.setAttribute('aria-selected', 'false');
        fileUploadPane.style.display = 'none';
        textInputPane.style.display = 'flex';

        // Pre-fill text area if empty and uploaded file text exists
        const textarea = document.getElementById('resume');
        if (textarea && !textarea.value.trim() && STATE.resumeText) {
            textarea.value = STATE.resumeText;
            updateResumeCharCount();
        }
    }
}

function updateResumeCharCount() {
    const text = document.getElementById('resume').value || '';
    STATE.resumeText = text;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const counter = document.getElementById('resumeCharCount');
    if (counter) counter.textContent = `${text.length} characters • ${words} words`;
}

function updateJobDescCharCount() {
    const text = document.getElementById('jobDesc').value || '';
    STATE.jobText = text;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const counter = document.getElementById('jobCharCount');
    if (counter) counter.textContent = `${text.length} characters • ${words} words`;
}

function clearResumeText() {
    const textarea = document.getElementById('resume');
    if (textarea) textarea.value = '';
    STATE.resumeText = '';
    updateResumeCharCount();
}

function clearJobText() {
    const textarea = document.getElementById('jobDesc');
    if (textarea) textarea.value = '';
    STATE.jobText = '';
    updateJobDescCharCount();
}

function clearAll(showFeedback = false) {
    removeUploadedFile();
    clearResumeText();
    clearJobText();
    document.getElementById('targetRoleName').value = '';
    document.getElementById('sampleJobSelect').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    STATE.lastAnalysis = null;
    if (showFeedback) showToast('Workspace cleared', 'info');
}

function loadSelectedSampleJob(key) {
    if (!key || !SAMPLE_JOBS[key]) return;
    const job = SAMPLE_JOBS[key];
    document.getElementById('targetRoleName').value = job.title;
    document.getElementById('jobDesc').value = job.text;
    updateJobDescCharCount();
    showToast(`Loaded sample role: ${job.title}`, 'success');
}

function loadSampleAnalysis() {
    // Populate sample resume and sample full stack job
    switchResumeTab('text');
    document.getElementById('resume').value = SAMPLE_RESUME;
    updateResumeCharCount();

    const sampleJob = SAMPLE_JOBS.fullstack;
    document.getElementById('targetRoleName').value = sampleJob.title;
    document.getElementById('jobDesc').value = sampleJob.text;
    updateJobDescCharCount();

    // Scroll to workspace & run analysis automatically
    const workspace = document.getElementById('workspace');
    if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        analyzeResume();
    }, 400);
}

// ==========================================================================
// 8. ALGORITHMIC ANALYSIS ENGINE
// ==========================================================================

function extractTokens(text) {
    const lower = text.toLowerCase();
    // Clean punctuation, preserve technical characters like +, #, ., /
    const cleaned = lower.replace(/[^\w\s+#.-]/g, ' ');
    return cleaned.split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function extractKeywordsWithTaxonomy(resumeText, jobText) {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobText.toLowerCase();

    const jobTokens = extractTokens(jobText);
    const resumeTokens = extractTokens(resumeText);

    // Build frequency map for raw job tokens
    const jobTokenFreq = new Map();
    jobTokens.forEach(token => {
        if (!STOP_WORDS.has(token) && token.length > 2) {
            jobTokenFreq.set(token, (jobTokenFreq.get(token) || 0) + 1);
        }
    });

    const categories = {
        technicalSkills: [],
        toolsAndCloud: [],
        domainAndMethods: []
    };

    const allMatched = [];
    const allMissing = [];

    // Check predefined taxonomies
    Object.keys(TAXONOMY).forEach(catKey => {
        TAXONOMY[catKey].forEach(skill => {
            const skillRegex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
            const inJob = skillRegex.test(jobLower);

            if (inJob) {
                // Count occurrences in resume
                const resumeMatches = resumeLower.match(new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'gi')) || [];
                const count = resumeMatches.length;
                const isMatched = count > 0;

                const item = {
                    name: skill,
                    category: catKey,
                    matched: isMatched,
                    frequency: count
                };

                categories[catKey].push(item);

                if (isMatched) {
                    allMatched.push(item);
                } else {
                    allMissing.push(item);
                }
            }
        });
    });

    // Also pick high-frequency domain keywords from Job Description not already in taxonomy
    const taxonomySet = new Set([
        ...TAXONOMY.technicalSkills,
        ...TAXONOMY.toolsAndCloud,
        ...TAXONOMY.domainAndMethods
    ]);

    Array.from(jobTokenFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([token, freq]) => {
            if (!taxonomySet.has(token) && token.length > 3) {
                const resumeMatches = resumeLower.match(new RegExp(`\\b${escapeRegExp(token)}\\b`, 'gi')) || [];
                const count = resumeMatches.length;
                const isMatched = count > 0;

                const item = {
                    name: token,
                    category: 'domainAndMethods',
                    matched: isMatched,
                    frequency: count
                };

                // Avoid duplicates
                if (!categories.domainAndMethods.some(i => i.name === token)) {
                    categories.domainAndMethods.push(item);
                    if (isMatched) allMatched.push(item);
                    else allMissing.push(item);
                }
            }
        });

    return { categories, allMatched, allMissing };
}

function evaluateResumeQuality(resumeText) {
    const text = resumeText.toLowerCase();

    // 1. Contact Information
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(resumeText);
    const hasPhone = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resumeText);
    const hasLinkedIn = /linkedin\.com\/in\/|github\.com\//i.test(resumeText);
    const contactPassed = hasEmail && (hasPhone || hasLinkedIn);

    // 2. Education Section
    const educationPassed = /\b(education|bachelor|master|degree|university|college|b\.tech|b\.e|gpa|diploma)\b/i.test(text);

    // 3. Experience Section
    const experiencePassed = /\b(experience|work history|employment|career|professional experience)\b/i.test(text);

    // 4. Skills Section
    const skillsSectionPassed = /\b(skills|technical skills|technologies|competencies|proficiencies)\b/i.test(text);

    // 5. Action Verbs
    let actionVerbCount = 0;
    const foundVerbs = [];
    ACTION_VERBS.forEach(verb => {
        if (new RegExp(`\\b${verb}\\b`, 'i').test(text)) {
            actionVerbCount++;
            foundVerbs.push(verb);
        }
    });

    // 6. Quantifiable Metrics (Percentages, Numbers, Currencies, Multipliers)
    const metricMatches = resumeText.match(/\b(?:\d+[%kK+]|\$\d+|\d+\+|\d+x|\d+\s*(?:percent|users|million|thousand|projects|clients))\b/g) || [];
    const metricCount = metricMatches.length;

    // Calculate section completeness score (0 to 100)
    let sectionsScore = 0;
    if (contactPassed) sectionsScore += 25;
    if (educationPassed) sectionsScore += 25;
    if (experiencePassed) sectionsScore += 25;
    if (skillsSectionPassed) sectionsScore += 25;

    return {
        contact: { passed: contactPassed, email: hasEmail, phone: hasPhone, link: hasLinkedIn },
        education: { passed: educationPassed },
        experience: { passed: experiencePassed },
        skills: { passed: skillsSectionPassed },
        actionVerbs: { count: actionVerbCount, found: foundVerbs },
        metrics: { count: metricCount, found: metricMatches.slice(0, 5) },
        sectionsScore
    };
}

function calculateATSScore(matchedCount, totalKeywords, quality) {
    if (totalKeywords === 0) return 0;

    // Weighted Deterministic Formula:
    // - Keyword Match Ratio: 50%
    // - Skills Presence: 25%
    // - Section Completeness: 15%
    // - Action & Metrics Density: 10%

    const keywordRatio = Math.min(1, matchedCount / totalKeywords);
    const keywordScore = keywordRatio * 50;

    const sectionScore = (quality.sectionsScore / 100) * 15;

    // Action verb score (up to 5%): 6+ verbs = max
    const verbRatio = Math.min(1, quality.actionVerbs.count / 6);
    // Metric score (up to 5%): 4+ metrics = max
    const metricRatio = Math.min(1, quality.metrics.count / 4);
    const impactScore = (verbRatio * 5) + (metricRatio * 5);

    // Raw calculated score
    const totalScore = Math.round(keywordScore + (keywordRatio * 25) + sectionScore + impactScore);
    return Math.max(5, Math.min(98, totalScore));
}

function generatePersonalizedSuggestions(score, allMissing, quality) {
    const suggestions = [];

    // Priority 1: Critical Missing Keywords
    if (allMissing.length > 0) {
        const topMissing = allMissing.slice(0, 5).map(item => `"${item.name}"`).join(', ');
        suggestions.push({
            priority: 'high',
            tag: 'Critical Keyword Alignment',
            title: `Integrate High-Priority Job Keywords (${topMissing})`,
            body: `These core terms appear prominently in the target job requirements but were not detected in your resume document.`,
            example: `<strong>Optimization Tip:</strong> Incorporate these terms naturally in your Professional Summary and Experience bullet points where you have authentic relevant experience.`
        });
    }

    // Priority 2: Action Verbs & Measurable Metrics
    if (quality.metrics.count < 3) {
        suggestions.push({
            priority: 'medium',
            tag: 'Quantifiable Results',
            title: 'Add Concrete Metrics and Measurable Achievements',
            body: 'ATS parsers and recruiters prioritize resumes with measurable results over passive responsibility lists.',
            example: `<strong>Example Revision:</strong> Instead of <em>"Managed website maintenance and bug fixing"</em>, write <em>"Resolved 40+ high-priority software tickets per sprint, reducing customer-reported bug latency by 25%."</em>`
        });
    }

    if (quality.actionVerbs.count < 5) {
        suggestions.push({
            priority: 'medium',
            tag: 'Impact Language',
            title: 'Strengthen Bullet Points with High-Impact Action Verbs',
            body: 'Begin your experience statements with clear action verbs (e.g. "Architected", "Engineered", "Spearheaded", "Optimized") rather than passive phrasing.',
            example: `<strong>Example:</strong> Replace <em>"Was responsible for database design"</em> with <em>"Engineered relational PostgreSQL schemas and optimized queries to sustain 10x traffic growth."</em>`
        });
    }

    // Priority 3: Structural Section Integrity
    if (!quality.contact.passed) {
        suggestions.push({
            priority: 'high',
            tag: 'Contact Information',
            title: 'Verify Header Contact Information',
            body: 'Ensure your email address, phone number, and LinkedIn/GitHub profile URLs are clearly accessible in standard text format at the top of your resume.',
            example: `<strong>ATS Formatting Tip:</strong> Avoid placing contact info inside image headers or complex multi-column frames that some parsers bypass.`
        });
    }

    if (!quality.skills.passed) {
        suggestions.push({
            priority: 'medium',
            tag: 'Section Structure',
            title: 'Add a Dedicated "Technical Skills" Section',
            body: 'A dedicated Skills section categorized into Languages, Frameworks, and Tools allows ATS automated scanners to index your competencies directly.',
            example: `<strong>Recommended Layout:</strong> Use clean bold headings: <em>Languages: ... | Frameworks: ... | Tools & Cloud: ...</em>`
        });
    }

    if (suggestions.length === 0 || score >= 85) {
        suggestions.push({
            priority: 'info',
            tag: 'Strong Match',
            title: 'Resume is Well-Aligned with this Role',
            body: 'Your resume shows strong keyword overlap and balanced structure. Ensure your formatting remains simple and free of text boxes or non-standard tables before final submission.',
            example: `<strong>Final Polish:</strong> Proofread for clear dates and role titles that match industry standards.`
        });
    }

    return suggestions;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==========================================================================
// 9. EXECUTION & RESULTS DASHBOARD RENDERING
// ==========================================================================

function analyzeResume() {
    let resume = STATE.resumeText.trim();
    if (!resume) {
        const textVal = document.getElementById('resume').value.trim();
        if (textVal) resume = textVal;
    }

    const job = document.getElementById('jobDesc').value.trim();
    const roleName = document.getElementById('targetRoleName').value.trim() || 'Target Position';

    if (!resume) {
        showToast('Please upload your resume file or paste your resume text.', 'error');
        document.getElementById('workspace').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (!job) {
        showToast('Please enter the target job description to run ATS analysis.', 'error');
        document.getElementById('jobDesc').focus();
        return;
    }

    // Disable button & Show analysis skeleton overlay
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingSection = document.getElementById('loadingSection');
    const loadingStepText = document.getElementById('loadingStepText');
    const loadingProgressFill = document.getElementById('loadingProgressFill');

    if (analyzeBtn) analyzeBtn.disabled = true;
    if (loadingSection) loadingSection.style.display = 'flex';

    // Simulated multi-stage deterministic analysis animation
    let step = 0;
    const steps = [
        { text: 'Parsing document structure and tokenizing content...', progress: '25%' },
        { text: 'Extracting technical competencies & comparing keyword density...', progress: '55%' },
        { text: 'Evaluating section completeness and quantifiable impact...', progress: '85%' },
        { text: 'Finalizing ATS score and generating recommendations...', progress: '100%' }
    ];

    const stepInterval = setInterval(() => {
        if (step < steps.length) {
            if (loadingStepText) loadingStepText.textContent = steps[step].text;
            if (loadingProgressFill) loadingProgressFill.style.width = steps[step].progress;
            step++;
        } else {
            clearInterval(stepInterval);
            finishAnalysis(resume, job, roleName);
        }
    }, 280);
}

function finishAnalysis(resume, job, roleName) {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingSection = document.getElementById('loadingSection');

    if (analyzeBtn) analyzeBtn.disabled = false;
    if (loadingSection) loadingSection.style.display = 'none';

    // 1. Keyword & Skills extraction
    const { categories, allMatched, allMissing } = extractKeywordsWithTaxonomy(resume, job);
    const totalKeywords = allMatched.length + allMissing.length;

    // 2. Quality checklist
    const quality = evaluateResumeQuality(resume);

    // 3. Final score calculation
    const score = calculateATSScore(allMatched.length, totalKeywords, quality);

    // 4. Actionable recommendations
    const suggestions = generatePersonalizedSuggestions(score, allMissing, quality);

    // Store state
    STATE.lastAnalysis = {
        roleName,
        score,
        matchedCount: allMatched.length,
        missingCount: allMissing.length,
        totalKeywords,
        categories,
        allMatched,
        allMissing,
        quality,
        suggestions,
        timestamp: new Date()
    };

    // Save to local scan history
    saveScanToHistory({
        id: 'scan_' + Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        roleName,
        score,
        matchedCount: allMatched.length,
        missingCount: allMissing.length,
        fileName: STATE.uploadedFile ? STATE.uploadedFile.name : 'Pasted Resume Text'
    });

    // Render Results Dashboard
    renderResultsDashboard(STATE.lastAnalysis);

    // Smooth scroll to results
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    showToast('ATS Analysis complete!', 'success');
}

function renderResultsDashboard(data) {
    const { score, matchedCount, missingCount, quality, categories, suggestions, roleName } = data;

    // Top meta
    const reportMeta = document.getElementById('reportMetaText');
    if (reportMeta) {
        reportMeta.textContent = `Target Role: "${roleName}" • Evaluated ${new Date().toLocaleDateString()} • Pure Local Processing`;
    }

    const printDate = document.getElementById('printDate');
    if (printDate) {
        printDate.textContent = new Date().toLocaleString();
    }

    // 1. Score Gauge Animation
    const scoreValEl = document.getElementById('scoreValue');
    const circleFill = document.getElementById('scoreCircleFill');
    const scorePill = document.getElementById('scoreGradePill');
    const scoreStatus = document.getElementById('scoreStatus');

    if (scoreValEl) scoreValEl.textContent = `${score}%`;

    // Circumference for r=66 is ~414.69
    const circumference = 414.69;
    const offset = circumference - (score / 100) * circumference;
    if (circleFill) {
        circleFill.style.strokeDashoffset = offset;
        // Color transition based on score
        if (score >= 80) circleFill.style.stroke = 'var(--success)';
        else if (score >= 60) circleFill.style.stroke = 'var(--primary)';
        else if (score >= 40) circleFill.style.stroke = 'var(--warning)';
        else circleFill.style.stroke = 'var(--danger)';
    }

    // Status message & pill
    if (score >= 80) {
        scorePill.textContent = '🌟 Strong Match';
        scorePill.style.background = 'var(--success-bg)';
        scorePill.style.color = 'var(--success-text)';
        scoreStatus.textContent = 'Your resume aligns exceptionally well with the target role qualifications.';
    } else if (score >= 65) {
        scorePill.textContent = '✨ Good Candidate Match';
        scorePill.style.background = 'var(--primary-light)';
        scorePill.style.color = 'var(--primary)';
        scoreStatus.textContent = 'Solid baseline match. Adding a few targeted keywords will elevate your application.';
    } else if (score >= 45) {
        scorePill.textContent = '⚠️ Moderate Match';
        scorePill.style.background = 'var(--warning-bg)';
        scorePill.style.color = 'var(--warning-text)';
        scoreStatus.textContent = 'Missing key skills and tools requested in the job description.';
    } else {
        scorePill.textContent = '❌ Needs Optimization';
        scorePill.style.background = 'var(--danger-bg)';
        scorePill.style.color = 'var(--danger-text)';
        scoreStatus.textContent = 'Low keyword overlap detected. Tailor your resume before applying.';
    }

    // 2. Metric Tiles
    document.getElementById('matchedCount').textContent = matchedCount;
    document.getElementById('missingCount').textContent = missingCount;
    document.getElementById('sectionHealthValue').textContent = `${quality.sectionsScore}%`;
    document.getElementById('actionVerbCount').textContent = `${quality.actionVerbs.count + quality.metrics.count}`;

    // Filter counts
    const totalKeywords = data.totalKeywords;
    document.getElementById('countAllKeywords').textContent = totalKeywords;
    document.getElementById('countMatchedKeywords').textContent = matchedCount;
    document.getElementById('countMissingKeywords').textContent = missingCount;

    // 3. Render Categorized Keywords
    renderKeywordTags(categories, STATE.activeKeywordFilter);

    // 4. Render Skills Presence Comparison
    renderSkillsComparison(categories);

    // 5. Render Quality Checklist
    renderQualityChecklist(quality);

    // 6. Render Recommendations
    renderRecommendations(suggestions);
}

function renderKeywordTags(categories, filter = 'all') {
    const groupContainers = [
        { key: 'technicalSkills', countEl: 'techSkillsCount', tagsEl: 'techSkillsTags' },
        { key: 'toolsAndCloud', countEl: 'toolsCount', tagsEl: 'toolsTags' },
        { key: 'domainAndMethods', countEl: 'domainCount', tagsEl: 'domainTags' }
    ];

    groupContainers.forEach(group => {
        const items = categories[group.key] || [];
        const filtered = items.filter(item => {
            if (filter === 'matched') return item.matched;
            if (filter === 'missing') return !item.matched;
            return true;
        });

        const countEl = document.getElementById(group.countEl);
        if (countEl) countEl.textContent = `${filtered.length} items`;

        const tagsEl = document.getElementById(group.tagsEl);
        if (!tagsEl) return;

        if (filtered.length === 0) {
            tagsEl.innerHTML = `<span style="font-size:0.82rem; color:var(--text-muted);">No keywords in this category for selected filter.</span>`;
            return;
        }

        tagsEl.innerHTML = filtered.map(item => {
            const statusClass = item.matched ? 'matched' : 'missing';
            const freqBadge = item.matched && item.frequency > 1 ? `<span class="kw-freq">×${item.frequency}</span>` : '';
            const icon = item.matched ? '✓' : '✕';
            return `<span class="kw-tag ${statusClass}" title="${item.matched ? `Found ${item.frequency} times in resume` : 'Not identified in resume'}">
                <span>${icon} ${item.name}</span>
                ${freqBadge}
            </span>`;
        }).join('');
    });
}

function filterKeywords(filterType) {
    STATE.activeKeywordFilter = filterType;

    const btnAll = document.getElementById('btnFilterAll');
    const btnMatched = document.getElementById('btnFilterMatched');
    const btnMissing = document.getElementById('btnFilterMissing');

    [btnAll, btnMatched, btnMissing].forEach(btn => btn && btn.classList.remove('active'));

    if (filterType === 'all' && btnAll) btnAll.classList.add('active');
    if (filterType === 'matched' && btnMatched) btnMatched.classList.add('active');
    if (filterType === 'missing' && btnMissing) btnMissing.classList.add('active');

    if (STATE.lastAnalysis) {
        renderKeywordTags(STATE.lastAnalysis.categories, filterType);
    }
}

function renderSkillsComparison(categories) {
    const listEl = document.getElementById('skillsComparisonList');
    if (!listEl) return;

    // Combine top technical and domain skills
    const combined = [
        ...categories.technicalSkills,
        ...categories.toolsAndCloud,
        ...categories.domainAndMethods
    ].slice(0, 10);

    if (combined.length === 0) {
        listEl.innerHTML = `<p style="font-size:0.88rem; color:var(--text-muted); padding:10px;">No specific skills identified in job description.</p>`;
        return;
    }

    listEl.innerHTML = combined.map(skill => {
        const isFound = skill.matched;
        return `<div class="skill-row">
            <div class="skill-name-col">
                <span style="color: ${isFound ? 'var(--success)' : 'var(--text-muted)'}; font-size:1.1rem;">
                    ${isFound ? '✓' : '○'}
                </span>
                <span>${skill.name}</span>
            </div>
            <div>
                <span class="skill-status-pill ${isFound ? 'found' : 'not-found'}">
                    ${isFound ? 'Identified in Resume' : 'Not identified in document'}
                </span>
            </div>
        </div>`;
    }).join('');
}

function renderQualityChecklist(quality) {
    const checklistEl = document.getElementById('resumeChecklist');
    if (!checklistEl) return;

    const checks = [
        {
            title: 'Contact Information',
            passed: quality.contact.passed,
            desc: quality.contact.passed ? 'Email address and phone / profile links clearly identified.' : 'Missing essential contact info (email/phone/LinkedIn).'
        },
        {
            title: 'Education Section',
            passed: quality.education.passed,
            desc: quality.education.passed ? 'Standard education credentials and degrees detected.' : 'No standard Education heading or degrees detected.'
        },
        {
            title: 'Professional Experience',
            passed: quality.experience.passed,
            desc: quality.experience.passed ? 'Work history and career progression sections identified.' : 'Experience section heading is missing or unformatted.'
        },
        {
            title: 'Dedicated Skills Section',
            passed: quality.skills.passed,
            desc: quality.skills.passed ? 'Skills block indexed cleanly for automated ATS filtering.' : 'Recommend adding an explicit "Technical Skills" section.'
        },
        {
            title: 'Action Verbs Density',
            passed: quality.actionVerbs.count >= 4,
            desc: `${quality.actionVerbs.count} strong action verbs found (e.g. ${quality.actionVerbs.found.slice(0, 3).join(', ') || 'none'}).`
        },
        {
            title: 'Quantifiable Metrics & Numbers',
            passed: quality.metrics.count >= 2,
            desc: quality.metrics.count >= 2 ? `${quality.metrics.count} measurable data points/percentages detected.` : 'Add quantifiable metrics (e.g. %, $, numbers) to highlight impact.'
        }
    ];

    checklistEl.innerHTML = checks.map(item => {
        const iconClass = item.passed ? 'pass' : 'warn';
        const iconSymbol = item.passed ? '✓' : '!';
        return `<div class="check-item">
            <div class="check-icon ${iconClass}">${iconSymbol}</div>
            <div class="check-content">
                <div class="check-title">${item.title}</div>
                <div class="check-desc">${item.desc}</div>
            </div>
        </div>`;
    }).join('');
}

function renderRecommendations(suggestions) {
    const container = document.getElementById('suggestionsContainer');
    if (!container) return;

    if (suggestions.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">No specific recommendations generated.</p>`;
        return;
    }

    container.innerHTML = suggestions.map(rec => {
        return `<div class="rec-card priority-${rec.priority}">
            <div class="rec-header">
                <span class="rec-tag">${rec.tag}</span>
            </div>
            <h4 class="rec-title">${rec.title}</h4>
            <p class="rec-body">${rec.body}</p>
            ${rec.example ? `<div class="rec-example">${rec.example}</div>` : ''}
        </div>`;
    }).join('');
}

// ==========================================================================
// 10. LOCAL SCAN HISTORY
// ==========================================================================

function getScanHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveScanToHistory(entry) {
    try {
        const history = getScanHistory();
        history.unshift(entry);
        // Keep last 15 scans
        const trimmed = history.slice(0, 15);
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
        updateHistoryBadge();
    } catch (err) {
        console.warn('Could not save to history:', err);
    }
}

function updateHistoryBadge() {
    const history = getScanHistory();
    const badge = document.getElementById('historyBadgeCount');
    if (badge) badge.textContent = history.length;
}

function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    const container = document.getElementById('historyListContainer');
    if (!modal || !container) return;

    const history = getScanHistory();

    if (history.length === 0) {
        container.innerHTML = `<div class="empty-history-box">
            <div class="empty-history-icon">📭</div>
            <p><strong>No scan history yet</strong></p>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;">Run an ATS resume analysis to save summary scores locally.</p>
        </div>`;
    } else {
        container.innerHTML = history.map(item => {
            return `<div class="history-item-card">
                <div class="history-item-left">
                    <div class="history-score-badge">${item.score}%</div>
                    <div class="history-info">
                        <div class="history-role">${item.roleName || 'Job Match Scan'}</div>
                        <div class="history-meta">${item.date} • ${item.matchedCount} matched / ${item.missingCount} missing</div>
                    </div>
                </div>
                <button type="button" class="history-delete-btn" onclick="deleteHistoryItem('${item.id}', event)" title="Delete scan">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>`;
        }).join('');
    }

    modal.style.display = 'flex';
}

function closeHistoryModal(e) {
    if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close-btn')) {
        return;
    }
    const modal = document.getElementById('historyModal');
    if (modal) modal.style.display = 'none';
}

function deleteHistoryItem(id, event) {
    if (event) event.stopPropagation();
    let history = getScanHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    updateHistoryBadge();
    openHistoryModal();
    showToast('Scan deleted from history', 'info');
}

function clearAllHistory() {
    if (!confirm('Are you sure you want to clear your entire local scan history?')) return;
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    updateHistoryBadge();
    openHistoryModal();
    showToast('Scan history cleared', 'info');
}

// ==========================================================================
// 11. EXPORT & UTILITY ACTIONS
// ==========================================================================

function exportPrintReport() {
    if (!STATE.lastAnalysis) {
        showToast('Please analyze your resume before exporting report.', 'error');
        return;
    }
    window.print();
}

function startNewScan() {
    clearAll();
    const workspace = document.getElementById('workspace');
    if (workspace) workspace.scrollIntoView({ behavior: 'smooth' });
    showToast('Ready for new resume scan', 'info');
}

function copyKeywordsList() {
    if (!STATE.lastAnalysis) return;
    const filter = STATE.activeKeywordFilter;
    const { allMatched, allMissing } = STATE.lastAnalysis;

    let list = [];
    if (filter === 'matched') list = allMatched.map(i => i.name);
    else if (filter === 'missing') list = allMissing.map(i => i.name);
    else list = [...allMatched.map(i => `${i.name} (Matched)`), ...allMissing.map(i => `${i.name} (Missing)`)];

    if (list.length === 0) {
        showToast('No keywords available to copy.', 'info');
        return;
    }

    navigator.clipboard.writeText(list.join(', ')).then(() => {
        showToast(`Copied ${list.length} keywords to clipboard!`, 'success');
    }).catch(() => {
        showToast('Clipboard access denied.', 'error');
    });
}

function copySuggestionsText() {
    if (!STATE.lastAnalysis || !STATE.lastAnalysis.suggestions) return;
    const text = STATE.lastAnalysis.suggestions.map((s, idx) => {
        return `${idx + 1}. [${s.tag}] ${s.title}\n${s.body}\n${s.example ? s.example.replace(/<[^>]+>/g, '') : ''}`;
    }).join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
        showToast('Recommendations copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Clipboard access denied.', 'error');
    });
}

// ==========================================================================
// 12. DRAG & DROP AND INITIALIZATION
// ==========================================================================

function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-active');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
            processFile(dt.files[0]);
        }
    }, false);

    // Keyboard accessibility for dropzone
    dropZone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('fileInput').click();
        }
    });
}

// Initialize on page load
function initApp() {
    initTheme();
    setupDropZone();
    updateHistoryBadge();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
