import {
  API_KEY_DAILY_GENERATION_COUNTER_STORAGE_KEY,
  API_KEY_DAILY_GENERATION_LIMIT,
} from "../config";

interface DailyGenerationCounter {
  date: string;
  count: number;
}

const getToday = (): string => new Date().toISOString().slice(0, 10);

const parseCounter = (value: string | null): DailyGenerationCounter | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as DailyGenerationCounter;
    if (typeof parsed?.date !== "string" || typeof parsed?.count !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const getCounter = (): DailyGenerationCounter => {
  const today = getToday();
  const stored = parseCounter(
    window.localStorage.getItem(API_KEY_DAILY_GENERATION_COUNTER_STORAGE_KEY)
  );

  if (!stored || stored.date !== today) {
    return { date: today, count: 0 };
  }

  return stored;
};

const setCounter = (counter: DailyGenerationCounter): void => {
  window.localStorage.setItem(
    API_KEY_DAILY_GENERATION_COUNTER_STORAGE_KEY,
    JSON.stringify(counter)
  );
};

export const getApiKeyGenerationsRemaining = (): number => {
  const counter = getCounter();
  return Math.max(API_KEY_DAILY_GENERATION_LIMIT - counter.count, 0);
};

export const tryConsumeApiKeyGeneration = (): boolean => {
  const counter = getCounter();
  if (counter.count >= API_KEY_DAILY_GENERATION_LIMIT) {
    return false;
  }

  setCounter({ ...counter, count: counter.count + 1 });
  return true;
};
