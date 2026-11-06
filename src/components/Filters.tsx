import { apparelSizes, categories, type Category, type Filters } from "../types";

export function FiltersPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  function toggleCategory(category: Category) {
    const categoriesSelected = filters.categories.includes(category)
      ? filters.categories.filter((entry) => entry !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: categoriesSelected });
  }

  function toggleSize(size: string) {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter((entry) => entry !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes });
  }

  return (
    <aside className="filters">
      <h2>filters:</h2>
      <div className="filter-group">
        <p className="filter-label">price</p>
        <label className="price-row">
          Min
          <input
            inputMode="decimal"
            value={filters.min}
            onChange={(event) => onChange({ ...filters, min: event.target.value })}
            aria-label="Minimum price"
          />
        </label>
        <label className="price-row">
          Max
          <input
            inputMode="decimal"
            value={filters.max}
            onChange={(event) => onChange({ ...filters, max: event.target.value })}
            aria-label="Maximum price"
          />
        </label>
      </div>
      <div className="filter-group">
        <p className="filter-label">typ</p>
        <div className="type-grid">
          {categories.map((category) => (
            <label key={category} className={filters.categories.includes(category) ? "is-on" : ""}>
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <p className="filter-label">apparel sizes:</p>
        <div className="size-row">
          {[...apparelSizes].reverse().map((size) => (
            <button
              key={size}
              type="button"
              className={filters.sizes.includes(size) ? "is-on" : ""}
              onClick={() => toggleSize(size)}
              aria-pressed={filters.sizes.includes(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <img className="print-sizes" src="/assets/print-sizes.svg" alt="print sizes: A5 A4 A3 A2 A1. All sizes combined." />
    </aside>
  );
}
