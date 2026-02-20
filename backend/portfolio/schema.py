from pydantic import BaseModel


class SocialLinks(BaseModel):
    github: str = ""
    linkedin: str = ""
    devto: str = ""
    twitter: str = ""
    email: str = ""


class PersonalInfo(BaseModel):
    name: str = "John Doe"
    title: str = "Software Engineer"
    bio: str = "A passionate developer building things for the web."
    location: str = "San Francisco, CA"
    avatar_url: str = "https://placehold.co/200x200?text=Avatar"
    social: SocialLinks = SocialLinks()


class Project(BaseModel):
    title: str
    description: str
    url: str = ""
    image_url: str = ""
    tags: list[str] = []
    featured: bool = False


class Education(BaseModel):
    institution: str
    degree: str
    field: str = ""
    start_year: int = 2020
    end_year: int | None = None


class JourneyEntry(BaseModel):
    year: int
    title: str
    description: str
    type: str = "work"


class WritingEntry(BaseModel):
    title: str
    description: str
    url: str = ""
    date: str = ""
    tags: list[str] = []


class SpeakingEntry(BaseModel):
    title: str
    event: str
    date: str = ""
    url: str = ""
    description: str = ""


class Testimonial(BaseModel):
    author: str
    role: str = ""
    content: str = ""
    avatar_url: str = ""


class UsesItem(BaseModel):
    name: str
    description: str = ""
    url: str = ""


class UsesCategory(BaseModel):
    category: str
    items: list[UsesItem] = []


class PortfolioData(BaseModel):
    personal: PersonalInfo = PersonalInfo()
    projects: list[Project] = []
    education: list[Education] = []
    journey: list[JourneyEntry] = []
    writing: list[WritingEntry] = []
    speaking: list[SpeakingEntry] = []
    testimonials: list[Testimonial] = []
    uses: list[UsesCategory] = []
