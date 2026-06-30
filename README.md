# AI Resume Parser

A production-ready Streamlit application that extracts structured candidate information from PDF and DOCX resumes using OpenAI GPT-4o or Google Gemini. The app turns unstructured resumes into clean JSON and Excel exports for HR review.

## Features

- Upload `.pdf` and `.docx` resumes.
- Extract candidate name, contact details, LinkedIn/GitHub URLs, education, work experience, projects, certifications, categorized skills, and candidate fit evaluation.
- Strict Pydantic schema validation for AI output.
- Graceful handling for corrupt files, short/image-only documents, API failures, and schema errors.
- Polished green/white Streamlit interface with expandable result sections.
- Download parsed output as JSON or Excel.
- Dockerized with a multi-stage production build and health check.

## Local Setup

1. Create and activate a virtual environment.

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install dependencies.

   ```powershell
   pip install -r requirements.txt
   ```

3. Configure an API key.

   ```powershell
   $env:OPENAI_API_KEY="your_openai_api_key"
   ```

   Or, for Gemini:

   ```powershell
   $env:GEMINI_API_KEY="your_gemini_api_key"
   ```

   You can also enter either key directly in the app sidebar at runtime.

4. Run the app.

   ```powershell
   streamlit run app.py
   ```

5. Open the local URL printed by Streamlit, usually:

   ```text
   http://localhost:8501
   ```

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Required for OpenAI mode | Authenticates requests to OpenAI. |
| `GEMINI_API_KEY` | Required for Gemini mode | Authenticates requests to Google Gemini. |

The sidebar input takes precedence over environment variables for the current session.

## Docker

Build the image:

```powershell
docker build -t ai-resume-parser .
```

Run with OpenAI:

```powershell
docker run --rm -p 8501:8501 -e OPENAI_API_KEY="your_openai_api_key" ai-resume-parser
```

Run with Gemini:

```powershell
docker run --rm -p 8501:8501 -e GEMINI_API_KEY="your_gemini_api_key" ai-resume-parser
```

Then open:

```text
http://localhost:8501
```

## Streamlit Community Cloud Deployment

1. Push this repository to GitHub.
2. Go to Streamlit Community Cloud and create a new app from the repository.
3. Set the main file path to `app.py`.
4. Add `OPENAI_API_KEY` or `GEMINI_API_KEY` in the app secrets.
5. Deploy.

For Streamlit secrets, use:

```toml
OPENAI_API_KEY = "your_openai_api_key"
GEMINI_API_KEY = "your_gemini_api_key"
```

## Render Deployment

1. Push this repository to GitHub.
2. Create a new Render Web Service.
3. Choose Docker as the runtime.
4. Set environment variables:

   ```text
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Use port `8501`.
6. Deploy the service.

## Production Notes

- The app processes uploaded files in memory and does not persist resumes.
- Scanned image-only PDFs require OCR before upload.
- For sensitive HR workflows, run behind your organization's authentication layer and keep provider API keys in managed secrets.
- Use OpenAI mode with `gpt-4o` or Gemini mode with `gemini-1.5-pro` by default; both can be changed from the sidebar.
