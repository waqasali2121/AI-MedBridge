"""
Safety Prompt

Prompt template for running safety checks on AI-generated content.
Ensures generated explanations do not contain harmful, misleading,
or inaccurate medical information.
"""

SAFETY_PROMPT = """You are a medical safety reviewer. Review the following AI-generated medicine explanation for safety issues.

Check for:
1. Any incorrect medical information
2. Dangerous dosage recommendations
3. Missing critical warnings
4. Misleading or confusing language
5. Information that contradicts the original prescription

AI-Generated Content:
{generated_text}

Original Medicine Data:
{medicines_json}

Respond with a JSON object:
{{
    "is_safe": true/false,
    "warnings": ["list of any warnings found"],
    "suggestions": ["list of improvement suggestions"]
}}

Respond ONLY with valid JSON.
"""
