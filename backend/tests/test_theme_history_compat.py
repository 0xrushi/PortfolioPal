import json

import pytest


@pytest.mark.asyncio
async def test_theme_history_legacy_entries_are_tolerated(
    tmp_path, monkeypatch
) -> None:
    from routes import theme_save

    history_file = tmp_path / "history.json"
    monkeypatch.setattr(theme_save, "HISTORY_FILE", history_file)

    history_file.write_text(
        json.dumps(
            [
                {
                    "id": "legacy_1",
                    "theme_name": "old",
                    "applied_at": "2026-02-19T08:26:39.440968",
                    "preview_snippet": "<!doctype html><html><head></head><body>legacy</body></html>",
                },
                {
                    "id": "new_1",
                    "theme_name": "new",
                    "generated_at": "2026-02-20T03:15:05.894088",
                    "saved": False,
                    "code": "<!doctype html><html><head></head><body>new</body></html>",
                },
                {
                    "id": "bad_1",
                    "theme_name": "bad",
                    "generated_at": "2026-02-20T03:15:05.894088",
                    "saved": False,
                    "code": "   ",
                },
            ]
        )
    )

    entries = await theme_save.get_history()

    assert [e.id for e in entries] == ["legacy_1", "new_1"]
    assert entries[0].generated_at == "2026-02-19T08:26:39.440968"
    assert entries[0].saved is True
    assert "legacy" in entries[0].code
