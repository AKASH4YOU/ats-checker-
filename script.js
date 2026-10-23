// KEYWORD EXTRACTION
function extractKeywords(text) {
    // Common stop words
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'from', 'is', 'are', 'am', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
        'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
        'when', 'where', 'why', 'how', 'as', 'if', 'so', 'because', 'while', 'through', 'during',
        'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
        'further', 'then', 'once', 'very', 'too', 'just', 'only', 'own', 'same', 'no', 'nor',
        'not', 'my', 'his', 'her', 'its', 'our', 'your', 'their', 'there', 'here'
    ]);

    // Technical skills keywords
    const techKeywords = [
        'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'typescript',
        'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'spring',
        'sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'firebase',
        'html', 'css', 'json', 'xml', 'api', 'rest', 'graphql',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
        'git', 'agile', 'scrum', 'jira', 'slack',
        'machine learning', 'deep learning', 'ai', 'nlp', 'computer vision',
        'data science', 'analytics', 'tableau', 'power bi', 'excel',
        'communication', 'leadership', 'problem solving', 'teamwork', 'collaboration'
    ];

    // Convert to lowercase and split
    let words = text.toLowerCase().match(/\b[\w\s+#\-]+\b/g) || [];
    
    // Filter and extract meaningful keywords
    let keywords = new Map();
    
    words.forEach(word => {
        word = word.trim();
        if (word.length > 2 && !stopWords.has(word)) {
            keywords.set(word, (keywords.get(word) || 0) + 1);
        }
    });

    // Add tech keywords with boosted score
    techKeywords.forEach(tech => {
        if (text.toLowerCase().includes(tech)) {
            keywords.set(tech, (keywords.get(tech) || 0) + 5);
        }
    });

    // Sort by frequency
    return Array.from(keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(entry => entry[0]);
}

// ANALYZE RESUME
function analyzeResume() {
    const resume = document.getElementById('resume').value.trim();
    const jobDesc = document.getElementById('jobDesc').value.trim();

    if (!resume || !jobDesc) {
        alert('Please enter both resume and job description');
        return;
    }

    showLoading(true);

    setTimeout(() => {
        const resumeKeywords = extractKeywords(resume);
        const jobKeywords = extractKeywords(jobDesc);

        // Calculate matches
        const matchedSet = new Set(resumeKeywords.filter(k => jobKeywords.includes(k)));
        const missingSet = new Set(jobKeywords.filter(k => !resumeKeywords.includes(k)));

        const matched = Array.from(matchedSet);
        const missing = Array.from(missingSet).slice(0, 15);

        // Calculate score
        const score = Math.round((matched.length / jobKeywords.length) * 100);

        // Display results
        displayResults(score, matched, missing, jobKeywords);
        showLoading(false);
    }, 500);
}

// DISPLAY RESULTS
function displayResults(score, matched, missing, jobKeywords) {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'flex';

    // Update score
    document.getElementById('scoreValue').textContent = score + '%';
    document.getElementById('matchedCount').textContent = matched.length;
    document.getElementById('missingCount').textContent = missing.length;

    // Status message
    let status = '';
    if (score >= 80) status = '🌟 Excellent! Your resume is well-optimized';
    else if (score >= 60) status = '✨ Good! Add a few more keywords';
    else if (score >= 40) status = '⚠️ Fair! Missing key qualifications';
    else status = '❌ Poor! Add more relevant keywords';

    document.getElementById('scoreStatus').textContent = status;

    // Matched keywords
    const matchedHtml = matched.map(k => 
        `<span class="keyword-tag matched">${k}</span>`
    ).join('');
    document.getElementById('matchedKeywords').innerHTML = matchedHtml || 'No matches yet';

    // Missing keywords
    const missingHtml = missing.map(k => 
        `<span class="keyword-tag missing">${k}</span>`
    ).join('');
    document.getElementById('missingKeywords').innerHTML = missingHtml || 'All keywords matched!';

    // Suggestions
    const suggestions = generateSuggestions(score, missing, matched);
    const suggestionsHtml = suggestions.map(s => 
        `<div class="suggestion-item">${s}</div>`
    ).join('');
    document.getElementById('suggestionsContainer').innerHTML = suggestionsHtml;
}

// GENERATE SUGGESTIONS
function generateSuggestions(score, missing, matched) {
    const suggestions = [];

    if (score < 40) {
        suggestions.push('<strong>Critical:</strong> Add technical skills that match the job description');
        suggestions.push('<strong>Important:</strong> Include industry-specific keywords in your professional summary');
    }

    if (missing.length > 0) {
        const topMissing = missing.slice(0, 3).join(', ');
        suggestions.push(`<strong>Missing Keywords:</strong> Add "${topMissing}" to your resume`);
    }

    if (score >= 40 && score < 60) {
        suggestions.push('<strong>Tip:</strong> Highlight these skills more prominently in your experience section');
    }

    if (matched.length > 0) {
        suggestions.push(`<strong>✅ Great:</strong> You have ${matched.length} key skills - make sure they're easy for ATS to find`);
    }

    if (score < 70) {
        suggestions.push('<strong>Optimize:</strong> Use cleaner formatting - avoid tables, graphics, and complex layouts');
        suggestions.push('<strong>Format:</strong> Save as .docx or .pdf to ensure ATS compatibility');
    }

    if (suggestions.length === 0) {
        suggestions.push('<strong>Perfect!</strong> Your resume matches the job description very well!');
    }

    return suggestions;
}

// Configure PDF.js Worker
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// EXTRACT TEXT FROM PDF
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

// EXTRACT TEXT FROM DOCX
async function extractTextFromDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return (result.value || '').trim();
}

// HANDLE FILE UPLOAD
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const resumeArea = document.getElementById('resume');
    const uploadBtn = document.getElementById('uploadBtn');
    const statusEl = document.getElementById('uploadStatus');
    const fileName = file.name;
    const lowerName = fileName.toLowerCase();

    const setStatus = (msg, type = '') => {
        if (statusEl) {
            statusEl.textContent = msg;
            statusEl.className = 'upload-status ' + type;
        }
    };

    setStatus(`⏳ Reading ${fileName}...`);
    if (uploadBtn) uploadBtn.disabled = true;

    try {
        let extractedText = '';

        if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
            if (!window.pdfjsLib) {
                throw new Error('PDF parsing library failed to load. Please check your internet connection.');
            }
            extractedText = await extractTextFromPDF(file);
            
            if (!extractedText || extractedText.length < 10) {
                alert('⚠️ No readable text found in this PDF. If this is a scanned document/image, ATS checkers require selectable text. Please upload a text-based PDF or paste your resume text directly.');
            }
        } else if (lowerName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
            if (!window.mammoth) {
                throw new Error('Word document parsing library failed to load.');
            }
            extractedText = await extractTextFromDocx(file);
        } else {
            // Standard plain text (.txt or other text files)
            extractedText = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(new Error('Failed to read text file'));
                reader.readAsText(file);
            });
        }

        resumeArea.value = extractedText;
        setStatus(`✅ Loaded: ${fileName}`, 'success');
    } catch (err) {
        console.error('File parsing error:', err);
        setStatus(`❌ Failed to read ${fileName}`, 'error');
        alert(`Could not extract text from "${fileName}": ${err.message || 'Unknown error'}`);
    } finally {
        if (uploadBtn) uploadBtn.disabled = false;
        event.target.value = ''; // Reset input to allow re-uploading the same file
    }
}

// SHOW/HIDE LOADING
function showLoading(show) {
    document.getElementById('loadingSection').style.display = show ? 'block' : 'none';
}

// CLEAR ALL
function clearAll() {
    document.getElementById('resume').value = '';
    document.getElementById('jobDesc').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('fileInput').value = '';
    const statusEl = document.getElementById('uploadStatus');
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'upload-status';
    }
}

