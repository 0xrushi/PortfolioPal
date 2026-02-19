import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { HTTP_BACKEND_URL } from "../../config";
import toast from "react-hot-toast";
import { FaSave } from "react-icons/fa";

interface SaveThemeDialogProps {
  code: string;
}

function SaveThemeDialog({ code }: SaveThemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [themeName, setThemeName] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!password) {
      toast.error("Please enter the admin password");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${HTTP_BACKEND_URL}/api/themes/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`admin:${password}`),
        },
        body: JSON.stringify({
          code,
          theme_name: themeName.trim() || "untitled",
        }),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid password");
        throw new Error("Failed to save");
      }

      toast.success("Saved! Refresh your portfolio site to see changes.");
      setOpen(false);
      setPassword("");
      setThemeName("");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <FaSave size={12} />
          Save to Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Save to Portfolio</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 -mt-1">
          Writes <code>index.html</code> to your portfolio's public folder. Refresh your site to see the update.
        </p>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <Label htmlFor="theme-name">Theme name (optional)</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="my-theme"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div>
            <Label htmlFor="password">Admin password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Apply to my-portfolio/"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SaveThemeDialog;
