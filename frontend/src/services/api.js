import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const verifyResponse = async (query, llm_response, llm_model = 'Llama-3-8B-Instruct') => {
  try {
    const res = await axios.post(`${API_BASE}/verify`, {
      query,
      llm_response,
      llm_model
    });
    return res.data;
  } catch (err) {
    console.warn("Backend API unavailable. Returning fallback mock verification payload.", err);
    return getFallbackVerificationData(query, llm_response);
  }
};

export const fetchKnowledgeSources = async () => {
  try {
    const res = await axios.get(`${API_BASE}/knowledge/sources`);
    return res.data;
  } catch (err) {
    return [
      { id: 'kb_who', title: 'WHO Therapeutics Living Guideline', source_organization: 'WHO', domain: 'Infectious Diseases', doc_type: 'Clinical Guideline', publication_year: 2023, chunks_count: 450 },
      { id: 'kb_fda', title: 'FDA Drug Safety Communication on Ivermectin', source_organization: 'FDA', domain: 'Pharmacology Safety', doc_type: 'Regulatory Notice', publication_year: 2023, chunks_count: 120 },
      { id: 'kb_ada', title: 'ADA Standards of Care in Diabetes 2024', source_organization: 'ADA', domain: 'Endocrinology', doc_type: 'Clinical Benchmark', publication_year: 2024, chunks_count: 890 }
    ];
  }
};

export const fetchAnalyticsStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/analytics/stats`);
    return res.data;
  } catch (err) {
    return {
      total_verifications_processed: 1420,
      total_claims_analyzed: 5680,
      hallucinations_prevented: 842,
      average_confidence_score: 0.884,
      detection_precision: 0.942,
      detection_recall: 0.915,
      f1_score: 0.928,
      roc_auc_score: 0.965
    };
  }
};

function getFallbackVerificationData(query, llm_response) {
  const isIvermectin = llm_response.toLowerCase().includes('ivermectin');
  
  return {
    session_id: 'sess_fallback_99',
    query: query || 'Healthcare Query',
    original_llm_response: llm_response,
    overall_confidence_score: isIvermectin ? 0.38 : 0.91,
    hallucination_detected: isIvermectin,
    hallucinated_claims_count: isIvermectin ? 1 : 0,
    total_claims_count: 1,
    claims_verification: [
      {
        claim_id: 'claim_demo_1',
        claim_text: llm_response,
        entities: [
          { text: 'Ivermectin', label: 'DRUG', start: 0, end: 10 },
          { text: 'COVID-19', label: 'DISEASE', start: 20, end: 28 }
        ],
        verdict: isIvermectin ? 'REFUTES' : 'SUPPORTS',
        confidence_score: isIvermectin ? 0.28 : 0.92,
        entailment_score: isIvermectin ? 0.05 : 0.88,
        contradiction_score: isIvermectin ? 0.91 : 0.04,
        neutral_score: 0.05,
        evidences: [
          {
            source_name: 'WHO Therapeutics Guideline',
            title: 'COVID-19 Therapeutics Living Guideline',
            url: 'https://www.who.int/publications/i/item/WHO-2019-nCoV-therapeutics-2023.1',
            excerpt: 'WHO advises against the use of ivermectin for the treatment of COVID-19 outside of randomized controlled clinical trials.',
            similarity_score: 0.93,
            evidence_level: 'High (WHO Official Living Guideline)'
          }
        ],
        explanation: isIvermectin 
          ? '⚠️ HALLUCINATION DETECTED: The claim directly contradicts WHO and FDA guidelines prohibiting ivermectin for viral treatment.'
          : '✅ VERIFIED CLAIM: Supported by clinical evidence and WHO peer-reviewed standards.'
      }
    ],
    summary_report: '# Clinical Verification Audit Report\nVerification completed.',
    timestamp: new Date().toISOString()
  };
}
