import { create } from "zustand";
import { HTTP_BACKEND_URL } from "../config";

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    bio: string;
    location: string;
    avatar_url: string;
    social: {
      github: string;
      linkedin: string;
      twitter: string;
      email: string;
    };
  };
  projects: Array<{
    title: string;
    description: string;
    url: string;
    image_url: string;
    tags: string[];
    featured: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_year: number;
    end_year: number | null;
  }>;
  journey: Array<{
    year: number;
    title: string;
    description: string;
    type: string;
  }>;
  writing: Array<{
    title: string;
    description: string;
    url: string;
    date: string;
    tags: string[];
  }>;
  speaking: Array<{
    title: string;
    event: string;
    date: string;
    url: string;
    description: string;
  }>;
  testimonials: Array<{
    author: string;
    role: string;
    content: string;
    avatar_url: string;
  }>;
  uses: Array<{
    category: string;
    items: Array<{
      name: string;
      description: string;
      url: string;
    }>;
  }>;
}

interface PortfolioStore {
  portfolioData: PortfolioData | null;
  portfolioJson: string;
  isLoading: boolean;
  error: string | null;
  setPortfolioJson: (json: string) => void;
  fetchPortfolio: () => Promise<void>;
  savePortfolio: (
    data: PortfolioData,
    username: string,
    password: string
  ) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolioData: null,
  portfolioJson: "",
  isLoading: false,
  error: null,

  setPortfolioJson: (json: string) => {
    set({ portfolioJson: json, error: null });
    try {
      const parsed = JSON.parse(json) as PortfolioData;
      set({ portfolioData: parsed });
    } catch {
      set({ error: "Invalid JSON" });
    }
  },

  fetchPortfolio: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${HTTP_BACKEND_URL}/api/portfolio`);
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      const data = (await res.json()) as PortfolioData;
      set({
        portfolioData: data,
        portfolioJson: JSON.stringify(data, null, 2),
        isLoading: false,
      });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  savePortfolio: async (
    data: PortfolioData,
    username: string,
    password: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${HTTP_BACKEND_URL}/api/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Failed to save portfolio");
      }
      set({ isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },
}));
