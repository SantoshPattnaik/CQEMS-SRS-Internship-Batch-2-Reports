const diseaseDatabase = [
    {
        keywords: ["chest pain", "heart", "breath", "arm pain", "jaw pain", "palpitation", "sweating"],
        disease: "Heart Attack / Cardiac Issue",
        specialty: "Cardiology",
        approach: "🚨 Seek emergency medical care immediately. Call an ambulance (108). Do not drive yourself.",
        emergency: true
    },
    {
        keywords: ["headache", "numbness", "weakness", "speaking", "face drooping", "stroke", "paralysis", "vision loss"],
        disease: "Stroke / Neurological Emergency",
        specialty: "Neurology",
        approach: "🚨 Immediate emergency care required. Time is critical (FAST - Face, Arms, Speech, Time). Call 108 immediately.",
        emergency: true
    },
    {
        keywords: ["fever", "cough", "taste", "smell", "fatigue", "throat", "chills", "runny nose"],
        disease: "Viral Infection / Influenza / COVID-19",
        specialty: "General Medicine",
        approach: "Isolate yourself from others, rest well, and stay hydrated. Monitor your oxygen levels. If breathing becomes difficult, visit an emergency room."
    },
    {
        keywords: ["stomach pain", "abdomen pain", "nausea", "vomiting", "appendicitis", "belly", "diarrhea"],
        disease: "Gastrointestinal Issue / Appendicitis",
        specialty: "Gastroenterology",
        approach: "Stay hydrated with clear fluids. Do not eat solid food until a doctor evaluates you. Visit an emergency room if the pain is severe and localized."
    },
    {
        keywords: ["urine", "urinate", "thirsty", "thirst", "sugar", "diabetic", "blurred", "weight loss"],
        disease: "Diabetes / Hyperglycemia",
        specialty: "Endocrinology",
        approach: "Get your fasting blood sugar and HbA1c checked immediately. Consult an endocrinologist for a proper management plan and diet modifications."
    },
    {
        keywords: ["joint pain", "stiffness", "swelling", "knee", "bone", "back pain", "fracture", "sprain"],
        disease: "Arthritis / Orthopedic Condition",
        specialty: "Orthopedics",
        approach: "Rest the affected joint. Apply ice or heat packs depending on the injury. Consult an orthopedist for an X-ray or proper physical therapy."
    },
    {
        keywords: ["rash", "itching", "skin", "redness", "acne", "spots", "hives", "eczema"],
        disease: "Allergic Reaction / Dermatitis",
        specialty: "Dermatology",
        approach: "Avoid potential allergens. You can apply an over-the-counter soothing lotion, but consult a dermatologist if it persists or spreads."
    },
    {
        keywords: ["child", "baby", "crying", "ear", "fever in child", "pediatric", "toddler"],
        disease: "Pediatric Condition / Ear Infection",
        specialty: "Pediatrics",
        approach: "Monitor the child's temperature. Do not give aspirin. Ensure the child stays hydrated and consult your pediatrician."
    },
    {
        keywords: ["blood in cough", "chronic cough", "weight loss", "night sweats", "tb", "asthma", "wheezing", "breathless"],
        disease: "Respiratory Condition / Tuberculosis / Asthma",
        specialty: "Pulmonology",
        approach: "Wear a mask to protect others. Use prescribed inhalers if asthmatic. Visit a pulmonologist for a chest X-ray and pulmonary function tests."
    },
    {
        keywords: ["urine burning", "painful urination", "blood in urine", "kidney pain", "flank pain", "stones"],
        disease: "Urinary Tract Infection (UTI) / Kidney Stones",
        specialty: "Urology",
        approach: "Drink plenty of water to flush out bacteria. Avoid holding urine. Visit a urologist for a urine routine and culture test."
    },
    {
        keywords: ["pregnancy", "period", "bleeding", "cramps", "vaginal", "menstrual", "pcos"],
        disease: "Gynecological Condition",
        specialty: "Gynecology",
        approach: "Keep track of your symptoms and cycle. Rest and consult a gynecologist for an ultrasound or pelvic examination."
    },
    {
        keywords: ["cancer", "tumor", "lump", "chemotherapy", "radiation", "oncology"],
        disease: "Oncology Issue",
        specialty: "Oncology",
        approach: "Do not panic. Bring all your previous scans and reports. Consult an oncologist for a proper biopsy or comprehensive treatment plan."
    }
];

function analyzeSymptoms(text) {
    text = text.toLowerCase();

    let bestMatch = null;
    let maxMatches = 0;

    for (const condition of diseaseDatabase) {
        let matches = 0;
        for (const keyword of condition.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                matches++;
            }
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = condition;
        }
    }

    // If no match found, fallback
    if (!bestMatch) {
        return {
            disease: "Unclear Condition",
            specialty: "General Medicine",
            approach: "Your symptoms are not clearly matching a specific condition in my database. It is highly recommended to visit a General Physician for a complete physical examination.",
            emergency: false
        };
    }

    return bestMatch;
}

// State Management for Chatbot
let chatState = 'ASKING_SYMPTOMS';
let currentSymptoms = '';

// UI Handling
function toggleChat() {
    const container = document.getElementById('chatbot-container');
    const icon = document.getElementById('chat-toggle-icon');

    container.classList.toggle('minimized');

    if (container.classList.contains('minimized')) {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
        document.getElementById('chat-input').focus();
    }
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function appendMessage(sender, text, isHtml = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    if (isHtml) {
        msgDiv.innerHTML = text;
    } else {
        msgDiv.innerText = text;
    }

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    const typingId = 'typing-' + Date.now();

    if (chatState === 'ASKING_SYMPTOMS') {
        // Save symptoms and update state
        currentSymptoms = text;
        chatState = 'ASKING_INTENSITY';

        appendMessage('bot', `<span class="typing-indicator" id="${typingId}">Thinking...</span>`, true);

        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl && typingEl.parentElement) typingEl.parentElement.remove();

            appendMessage('bot', "Could you please tell me how severe these symptoms are on a scale of 1 to 10? Also, roughly how long have you been experiencing them?");
        }, 800);

    } else if (chatState === 'ASKING_INTENSITY') {
        const intensityInput = text;
        chatState = 'ASKING_SYMPTOMS'; // Reset for next iteration

        appendMessage('bot', `<span class="typing-indicator" id="${typingId}">Analysing...</span>`, true);

        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl && typingEl.parentElement) typingEl.parentElement.remove();

            // Extract severity from the user input
            let severityNum = 5; // default moderate
            const numMatch = intensityInput.match(/([0-9]+)/);
            if (numMatch) {
                const val = parseInt(numMatch[1]);
                if (val >= 1 && val <= 10) severityNum = val;
            }
            if (intensityInput.toLowerCase().includes('mild') || intensityInput.toLowerCase().includes('little bit')) severityNum = 2;
            if (intensityInput.toLowerCase().includes('severe') || intensityInput.toLowerCase().includes('very bad') || intensityInput.toLowerCase().includes('unbearable')) severityNum = 8;

            // Analyze based on the ORIGINAL symptoms provided in the first step
            let analysis = analyzeSymptoms(currentSymptoms);

            let severityContext = "";
            let finalSpecialty = analysis.specialty;
            let finalApproach = analysis.approach;

            // Adjust recommendations based on severity and emergency flags
            if (analysis.emergency) {
                severityContext = "⚠️ Even if it feels mild right now, these specific symptoms can be very dangerous.";
            } else if (severityNum <= 3) {
                severityContext = "Since your symptoms seem quite mild, you likely don't need a top specialist right away. A simple check-up with a General Physician is usually perfectly sufficient.";
                finalSpecialty = "General Medicine";
                finalApproach = "Monitor your symptoms at home, get plenty of rest, and stay hydrated. If they persist or worsen, visit a General Physician for a check-up.";
            } else if (severityNum <= 6) {
                severityContext = "Your symptoms seem moderately severe. It is a good idea to schedule a consultation soon to prevent it from getting worse.";
            } else {
                severityContext = "Given the high severity of your symptoms, you should seek medical attention as quickly as possible.";
            }

            let botResponse = `Based on your specific symptoms, this might be related to <strong>${analysis.disease}</strong>.<br><br>`;
            botResponse += `<em>${severityContext}</em><br><br>`;
            botResponse += `<strong>👨‍⚕️ Recommended Specialist:</strong> ${finalSpecialty}<br>`;
            botResponse += `<strong>📋 Best Approach:</strong> ${finalApproach}<br><br>`;

            // Find a recommended doctor based on the updated final specialty
            if (typeof getDoctors === 'function') {
                const allDocs = getDoctors();
                const specialists = allDocs.filter(d => d.specialty === finalSpecialty).sort((a, b) => b.rating - a.rating);

                if (specialists.length > 0) {
                    const doc = specialists[0];
                    botResponse += `Here is a highly rated specialist you can consult:<br>`;
                    botResponse += `
                    <div class="doc-suggestion">
                        <img src="${doc.image}" alt="${doc.name}">
                        <div class="doc-suggestion-info">
                        <h4>${doc.name}</h4>
                        <p><i class="fa-solid fa-star" style="color:#fbbf24;"></i> ${doc.rating} | ${doc.experience} Yrs Exp.</p>
                        </div>
                    </div>
                    <button class="btn btn-secondary" style="margin-top:0.5rem; padding:0.5rem 1rem; font-size:0.8rem;" onclick="location.hash='#doctors'; document.getElementById('specialty-filter').value='${finalSpecialty}'; filterDoctors();">View All ${finalSpecialty}s</button>
                    `;
                } else if (finalSpecialty !== "General Medicine") {
                    // Fallback to General Physician if no specialist found
                    const gpDocs = allDocs.filter(d => d.specialty === "General Medicine").sort((a, b) => b.rating - a.rating);
                    if (gpDocs.length > 0) {
                        const gp = gpDocs[0];
                        botResponse += `I couldn't find a top ${finalSpecialty} at the moment, but here is a highly rated General Physician you can consult:<br>`;
                        botResponse += `
                        <div class="doc-suggestion">
                            <img src="${gp.image}" alt="${gp.name}">
                            <div class="doc-suggestion-info">
                            <h4>${gp.name}</h4>
                            <p><i class="fa-solid fa-star" style="color:#fbbf24;"></i> ${gp.rating} | ${gp.experience} Yrs Exp.</p>
                            </div>
                        </div>
                        <button class="btn btn-secondary" style="margin-top:0.5rem; padding:0.5rem 1rem; font-size:0.8rem;" onclick="location.hash='#doctors'; document.getElementById('specialty-filter').value='General Medicine'; filterDoctors();">View All General Physicians</button>
                        `;
                    }
                }
            }

            appendMessage('bot', botResponse, true);
        }, 1200);
    }
}
