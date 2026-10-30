import { useEffect, useState } from "react";
import "./App.css";

const RECIPES_API_URL = "https://dummyjson.com/recipes?limit=0";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecipes() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(RECIPES_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`The recipe service returned ${response.status}.`);
        }

        const data = await response.json();

        if (!Array.isArray(data.recipes)) {
          throw new Error(
            "The recipe service returned an unexpected response.",
          );
        }

        setRecipes(data.recipes);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load recipes.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipes();

    return () => controller.abort();
  }, [retryCount]);

  const mealTypes = [
    ...new Set(
      recipes.flatMap((recipe) =>
        Array.isArray(recipe.mealType) ? recipe.mealType : [],
      ),
    ),
  ].sort();

  const visibleRecipes =
    selectedMealType === "All"
      ? recipes
      : recipes.filter((recipe) =>
          Array.isArray(recipe.mealType)
            ? recipe.mealType.includes(selectedMealType)
            : false,
        );

  return (
    <main className="menu-container">
      <header className="menu-header">
        <p className="menu-eyebrow">Fresh ideas for every meal</p>
        <h1>Our Menu</h1>
        <div className="underline"></div>
        <p className="menu-subtitle">
          Explore recipes from around the world, served up fresh.
        </p>
      </header>

      <nav className="menu-buttons" aria-label="Filter recipes by meal type">
        {["All", ...mealTypes].map((mealType) => (
          <button
            className={selectedMealType === mealType ? "active" : ""}
            key={mealType}
            type="button"
            aria-pressed={selectedMealType === mealType}
            onClick={() => setSelectedMealType(mealType)}
          >
            {mealType}
          </button>
        ))}
      </nav>

      {isLoading && (
        <p className="menu-state" role="status">
          Loading recipes...
        </p>
      )}

      {!isLoading && error && (
        <div className="menu-state menu-error" role="alert">
          <p>We couldn&apos;t load the menu. {error}</p>
          <button
            className="retry-button"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && visibleRecipes.length === 0 && (
        <p className="menu-state" role="status">
          No recipes found for this meal type.
        </p>
      )}

      {!isLoading && !error && visibleRecipes.length > 0 && (
        <section className="menu-grid" aria-label="Recipes">
          {visibleRecipes.map((recipe) => {
            const totalMinutes =
              (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
            const description = Array.isArray(recipe.instructions)
              ? recipe.instructions[0]
              : "";

            return (
              <article className="menu-card" key={recipe.id}>
                <img src={recipe.image} alt={recipe.name} loading="lazy" />
                <div className="menu-info">
                  <div className="menu-title">
                    <h2>{recipe.name}</h2>
                    <span>
                      {typeof recipe.rating === "number"
                        ? `${recipe.rating.toFixed(1)} ★`
                        : recipe.cuisine}
                    </span>
                  </div>
                  <p className="recipe-meta">
                    {recipe.cuisine}
                    {totalMinutes > 0 ? ` · ${totalMinutes} min` : ""}
                  </p>
                  <p>{description || "Recipe details are not available."}</p>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;
