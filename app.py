import io
import json
import os
import re
import tempfile
from datetime import datetime, timezone
from typing import Any, Literal

import fitz
import pandas as pd
import streamlit as st
from docx import Document
from dotenv import load_dotenv
from google import genai
from google.genai import types as genai_types
from openai import OpenAI
from pydantic import BaseModel, ConfigDict, Field, ValidationError


load_dotenv()

APP_TITLE = "AI Resume Parser"
MAX_TEXT_CHARS = 90_000
OPENAI_DEFAULT_MODEL = "gpt-4o"
GEMINI_DEFAULT_MODEL = "gemini-1.5-pro"


class ContactInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    email: str = ""
    phone: str = ""
    linkedin_url: str = ""
    github_url: str = ""
    portfolio_url: str = ""
    other_urls: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    degree: str = ""
    institution: str = ""
    year: str = ""
    gpa: str = ""
    details: str = ""


class WorkExperienceItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    company: str = ""
    title: str = ""
    start_date: str = ""
    end_date: str = ""
    location: str = ""
    key_responsibilities: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    url: str = ""


class SkillSet(BaseModel):
    model_config = ConfigDict(extra="ignore")

    technical: list[str] = Field(default_factory=list)
    soft_skills: list[str] = Field(default_factory=list)
    tools: list[str] = Field(default_factory=list)


class CandidateFit(BaseModel):
    model_config = ConfigDict(extra="ignore")

    summary: str = ""
    strengths: list[str] = Field(default_factory=list)
    gaps_or_risks: list[str] = Field(default_factory=list)
    suggested_roles: list[str] = Field(default_factory=list)
    overall_fit_score: int = Field(default=0, ge=0, le=100)


class ResumeProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")

    candidate_name: str = ""
    contact: ContactInfo = Field(default_factory=ContactInfo)
    education: list[EducationItem] = Field(default_factory=list)
    work_experience: list[WorkExperienceItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    skills: SkillSet = Field(default_factory=SkillSet)
    certifications: list[str] = Field(default_factory=list)
    candidate_fit: CandidateFit = Field(default_factory=CandidateFit)
    extraction_warnings: list[str] = Field(default_factory=list)


def configure_page() -> None:
    st.set_page_config(
        page_title=APP_TITLE,
        page_icon=":material/description:",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    st.markdown(
        """
        <style>
            :root {
                --rp-green: #16834a;
                --rp-green-dark: #0f5f38;
                --rp-green-soft: #e9f7ef;
                --rp-border: #d7eadf;
                --rp-ink: #153324;
                --rp-muted: #60746a;
                --rp-card: #ffffff;
            }
            .stApp {
                background: linear-gradient(180deg, #f6fbf8 0%, #ffffff 38%, #f8fcfa 100%);
                color: var(--rp-ink);
            }
            section[data-testid="stSidebar"] {
                background: #f0faf4;
                border-right: 1px solid var(--rp-border);
            }
            .main .block-container {
                padding-top: 2rem;
                max-width: 1180px;
            }
            h1, h2, h3 {
                color: var(--rp-ink);
                letter-spacing: 0;
            }
            .rp-hero {
                background: #ffffff;
                border: 1px solid var(--rp-border);
                border-radius: 8px;
                padding: 1.35rem 1.45rem;
                box-shadow: 0 14px 36px rgba(22, 131, 74, 0.08);
                margin-bottom: 1.25rem;
            }
            .rp-kicker {
                color: var(--rp-green-dark);
                font-weight: 700;
                font-size: .83rem;
                text-transform: uppercase;
                letter-spacing: .08em;
                margin-bottom: .35rem;
            }
            .rp-hero h1 {
                margin: 0 0 .35rem 0;
                font-size: clamp(2rem, 4vw, 3.25rem);
                line-height: 1.05;
            }
            .rp-hero p {
                color: var(--rp-muted);
                font-size: 1.02rem;
                margin: 0;
                max-width: 760px;
            }
            .rp-card {
                background: var(--rp-card);
                border: 1px solid var(--rp-border);
                border-radius: 8px;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(21, 51, 36, 0.05);
                margin-bottom: 1rem;
            }
            .rp-metric {
                background: var(--rp-green-soft);
                border: 1px solid var(--rp-border);
                border-radius: 8px;
                padding: .85rem 1rem;
                min-height: 92px;
            }
            .rp-metric-label {
                color: var(--rp-muted);
                font-size: .8rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .06em;
            }
            .rp-metric-value {
                color: var(--rp-green-dark);
                font-size: 1.5rem;
                font-weight: 800;
                margin-top: .2rem;
                word-break: break-word;
            }
            .stButton > button, .stDownloadButton > button {
                border-radius: 8px;
                border: 1px solid var(--rp-green);
                background: var(--rp-green);
                color: #ffffff;
                font-weight: 700;
            }
            .stButton > button:hover, .stDownloadButton > button:hover {
                border-color: var(--rp-green-dark);
                background: var(--rp-green-dark);
                color: #ffffff;
            }
            div[data-testid="stFileUploader"] {
                background: #ffffff;
                border: 1px dashed #7ac69b;
                border-radius: 8px;
                padding: 1rem;
            }
            div[data-testid="stExpander"] {
                border: 1px solid var(--rp-border);
                border-radius: 8px;
                background: #ffffff;
            }
            .rp-small {
                color: var(--rp-muted);
                font-size: .88rem;
            }
            .rp-chip {
                display: inline-block;
                background: #e9f7ef;
                color: #0f5f38;
                border: 1px solid #bce2cc;
                border-radius: 999px;
                padding: .25rem .55rem;
                margin: .18rem .16rem .18rem 0;
                font-size: .86rem;
                font-weight: 600;
            }
            .rp-warning {
                background: #fff8e6;
                border: 1px solid #f1d28b;
                border-radius: 8px;
                padding: .85rem 1rem;
                color: #6b4b00;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_sidebar() -> dict[str, str]:
    openai_default = read_secret_or_env("OPENAI_API_KEY")
    gemini_default = read_secret_or_env("GEMINI_API_KEY")

    with st.sidebar:
        st.markdown("## Resume Intelligence")
        st.markdown(
            """
            Upload a resume and extract structured hiring intelligence in seconds:
            contact details, education, work history, categorized skills, and a concise candidate fit summary.
            """
        )
        st.divider()
        provider = st.selectbox("AI provider", ["OpenAI", "Google Gemini"], index=0)
        openai_key = st.text_input(
            "OPENAI_API_KEY",
            value=openai_default,
            type="password",
            help="Used when OpenAI is selected.",
        )
        gemini_key = st.text_input(
            "GEMINI_API_KEY",
            value=gemini_default,
            type="password",
            help="Used when Google Gemini is selected.",
        )
        model_default = OPENAI_DEFAULT_MODEL if provider == "OpenAI" else GEMINI_DEFAULT_MODEL
        model = st.text_input("Model", value=model_default)
        st.divider()
        st.markdown(
            '<div class="rp-small">Files are processed in memory for this session. API keys entered here are not written to disk.</div>',
            unsafe_allow_html=True,
        )
    return {
        "provider": provider,
        "openai_key": openai_key.strip(),
        "gemini_key": gemini_key.strip(),
        "model": model.strip() or model_default,
    }


def read_secret_or_env(name: str) -> str:
    try:
        value = st.secrets.get(name, "")
    except Exception:
        value = ""
    return str(value or os.getenv(name, "")).strip()


def extract_pdf_text(uploaded_file: Any) -> str:
    try:
        with fitz.open(stream=uploaded_file.getvalue(), filetype="pdf") as pdf:
            pages = [page.get_text("text", sort=True) for page in pdf]
        return "\n\n".join(page.strip() for page in pages if page.strip())
    except Exception as exc:
        raise ValueError("The PDF could not be read. It may be encrypted, corrupt, or image-only.") from exc


def extract_docx_text(uploaded_file: Any) -> str:
    suffix = ".docx"
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(uploaded_file.getvalue())
            temp_path = temp_file.name
        document = Document(temp_path)
        paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs if paragraph.text.strip()]
        table_text: list[str] = []
        for table in document.tables:
            for row in table.rows:
                cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if cells:
                    table_text.append(" | ".join(cells))
        return "\n".join(paragraphs + table_text)
    except Exception as exc:
        raise ValueError("The DOCX file could not be read. It may be corrupt or password protected.") from exc
    finally:
        if "temp_path" in locals() and os.path.exists(temp_path):
            os.remove(temp_path)


def extract_resume_text(uploaded_file: Any) -> str:
    file_name = uploaded_file.name.lower()
    if file_name.endswith(".pdf"):
        text = extract_pdf_text(uploaded_file)
    elif file_name.endswith(".docx"):
        text = extract_docx_text(uploaded_file)
    else:
        raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")

    cleaned = normalize_text(text)
    if len(cleaned) < 80:
        raise ValueError("The resume text is too short to parse reliably. Try a text-based PDF or DOCX file.")
    if len(cleaned) > MAX_TEXT_CHARS:
        cleaned = cleaned[:MAX_TEXT_CHARS]
    return cleaned


def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def build_extraction_prompt(resume_text: str) -> list[dict[str, str]]:
    system = (
        "You are a senior HR analyst and resume parsing engine. Extract only information supported by the resume. "
        "Return a complete structured profile. Use empty strings, empty arrays, or score 0 when information is absent. "
        "Keep responsibilities concise and factual. Do not invent employers, dates, degrees, links, or scores."
    )
    user = (
        "Parse this resume into the required schema. Categorize skills into technical, soft_skills, and tools. "
        "The candidate_fit.overall_fit_score should reflect general professional fit from 0 to 100 based only on the resume.\n\n"
        f"RESUME TEXT:\n{resume_text}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def parse_with_openai(resume_text: str, api_key: str, model: str) -> ResumeProfile:
    if not api_key:
        raise RuntimeError("Enter an OPENAI_API_KEY in the sidebar or set it as an environment variable.")

    client = OpenAI(api_key=api_key)
    messages = build_extraction_prompt(resume_text)
    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=messages,
            response_format=ResumeProfile,
            temperature=0,
        )
        parsed = completion.choices[0].message.parsed
        if parsed is None:
            content = completion.choices[0].message.content or "{}"
            return parse_json_payload(content)
        return parsed
    except ValidationError:
        raise
    except Exception as exc:
        raise RuntimeError(f"OpenAI extraction failed: {exc}") from exc


def parse_with_gemini(resume_text: str, api_key: str, model: str) -> ResumeProfile:
    if not api_key:
        raise RuntimeError("Enter a GEMINI_API_KEY in the sidebar or set it as an environment variable.")

    client = genai.Client(api_key=api_key)
    messages = build_extraction_prompt(resume_text)
    prompt = f"{messages[0]['content']}\n\n{messages[1]['content']}"
    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                temperature=0,
                response_mime_type="application/json",
                response_schema=ResumeProfile,
            ),
        )
        if getattr(response, "parsed", None):
            return ResumeProfile.model_validate(response.parsed)
        return parse_json_payload(response.text or "{}")
    except ValidationError:
        raise
    except Exception as exc:
        raise RuntimeError(f"Gemini extraction failed: {exc}") from exc


def parse_json_payload(payload: str) -> ResumeProfile:
    try:
        return ResumeProfile.model_validate_json(payload)
    except ValidationError:
        raise
    except Exception:
        match = re.search(r"\{.*\}", payload, flags=re.DOTALL)
        if not match:
            raise ValueError("The AI response did not contain a JSON object.")
        return ResumeProfile.model_validate(json.loads(match.group(0)))


def fallback_contact_scan(profile: ResumeProfile, resume_text: str) -> ResumeProfile:
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", resume_text)
    phone_match = re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", resume_text)
    urls = re.findall(r"https?://[^\s)>\]]+|(?:www\.)[^\s)>\]]+", resume_text, flags=re.IGNORECASE)

    if not profile.contact.email and email_match:
        profile.contact.email = email_match.group(0)
    if not profile.contact.phone and phone_match:
        profile.contact.phone = phone_match.group(0).strip()

    normalized_urls = [url.rstrip(".,;") for url in urls]
    for url in normalized_urls:
        lowered = url.lower()
        if "linkedin.com" in lowered and not profile.contact.linkedin_url:
            profile.contact.linkedin_url = url
        elif "github.com" in lowered and not profile.contact.github_url:
            profile.contact.github_url = url
        elif url not in profile.contact.other_urls:
            profile.contact.other_urls.append(url)
    return profile


def parse_resume(provider: str, resume_text: str, openai_key: str, gemini_key: str, model: str) -> ResumeProfile:
    if provider == "OpenAI":
        profile = parse_with_openai(resume_text, openai_key, model)
    else:
        profile = parse_with_gemini(resume_text, gemini_key, model)
    return fallback_contact_scan(profile, resume_text)


def profile_to_json(profile: ResumeProfile) -> str:
    payload = profile.model_dump()
    payload["exported_at"] = datetime.now(timezone.utc).isoformat()
    return json.dumps(payload, indent=2, ensure_ascii=False)


def list_to_dataframe(items: list[BaseModel] | list[str], column_name: str = "Value") -> pd.DataFrame:
    if not items:
        return pd.DataFrame()
    if isinstance(items[0], BaseModel):
        return pd.DataFrame([item.model_dump() for item in items])
    return pd.DataFrame({column_name: items})


def profile_to_excel(profile: ResumeProfile) -> bytes:
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        overview = pd.DataFrame(
            [
                {
                    "Candidate Name": profile.candidate_name,
                    "Email": profile.contact.email,
                    "Phone": profile.contact.phone,
                    "LinkedIn": profile.contact.linkedin_url,
                    "GitHub": profile.contact.github_url,
                    "Portfolio": profile.contact.portfolio_url,
                    "Fit Score": profile.candidate_fit.overall_fit_score,
                    "Summary": profile.candidate_fit.summary,
                }
            ]
        )
        overview.to_excel(writer, sheet_name="Overview", index=False)
        list_to_dataframe(profile.education).to_excel(writer, sheet_name="Education", index=False)
        work_rows = []
        for item in profile.work_experience:
            row = item.model_dump()
            row["key_responsibilities"] = "\n".join(item.key_responsibilities)
            row["achievements"] = "\n".join(item.achievements)
            work_rows.append(row)
        pd.DataFrame(work_rows).to_excel(writer, sheet_name="Experience", index=False)
        pd.DataFrame(
            [
                {"Category": "Technical", "Skill": skill}
                for skill in profile.skills.technical
            ]
            + [{"Category": "Soft Skills", "Skill": skill} for skill in profile.skills.soft_skills]
            + [{"Category": "Tools", "Skill": skill} for skill in profile.skills.tools]
        ).to_excel(writer, sheet_name="Skills", index=False)
        list_to_dataframe(profile.projects).to_excel(writer, sheet_name="Projects", index=False)
        list_to_dataframe(profile.certifications, "Certification").to_excel(writer, sheet_name="Certifications", index=False)
        pd.DataFrame(
            {
                "Strengths": pd.Series(profile.candidate_fit.strengths),
                "Gaps or Risks": pd.Series(profile.candidate_fit.gaps_or_risks),
                "Suggested Roles": pd.Series(profile.candidate_fit.suggested_roles),
            }
        ).to_excel(writer, sheet_name="Candidate Fit", index=False)
    return output.getvalue()


def render_metric(label: str, value: str | int) -> None:
    display_value = value if value not in ["", None] else "Not found"
    st.markdown(
        f"""
        <div class="rp-metric">
            <div class="rp-metric-label">{escape_html(str(label))}</div>
            <div class="rp-metric-value">{escape_html(str(display_value))}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_chips(title: str, values: list[str]) -> None:
    st.markdown(f"**{title}**")
    if not values:
        st.caption("No items found.")
        return
    chips = "".join(f'<span class="rp-chip">{escape_html(value)}</span>' for value in values)
    st.markdown(chips, unsafe_allow_html=True)


def escape_html(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


def render_profile(profile: ResumeProfile) -> None:
    st.markdown("## Extracted Candidate Profile")
    col1, col2, col3 = st.columns(3)
    with col1:
        render_metric("Candidate", profile.candidate_name)
    with col2:
        render_metric("Email", profile.contact.email)
    with col3:
        render_metric("Fit Score", f"{profile.candidate_fit.overall_fit_score}/100")

    st.markdown('<div class="rp-card">', unsafe_allow_html=True)
    st.markdown("### Candidate Fit")
    st.write(profile.candidate_fit.summary or "No summary was extracted.")
    fit_cols = st.columns(3)
    with fit_cols[0]:
        render_chips("Strengths", profile.candidate_fit.strengths)
    with fit_cols[1]:
        render_chips("Gaps or Risks", profile.candidate_fit.gaps_or_risks)
    with fit_cols[2]:
        render_chips("Suggested Roles", profile.candidate_fit.suggested_roles)
    st.markdown("</div>", unsafe_allow_html=True)

    with st.expander("Contact Details", expanded=True):
        st.table(
            pd.DataFrame(
                [
                    {"Field": "Phone", "Value": profile.contact.phone},
                    {"Field": "LinkedIn", "Value": profile.contact.linkedin_url},
                    {"Field": "GitHub", "Value": profile.contact.github_url},
                    {"Field": "Portfolio", "Value": profile.contact.portfolio_url},
                    {"Field": "Other URLs", "Value": ", ".join(profile.contact.other_urls)},
                ]
            )
        )

    with st.expander("Education", expanded=True):
        education_df = list_to_dataframe(profile.education)
        if education_df.empty:
            st.info("No education entries found.")
        else:
            st.dataframe(education_df, use_container_width=True, hide_index=True)

    with st.expander("Work Experience", expanded=True):
        if not profile.work_experience:
            st.info("No work experience entries found.")
        for item in profile.work_experience:
            st.markdown(f"#### {item.title or 'Role'} at {item.company or 'Company'}")
            dates = " - ".join(part for part in [item.start_date, item.end_date] if part)
            if dates or item.location:
                st.caption(" | ".join(part for part in [dates, item.location] if part))
            for responsibility in item.key_responsibilities:
                st.markdown(f"- {responsibility}")
            if item.achievements:
                st.markdown("**Achievements**")
                for achievement in item.achievements:
                    st.markdown(f"- {achievement}")

    with st.expander("Skills", expanded=True):
        skill_cols = st.columns(3)
        with skill_cols[0]:
            render_chips("Technical", profile.skills.technical)
        with skill_cols[1]:
            render_chips("Soft Skills", profile.skills.soft_skills)
        with skill_cols[2]:
            render_chips("Tools", profile.skills.tools)

    with st.expander("Projects and Certifications"):
        projects_df = list_to_dataframe(profile.projects)
        if projects_df.empty:
            st.info("No project entries found.")
        else:
            st.dataframe(projects_df, use_container_width=True, hide_index=True)
        render_chips("Certifications", profile.certifications)

    if profile.extraction_warnings:
        st.markdown('<div class="rp-warning">', unsafe_allow_html=True)
        st.markdown("**Extraction warnings**")
        for warning in profile.extraction_warnings:
            st.markdown(f"- {warning}")
        st.markdown("</div>", unsafe_allow_html=True)

    json_data = profile_to_json(profile)
    excel_data = profile_to_excel(profile)
    export_col1, export_col2 = st.columns([1, 1])
    with export_col1:
        st.download_button(
            "Download as JSON",
            data=json_data,
            file_name=safe_export_name(profile.candidate_name, "json"),
            mime="application/json",
            use_container_width=True,
        )
    with export_col2:
        st.download_button(
            "Export to Excel",
            data=excel_data,
            file_name=safe_export_name(profile.candidate_name, "xlsx"),
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            use_container_width=True,
        )


def safe_export_name(candidate_name: str, extension: Literal["json", "xlsx"]) -> str:
    base = re.sub(r"[^A-Za-z0-9_-]+", "_", candidate_name.strip()) if candidate_name else "resume_profile"
    return f"{base.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{extension}"


def main() -> None:
    configure_page()
    settings = render_sidebar()

    st.markdown(
        """
        <div class="rp-hero">
            <div class="rp-kicker">AI-powered HR workflow</div>
            <h1>Parse resumes into hiring-ready profiles.</h1>
            <p>Upload a PDF or DOCX resume, extract clean structured data, review candidate fit, and export the result as JSON or Excel.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    uploaded_file = st.file_uploader(
        "Drag and drop a resume",
        type=["pdf", "docx"],
        accept_multiple_files=False,
        help="Supported formats: PDF and DOCX.",
    )

    if uploaded_file:
        st.markdown(
            f'<div class="rp-small">Selected file: <strong>{escape_html(uploaded_file.name)}</strong> ({uploaded_file.size / 1024:.1f} KB)</div>',
            unsafe_allow_html=True,
        )

    parse_clicked = st.button("Extract Resume Data", type="primary", use_container_width=True, disabled=uploaded_file is None)

    if parse_clicked and uploaded_file is not None:
        try:
            with st.status("Reading resume text...", expanded=False) as status:
                resume_text = extract_resume_text(uploaded_file)
                status.update(label="Calling AI model and validating schema...", state="running")
                profile = parse_resume(
                    provider=settings["provider"],
                    resume_text=resume_text,
                    openai_key=settings["openai_key"],
                    gemini_key=settings["gemini_key"],
                    model=settings["model"],
                )
                status.update(label="Resume parsed successfully.", state="complete")
            st.session_state["profile"] = profile
        except ValidationError as exc:
            st.error("The AI response did not match the required schema.")
            with st.expander("Schema details"):
                st.json(exc.errors())
        except Exception as exc:
            st.error(str(exc))

    if "profile" in st.session_state:
        render_profile(st.session_state["profile"])


if __name__ == "__main__":
    main()
