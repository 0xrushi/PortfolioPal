from typing import Literal, TypedDict, List


class SystemPrompts(TypedDict):
    astro_blog: str


class PromptContent(TypedDict):
    """Unified structure for prompt text and images."""

    text: str
    images: List[str]


Stack = Literal["astro_blog"]
