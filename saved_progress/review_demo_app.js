(function () {
  const config = window.__STAMPEDIA_CONFIG__ || {};
  const data = window.StampediaReviewData;
  const STORAGE_KEY = data.storageKey;
  const MAX_REVIEW_ENTRIES = data.maxReviewEntries;
  const STRUCTURED_QUESTION_LIMIT = data.structuredQuestionLimit;

  const state = loadState();
  state.activeSession = null;
  state.speechRecognition = null;
  state.voiceSeedText = "";

  const elements = {
    apiKeyButton: document.getElementById("apiKeyButton"),
    verifiedStayRail: document.getElementById("verifiedStayRail"),
    verifiedQueueCount: document.getElementById("verifiedQueueCount"),
    passportGrid: document.getElementById("passportGrid"),
    statStampCount: document.getElementById("statStampCount"),
    statCountryCount: document.getElementById("statCountryCount"),
    statFollowerCount: document.getElementById("statFollowerCount"),
    sidebarStampCount: document.getElementById("sidebarStampCount"),
    passportStatusNote: document.getElementById("passportStatusNote"),
    sweepstakesEntryTotal: document.getElementById("sweepstakesEntryTotal"),
    generatedReviewFeed: document.getElementById("generatedReviewFeed"),
    reviewConfirmationBanner: document.getElementById("reviewConfirmationBanner"),
    reviewConfirmationText: document.getElementById("reviewConfirmationText"),
    reviewModal: document.getElementById("reviewModal"),
    closeModalButton: document.getElementById("closeModalButton"),
    modalHotelTitle: document.getElementById("modalHotelTitle"),
    modalHotelMeta: document.getElementById("modalHotelMeta"),
    modalEntryCounter: document.getElementById("modalEntryCounter"),
    modalAiStatus: document.getElementById("modalAiStatus"),
    modalQuestionScore: document.getElementById("modalQuestionScore"),
    modalRankingSource: document.getElementById("modalRankingSource"),
    modalHotelGapScore: document.getElementById("modalHotelGapScore"),
    modalPreferenceScore: document.getElementById("modalPreferenceScore"),
    modalUrgencyScore: document.getElementById("modalUrgencyScore"),
    modalReasonStrip: document.getElementById("modalReasonStrip"),
    modalQuestionStep: document.getElementById("modalQuestionStep"),
    modalQuestionText: document.getElementById("modalQuestionText"),
    modalQuestionHelper: document.getElementById("modalQuestionHelper"),
    modalOptionRow: document.getElementById("modalOptionRow"),
    questionResponseBox: document.getElementById("questionResponseBox"),
    voiceButton: document.getElementById("voiceButton"),
    voiceStatus: document.getElementById("voiceStatus"),
    modalQuestionReason: document.getElementById("modalQuestionReason"),
    traditionalStarRow: document.getElementById("traditionalStarRow"),
    traditionalReviewBox: document.getElementById("traditionalReviewBox"),
    doneReviewButton: document.getElementById("doneReviewButton"),
    continueButton: document.getElementById("continueButton")
  };

  init();

  function init() {
    renderAll();
    bindEvents();
  }

  function defaultState() {
    return {
      reviewedStays: {},
      totalSweepstakesEntries: 0,
      recentPassportCities: ["Barcelona", "Kyoto", "Paris", "Dubai", "New York"],
      generatedPosts: [],
      baseStampCount: 14,
      baseCountryCount: 8,
      baseFollowerCount: 247
    };
  }

  function loadState() {
    try {
      return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (error) {
      return defaultState();
    }
  }

  function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      reviewedStays: state.reviewedStays,
      totalSweepstakesEntries: state.totalSweepstakesEntries,
      recentPassportCities: state.recentPassportCities,
      generatedPosts: state.generatedPosts,
      baseStampCount: state.baseStampCount,
      baseCountryCount: state.baseCountryCount,
      baseFollowerCount: state.baseFollowerCount
    }));
  }

  function bindEvents() {
    elements.apiKeyButton.addEventListener("click", handleApiKeyButtonClick);
    elements.verifiedStayRail.addEventListener("click", handleStayRailClick);
    elements.closeModalButton.addEventListener("click", closeReviewModal);
    elements.reviewModal.addEventListener("click", (event) => {
      if (event.target === elements.reviewModal) {
        closeReviewModal();
      }
    });
    elements.modalOptionRow.addEventListener("click", handleOptionClick);
    elements.questionResponseBox.addEventListener("input", handleQuestionInput);
    elements.traditionalReviewBox.addEventListener("input", handleTraditionalInput);
    elements.traditionalStarRow.addEventListener("click", handleStarClick);
    elements.voiceButton.addEventListener("click", toggleVoiceCapture);
    elements.continueButton.addEventListener("click", handleContinueClick);
    elements.doneReviewButton.addEventListener("click", handleDoneClick);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.activeSession) {
        closeReviewModal();
      }
    });
  }

  function renderAll() {
    renderApiButton();
    renderVerifiedStayRail();
    renderPassportPanel();
    renderGeneratedFeed();
  }

  function renderApiButton() {
    if (resolveApiKey()) {
      elements.apiKeyButton.textContent = "ChatGPT review assistant connected";
      elements.apiKeyButton.classList.add("connected");
    } else {
      elements.apiKeyButton.textContent = "Add OpenAI key";
      elements.apiKeyButton.classList.remove("connected");
    }
  }

  function renderVerifiedStayRail() {
    const remaining = data.verifiedStays.filter((stay) => !state.reviewedStays[stay.id]).length;
    elements.verifiedQueueCount.textContent = remaining === 1 ? "1 ready to review" : remaining + " ready to review";

    elements.verifiedStayRail.innerHTML = data.verifiedStays.map((stay) => {
      const reviewed = Boolean(state.reviewedStays[stay.id]);
      const topCandidate = buildLocalQuestionRanking(stay)[0];
      return `
        <button class="stay-card" data-stay-id="${stay.id}" type="button" ${reviewed ? "disabled" : ""}>
          <div class="stay-photo ${stay.theme}">
            <div class="sky-orb"></div>
            <div class="hotel-block hotel-main"></div>
            <div class="hotel-block hotel-side"></div>
            <div class="hotel-block hotel-annex"></div>
            <div class="waterline"></div>
            <div class="verified-flag">Verified stay</div>
            <div class="stay-placard">
              <strong>${stay.displayName}</strong>
              <span>${stay.city}, ${stay.country}</span>
            </div>
          </div>
          <div class="stay-card-body">
            <div class="stay-card-topline">
              <strong>Checked out ${stay.checkedOutOn}</strong>
              <span class="stay-score">${formatScore(topCandidate.compositeScore)}</span>
            </div>
            <div class="stay-card-bottomline top-gap-sm">
              <span>${data.topicLabels[topCandidate.topic]} is the top gap</span>
              <span>${stay.nights} night${stay.nights > 1 ? "s" : ""}</span>
            </div>
            <div class="stay-lockout">${reviewed ? "Already reviewed for this confirmed stay" : "Open popup review"}</div>
          </div>
        </button>
      `;
    }).join("");
  }

  function renderPassportPanel() {
    const reviewedCount = Object.keys(state.reviewedStays).length;
    const stampCount = state.baseStampCount + reviewedCount;
    const countryCount = Math.max(state.baseCountryCount, countVisitedCountries());
    elements.statStampCount.textContent = stampCount;
    elements.statCountryCount.textContent = countryCount;
    elements.statFollowerCount.textContent = state.baseFollowerCount;
    elements.sidebarStampCount.textContent = stampCount + " passport stamps";
    elements.sweepstakesEntryTotal.textContent = state.totalSweepstakesEntries + (state.totalSweepstakesEntries === 1 ? " entry this session" : " entries this session");
    elements.passportStatusNote.textContent = stampCount >= 15
      ? "Europe Explorer is now unlocked in the demo passport after the latest reviewed stay."
      : "One more reviewed stay unlocks the Europe Explorer milestone in the demo passport.";

    const slots = state.recentPassportCities.slice(0, 6);
    while (slots.length < 6) {
      slots.push(null);
    }
    elements.passportGrid.innerHTML = slots.map((city) => city
      ? `<div class="stamp-card"><strong>${city}</strong><span>Passport added</span></div>`
      : `<div class="stamp-card locked"><strong>Next</strong><span>Awaiting review</span></div>`
    ).join("");
  }

  function renderGeneratedFeed() {
    if (!state.generatedPosts.length) {
      elements.generatedReviewFeed.innerHTML = "";
      return;
    }
    elements.generatedReviewFeed.innerHTML = state.generatedPosts.map((post) => `
      <article class="post-card card">
        <div class="post-head">
          <div class="avatar avatar-green">${initials(post.author)}</div>
          <div class="post-head-meta">
            <strong>${post.author}</strong>
            <span>${post.location} | Just now</span>
          </div>
          <div class="post-stamp">New passport stamp</div>
        </div>
        <div class="post-hero green"></div>
        <div class="post-body">
          <div class="post-review">
            <strong>${post.headline}</strong>
            <p>${post.summary}</p>
            <div class="tag-row">${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </div>
          <div class="post-actions">${post.entries} sweepstakes entr${post.entries === 1 ? "y" : "ies"} | Passport updated | ${post.aiMode}</div>
        </div>
      </article>
    `).join("");
  }

  function handleApiKeyButtonClick() {
    const response = window.prompt(
      "Paste an OpenAI API key for live ChatGPT question ranking and review drafting. Leave blank to clear the saved key.",
      resolveApiKey()
    );
    if (response === null) {
      return;
    }
    const trimmed = response.trim();
    if (trimmed) {
      localStorage.setItem("stampedia.openai.apiKey", trimmed);
    } else {
      localStorage.removeItem("stampedia.openai.apiKey");
    }
    renderApiButton();
  }

  function handleStayRailClick(event) {
    const card = event.target.closest("[data-stay-id]");
    if (!card) {
      return;
    }
    const stay = data.verifiedStays.find((item) => item.id === card.dataset.stayId);
    if (!stay || state.reviewedStays[stay.id]) {
      return;
    }
    openReviewModal(stay);
  }

  function openReviewModal(stay) {
    state.activeSession = {
      stayId: stay.id,
      stay: stay,
      rankedQuestions: buildLocalQuestionRanking(stay).slice(0, STRUCTURED_QUESTION_LIMIT),
      additionalPrompt: buildAdditionalPrompt(stay),
      answers: {},
      currentStepIndex: 0,
      traditionalReviewText: "",
      traditionalStars: 0,
      aiStatus: resolveApiKey() ? "ChatGPT tuning question order..." : "Local ranking",
      aiMode: resolveApiKey() ? "ChatGPT pending" : "Local fallback",
      aiCanReplaceQuestions: true,
      submissionPending: false
    };
    stopVoiceCapture(true);
    elements.reviewModal.classList.add("visible");
    document.body.classList.add("modal-open");
    renderModal();
    if (resolveApiKey()) {
      rerankQuestionsWithChatGPT(state.activeSession).catch(() => {
        if (state.activeSession && state.activeSession.stayId === stay.id) {
          state.activeSession.aiStatus = "Local ranking";
          state.activeSession.aiMode = "Local fallback";
          renderModal();
        }
      });
    }
  }

  function closeReviewModal() {
    stopVoiceCapture(true);
    state.activeSession = null;
    elements.reviewModal.classList.remove("visible");
    document.body.classList.remove("modal-open");
  }

  function buildAdditionalPrompt(stay) {
    return {
      id: "additional",
      topic: "additional",
      question: "Anything else you want future guests to know about " + stay.displayName + "?",
      helperText: "This final step is intentionally open so the guest can add nuance that did not fit the targeted questions.",
      longReason: "The hackathon brief emphasizes low-friction follow-ups first, then a catch-all note for anything still missing from the review record.",
      reasonPills: ["Final open text field", "No answer bubbles", "Voice dictation still available"],
      options: []
    };
  }

  function buildLocalQuestionRanking(stay) {
    return stay.questionCandidates.map((candidate) => {
      const fit = data.userProfile.topicWeights[candidate.topic] || 60;
      const coverageGap = (1 - candidate.recentSignalShare) * 100;
      const urgency = Math.min(100, (coverageGap * 0.6) + (candidate.staleness * 100 * 0.4));
      const composite = (candidate.score * 0.55) + (fit * 0.25) + (urgency * 0.20);
      return {
        id: candidate.topic,
        topic: candidate.topic,
        question: candidate.question,
        helperText: "This prompt refreshes " + data.topicLabels[candidate.topic] + " because the property signal is stale, missing, or both.",
        longReason: "Hotel opportunity " + formatScore(candidate.score) + ", user fit " + formatScore(fit) + ", urgency " + formatScore(urgency) + ".",
        hotelOpportunityScore: candidate.score,
        userPreferenceFit: fit,
        urgencyScore: urgency,
        compositeScore: composite,
        recentSignalShare: candidate.recentSignalShare,
        daysSinceLastSignal: candidate.daysSinceLastSignal,
        reasonPills: [
          data.topicLabels[candidate.topic] + " matters to Jamie",
          Math.round(candidate.daysSinceLastSignal) + " days since strong signal",
          Math.round(candidate.recentSignalShare * 100) + "% recent coverage"
        ],
        options: data.fallbackTopicOptions[candidate.topic] || []
      };
    }).sort((left, right) => right.compositeScore - left.compositeScore);
  }

  function renderModal() {
    const session = state.activeSession;
    if (!session) {
      return;
    }
    const stay = session.stay;
    const prompt = getCurrentPrompt(session);
    const saved = session.answers[prompt.id] || { text: "", selectedOption: "" };
    const additional = prompt.id === "additional";

    elements.modalHotelTitle.textContent = stay.displayName;
    elements.modalHotelMeta.textContent = `${stay.city}, ${stay.country} | Verified checkout ${stay.checkedOutOn} | Expedia guest score ${stay.expediaScore.toFixed(1)} | ${stay.propertySummary}`;
    elements.modalEntryCounter.textContent = countEntries(session) + " / " + MAX_REVIEW_ENTRIES;
    elements.modalAiStatus.textContent = session.aiStatus;
    elements.modalQuestionStep.textContent = additional ? "Question 5 of 5" : `Question ${session.currentStepIndex + 1} of 5`;
    elements.modalQuestionText.textContent = prompt.question;
    elements.modalQuestionHelper.textContent = prompt.helperText;
    elements.modalQuestionReason.textContent = prompt.longReason;
    elements.questionResponseBox.value = saved.text || "";
    elements.traditionalReviewBox.value = session.traditionalReviewText || "";

    if (additional) {
      elements.modalQuestionScore.textContent = "Open prompt";
      elements.modalHotelGapScore.textContent = "-";
      elements.modalPreferenceScore.textContent = "-";
      elements.modalUrgencyScore.textContent = "-";
      elements.modalRankingSource.textContent = "Ranking source: final catch-all prompt";
      elements.modalReasonStrip.innerHTML = `<span class="reason-pill">Use the last step for anything that did not fit the targeted questions.</span>`;
    } else {
      elements.modalQuestionScore.textContent = formatScore(prompt.compositeScore);
      elements.modalHotelGapScore.textContent = formatScore(prompt.hotelOpportunityScore);
      elements.modalPreferenceScore.textContent = formatScore(prompt.userPreferenceFit);
      elements.modalUrgencyScore.textContent = formatScore(prompt.urgencyScore);
      elements.modalRankingSource.textContent = session.aiMode === "ChatGPT reranked"
        ? "Ranking source: local score + ChatGPT reranking"
        : "Ranking source: property gaps + user fit";
      elements.modalReasonStrip.innerHTML = prompt.reasonPills.map((item) => `<span class="reason-pill">${item}</span>`).join("");
    }

    elements.modalOptionRow.innerHTML = (prompt.options || []).map((option) => `
      <button class="answer-pill ${saved.selectedOption === option ? "active" : ""}" data-option="${escapeHtml(option)}" type="button">${option}</button>
    `).join("");

    renderStars(session.traditionalStars);
    const lastStep = session.currentStepIndex >= MAX_REVIEW_ENTRIES - 1;
    elements.continueButton.style.display = lastStep ? "none" : "inline-flex";
    elements.continueButton.textContent = session.currentStepIndex === STRUCTURED_QUESTION_LIMIT - 1 ? "Continue to final prompt" : "Continue";
    elements.doneReviewButton.disabled = session.submissionPending;
    elements.continueButton.disabled = session.submissionPending;
    elements.voiceButton.disabled = session.submissionPending;
  }

  function renderStars(active) {
    elements.traditionalStarRow.innerHTML = "";
    for (let i = 1; i <= 5; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "star-btn" + (i <= active ? " active" : "");
      button.dataset.star = String(i);
      button.textContent = "Star";
      elements.traditionalStarRow.appendChild(button);
    }
  }

  function getCurrentPrompt(session) {
    return session.currentStepIndex >= STRUCTURED_QUESTION_LIMIT ? session.additionalPrompt : session.rankedQuestions[session.currentStepIndex];
  }

  function handleOptionClick(event) {
    const pill = event.target.closest("[data-option]");
    if (!pill || !state.activeSession) {
      return;
    }
    markInteraction();
    const prompt = getCurrentPrompt(state.activeSession);
    state.activeSession.answers[prompt.id] = { text: pill.dataset.option, selectedOption: pill.dataset.option };
    elements.questionResponseBox.value = pill.dataset.option;
    renderModal();
  }

  function handleQuestionInput() {
    if (!state.activeSession) {
      return;
    }
    markInteraction();
    const prompt = getCurrentPrompt(state.activeSession);
    const value = elements.questionResponseBox.value;
    const previous = state.activeSession.answers[prompt.id] || { selectedOption: "" };
    state.activeSession.answers[prompt.id] = {
      text: value,
      selectedOption: previous.selectedOption === value ? previous.selectedOption : ""
    };
    elements.modalEntryCounter.textContent = countEntries(state.activeSession) + " / " + MAX_REVIEW_ENTRIES;
  }

  function handleTraditionalInput() {
    if (state.activeSession) {
      state.activeSession.traditionalReviewText = elements.traditionalReviewBox.value;
    }
  }

  function handleStarClick(event) {
    const star = event.target.closest("[data-star]");
    if (!star || !state.activeSession) {
      return;
    }
    state.activeSession.traditionalStars = Number(star.dataset.star);
    renderStars(state.activeSession.traditionalStars);
  }

  function handleContinueClick() {
    const session = state.activeSession;
    if (!session) {
      return;
    }
    saveCurrentDraft();
    const prompt = getCurrentPrompt(session);
    if (!filled(session.answers[prompt.id])) {
      elements.voiceStatus.textContent = "Answer the current question first to earn the next entry.";
      return;
    }
    session.currentStepIndex += 1;
    stopVoiceCapture(true);
    renderModal();
  }

  async function handleDoneClick() {
    const session = state.activeSession;
    if (!session || session.submissionPending) {
      return;
    }
    saveCurrentDraft();
    const hasQuestionAnswer = countEntries(session) > 0;
    const hasClassicReview = session.traditionalStars > 0 || Boolean((session.traditionalReviewText || "").trim());
    if (!hasQuestionAnswer && !hasClassicReview) {
      elements.voiceStatus.textContent = "Add at least one answer or a traditional review before submitting.";
      return;
    }
    session.submissionPending = true;
    elements.doneReviewButton.textContent = "Submitting...";
    renderModal();

    try {
      const summary = resolveApiKey() ? await buildAiSummary(session) : buildFallbackSummary(session);
      finalizeSubmission(session, summary);
    } catch (error) {
      finalizeSubmission(session, buildFallbackSummary(session));
    }
  }

  function finalizeSubmission(session, summary) {
    const entries = countEntries(session);
    const stay = session.stay;
    state.reviewedStays[stay.id] = { submittedAt: new Date().toISOString(), entries: entries, answers: session.answers };
    state.totalSweepstakesEntries += entries;
    state.recentPassportCities = [stay.passportLabel].concat(state.recentPassportCities.filter((city) => city !== stay.passportLabel)).slice(0, 6);
    state.generatedPosts.unshift({
      author: data.userProfile.fullName,
      location: `${stay.city}, ${stay.country}`,
      headline: summary.headline,
      summary: summary.summary,
      tags: summary.tags,
      entries: entries,
      aiMode: summary.aiMode
    });
    persistState();
    renderAll();
    renderConfirmation(stay, entries, summary.aiMode);
    closeReviewModal();
    elements.doneReviewButton.textContent = "Done with review";
  }

  function renderConfirmation(stay, entries, aiMode) {
    elements.reviewConfirmationBanner.classList.add("visible");
    elements.reviewConfirmationText.innerHTML = `
      <strong>Review submitted for ${stay.displayName}</strong>
      <span>${entries} sweepstakes entr${entries === 1 ? "y was" : "ies were"} added. ${stay.passportLabel} is now stamped into Jamie's passport, and the review card was ${aiMode === "ChatGPT summary" ? "drafted with ChatGPT." : "saved with local fallback summary."}</span>
    `;
  }

  function saveCurrentDraft() {
    if (!state.activeSession) {
      return;
    }
    const prompt = getCurrentPrompt(state.activeSession);
    state.activeSession.answers[prompt.id] = Object.assign({}, state.activeSession.answers[prompt.id], {
      text: elements.questionResponseBox.value.trim()
    });
    state.activeSession.traditionalReviewText = elements.traditionalReviewBox.value.trim();
  }

  function countEntries(session) {
    return Math.min(Object.values(session.answers).filter(filled).length, MAX_REVIEW_ENTRIES);
  }

  function filled(answer) {
    return Boolean(answer && String(answer.text || "").trim());
  }

  function countVisitedCountries() {
    const countries = new Set(["Spain", "Japan", "France", "United Arab Emirates", "United States"]);
    Object.keys(state.reviewedStays).forEach((stayId) => {
      const stay = data.verifiedStays.find((item) => item.id === stayId);
      if (stay) {
        countries.add(stay.country);
      }
    });
    return countries.size;
  }

  function markInteraction() {
    if (state.activeSession) {
      state.activeSession.aiCanReplaceQuestions = false;
    }
  }

  async function rerankQuestionsWithChatGPT(session) {
    const response = await callOpenAIJson({
      schemaName: "adaptive_review_question_ranking",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          questions: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                topic: { type: "string" },
                final_score: { type: "number" },
                question: { type: "string" },
                reason_short: { type: "string" },
                option_a: { type: "string" },
                option_b: { type: "string" }
              },
              required: ["topic", "final_score", "question", "reason_short", "option_a", "option_b"]
            }
          }
        },
        required: ["questions"]
      },
      systemPrompt: "You create practical, product-ready review prompts for travel apps. Always output strict JSON that follows the schema.",
      userPrompt: [
        "Rank hotel review follow-up questions for a popup survey.",
        "Goal: surface missing or stale information first, while matching the traveler's stated preferences.",
        "Hackathon constraints: low-friction, high-value questions that are useful for future shoppers.",
        "Traveler profile:",
        JSON.stringify(data.userProfile, null, 2),
        "Hotel context:",
        JSON.stringify({
          display_name: session.stay.displayName,
          city: session.stay.city,
          country: session.stay.country,
          expedia_score: session.stay.expediaScore,
          amenities: session.stay.amenityCallouts,
          summary: session.stay.propertySummary
        }, null, 2),
        "Candidate questions:",
        JSON.stringify(session.rankedQuestions.map((q) => ({
          topic: q.topic,
          local_composite_score: Number(formatScore(q.compositeScore)),
          hotel_opportunity_score: Number(formatScore(q.hotelOpportunityScore)),
          user_preference_fit: Number(formatScore(q.userPreferenceFit)),
          urgency_score: Number(formatScore(q.urgencyScore)),
          recent_signal_share: Number(q.recentSignalShare.toFixed(3)),
          days_since_last_signal: q.daysSinceLastSignal,
          question: q.question
        })), null, 2),
        "Return the best four questions in order with concise answer bubbles."
      ].join("\n")
    });

    if (!state.activeSession || state.activeSession.stayId !== session.stayId || !session.aiCanReplaceQuestions) {
      return;
    }

    const localByTopic = new Map(session.rankedQuestions.map((item) => [item.topic, item]));
    session.rankedQuestions = response.questions.map((item) => {
      const local = localByTopic.get(item.topic);
      return local ? Object.assign({}, local, {
        question: item.question,
        compositeScore: (local.compositeScore * 0.7) + (clamp(item.final_score, 0, 100) * 0.3),
        longReason: item.reason_short,
        reasonPills: [local.reasonPills[0], item.reason_short, "AI reranked"],
        options: [item.option_a, item.option_b]
      }) : null;
    }).filter(Boolean).sort((a, b) => b.compositeScore - a.compositeScore).slice(0, STRUCTURED_QUESTION_LIMIT);

    session.aiStatus = "ChatGPT personalized";
    session.aiMode = "ChatGPT reranked";
    renderModal();
  }

  async function buildAiSummary(session) {
    const answered = Object.entries(session.answers).filter((entry) => filled(entry[1])).map((entry) => {
      const prompt = entry[0] === "additional" ? session.additionalPrompt : session.rankedQuestions.find((q) => q.id === entry[0]);
      return { topic: prompt.topic, question: prompt.question, answer: entry[1].text };
    });

    const response = await callOpenAIJson({
      schemaName: "adaptive_review_summary",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          headline: { type: "string" },
          summary: { type: "string" },
          tags: { type: "array", minItems: 3, maxItems: 5, items: { type: "string" } }
        },
        required: ["headline", "summary", "tags"]
      },
      systemPrompt: "You write concise hotel review feed cards. Output strict JSON only.",
      userPrompt: [
        "Write a concise travel feed review card using the guest's answers only.",
        "Keep it grounded, helpful, and focused on the surfaced issues.",
        "Hotel:",
        JSON.stringify({
          name: session.stay.displayName,
          city: session.stay.city,
          country: session.stay.country,
          summary: session.stay.propertySummary
        }, null, 2),
        "Adaptive answers:",
        JSON.stringify(answered, null, 2),
        "Traditional review:",
        JSON.stringify({ stars: session.traditionalStars, text: session.traditionalReviewText }, null, 2)
      ].join("\n")
    });

    return { headline: response.headline, summary: response.summary, tags: response.tags, aiMode: "ChatGPT summary" };
  }

  function buildFallbackSummary(session) {
    const answered = Object.entries(session.answers).filter((entry) => filled(entry[1])).map((entry) => {
      const prompt = entry[0] === "additional" ? session.additionalPrompt : session.rankedQuestions.find((q) => q.id === entry[0]);
      return { label: data.topicLabels[prompt.topic], answer: entry[1].text };
    });
    const text = [answered[0] && answered[0].answer, answered[1] && answered[1].answer, session.traditionalReviewText]
      .filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    const tags = unique(answered.map((item) => titleCase(item.label)).slice(0, 4));
    return {
      headline: session.stay.displayName,
      summary: text || "Jamie submitted a verified stay review and added the visit to the passport.",
      tags: tags.length ? tags : ["Traditional review", "Verified stay", "Passport stamp"],
      aiMode: "Local summary"
    };
  }

  async function callOpenAIJson({ schemaName, schema, systemPrompt, userPrompt }) {
    const apiKey = resolveApiKey();
    if (!apiKey) {
      throw new Error("Missing OpenAI key");
    }
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: config.model || "gpt-5.4-mini",
        input: [
          { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
          { role: "user", content: [{ type: "input_text", text: userPrompt }] }
        ],
        text: {
          format: {
            type: "json_schema",
            name: schemaName,
            strict: true,
            schema: schema
          }
        }
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error((payload.error && payload.error.message) || "OpenAI request failed");
    }
    const text = extractResponseText(payload);
    if (!text) {
      throw new Error("No model text returned");
    }
    return JSON.parse(text);
  }

  function extractResponseText(payload) {
    if (typeof payload.output_text === "string" && payload.output_text.trim()) {
      return payload.output_text;
    }
    if (Array.isArray(payload.output)) {
      for (const item of payload.output) {
        if (Array.isArray(item.content)) {
          for (const content of item.content) {
            if (typeof content.text === "string" && content.text.trim()) {
              return content.text;
            }
          }
        }
      }
    }
    return deepText(payload);
  }

  function deepText(node) {
    if (!node || typeof node !== "object") {
      return "";
    }
    if (typeof node.text === "string" && node.text.trim()) {
      return node.text;
    }
    if (Array.isArray(node)) {
      for (const item of node) {
        const found = deepText(item);
        if (found) {
          return found;
        }
      }
      return "";
    }
    for (const key of Object.keys(node)) {
      const found = deepText(node[key]);
      if (found) {
        return found;
      }
    }
    return "";
  }

  function resolveApiKey() {
    return config.openAiApiKey || localStorage.getItem("stampedia.openai.apiKey") || "";
  }

  async function toggleVoiceCapture() {
    if (!state.activeSession || state.activeSession.submissionPending) {
      return;
    }
    markInteraction();
    if (state.speechRecognition) {
      stopVoiceCapture(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      elements.voiceStatus.textContent = "This browser does not support live voice transcription.";
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    state.speechRecognition = recognition;
    state.voiceSeedText = elements.questionResponseBox.value.trim();

    recognition.onstart = function () {
      elements.voiceButton.classList.add("listening");
      elements.voiceButton.textContent = "Stop voice response";
      elements.voiceStatus.textContent = "Listening and streaming the transcript into the response box...";
    };
    recognition.onresult = function (event) {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const chunk = event.results[index][0] ? event.results[index][0].transcript.trim() : "";
        if (!chunk) {
          continue;
        }
        if (event.results[index].isFinal) {
          finalText += chunk + " ";
        } else {
          interimText += chunk + " ";
        }
      }
      const prefix = state.voiceSeedText ? state.voiceSeedText + " " : "";
      elements.questionResponseBox.value = (prefix + finalText + interimText).replace(/\s+/g, " ").trim();
      handleQuestionInput();
    };
    recognition.onerror = function () {
      elements.voiceStatus.textContent = "Voice capture hit a browser error. You can keep typing instead.";
      stopVoiceCapture(false);
    };
    recognition.onend = function () {
      stopVoiceCapture(false);
    };
    recognition.start();
  }

  function stopVoiceCapture(silent) {
    if (!state.speechRecognition) {
      if (!silent) {
        elements.voiceStatus.textContent = "Browser voice capture is idle.";
      }
      elements.voiceButton.classList.remove("listening");
      elements.voiceButton.textContent = "Start voice response";
      return;
    }
    try {
      state.speechRecognition.stop();
    } catch (error) {
      // Ignore browser stop errors.
    }
    state.speechRecognition = null;
    elements.voiceButton.classList.remove("listening");
    elements.voiceButton.textContent = "Start voice response";
    if (!silent) {
      elements.voiceStatus.textContent = "Browser voice capture is idle.";
    }
  }

  function formatScore(value) {
    return Number(value).toFixed(1);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value)));
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  }

  function titleCase(value) {
    return String(value).split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function unique(values) {
    return Array.from(new Set(values));
  }
})();
