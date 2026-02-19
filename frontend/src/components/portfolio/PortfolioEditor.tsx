import { useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePortfolioStore } from "../../store/portfolio-store";

function PortfolioEditor() {
  const {
    portfolioJson,
    setPortfolioJson,
    fetchPortfolio,
    isLoading,
    error,
  } = usePortfolioStore();

  useEffect(() => {
    if (!portfolioJson) {
      fetchPortfolio();
    }
  }, [portfolioJson, fetchPortfolio]);

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Portfolio Data
        </h3>
        <Button
          onClick={fetchPortfolio}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Reload"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 rounded px-2 py-1">
          {error}
        </div>
      )}

      <Textarea
        className="font-mono text-xs min-h-[300px] resize-y"
        value={portfolioJson}
        onChange={(e) => setPortfolioJson(e.target.value)}
        placeholder="Loading portfolio data..."
      />

      <p className="text-xs text-gray-400">
        Edit the JSON above to customize your portfolio content. Changes are
        used for the next generation.
      </p>
    </div>
  );
}

export default PortfolioEditor;
